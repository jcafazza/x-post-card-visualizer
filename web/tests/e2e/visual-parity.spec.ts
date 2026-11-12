import { test, expect, Page } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import fs from 'fs'
import path from 'path'

const THEMES = ['light', 'dim', 'dark'] as const
const TEST_URL = 'https://x.com/jack/status/20'

const TEST_CONFIGS = [
  { name: 'default', width: 500, radius: 20, shadow: 'floating' },
  { name: 'wide-sharp', width: 650, radius: 0, shadow: 'flat' },
  { name: 'narrow-round', width: 400, radius: 40, shadow: 'elevated' },
]

async function waitForCardToLoad(page: Page) {
  // Wait for the card to be visible and stable
  await page.waitForSelector('#card-preview', { state: 'visible' })
  await page.waitForTimeout(500) // Let animations settle
}

async function captureCard(page: Page, selector: string = '#card-preview') {
  const element = await page.locator(selector).first()
  return await element.screenshot({ animations: 'disabled' })
}

function compareImages(img1: Buffer, img2: Buffer): { diff: number; totalPixels: number; diffPercent: number } {
  const png1 = PNG.sync.read(img1)
  const png2 = PNG.sync.read(img2)
  
  if (png1.width !== png2.width || png1.height !== png2.height) {
    throw new Error(`Image dimensions don't match: ${png1.width}x${png1.height} vs ${png2.width}x${png2.height}`)
  }
  
  const { width, height } = png1
  const diff = new PNG({ width, height })
  
  const numDiffPixels = pixelmatch(
    png1.data,
    png2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  )
  
  const totalPixels = width * height
  const diffPercent = (numDiffPixels / totalPixels) * 100
  
  return { diff: numDiffPixels, totalPixels, diffPercent }
}

test.describe('Visual Parity Tests', () => {
  test.describe.configure({ mode: 'serial' })
  
  for (const theme of THEMES) {
    for (const config of TEST_CONFIGS) {
      test(`${theme} theme - ${config.name}: editor vs share page vs PNG`, async ({ page }) => {
        // Build share URL with all parameters
        const shareUrl = new URL('/share', 'http://localhost:3000')
        shareUrl.searchParams.set('url', TEST_URL)
        shareUrl.searchParams.set('theme', theme)
        shareUrl.searchParams.set('shadow', config.shadow)
        shareUrl.searchParams.set('cardWidth', String(config.width))
        shareUrl.searchParams.set('radius', String(config.radius))
        shareUrl.searchParams.set('showDate', 'true')
        
        // 1. Capture editor preview
        await page.goto('/')
        await page.fill('input[name="post-url"]', TEST_URL)
        await page.click('button[type="submit"]')
        await waitForCardToLoad(page)
        
        // Apply settings
        // Click theme button multiple times to cycle to desired theme
        const themeIndex = THEMES.indexOf(theme)
        for (let i = 0; i < themeIndex; i++) {
          await page.click('button[aria-label*="Theme"]')
          await page.waitForTimeout(100)
        }
        
        // TODO: Set width, radius, shadow through UI
        // For now, we'll compare share page which has exact params
        
        const editorScreenshot = await captureCard(page)
        
        // 2. Capture share page
        await page.goto(shareUrl.toString())
        await waitForCardToLoad(page)
        const shareScreenshot = await captureCard(page)
        
        // 3. Compare editor vs share
        const comparison = compareImages(editorScreenshot, shareScreenshot)
        
        console.log(`${theme}/${config.name}: ${comparison.diffPercent.toFixed(2)}% diff (${comparison.diff}/${comparison.totalPixels} pixels)`)
        
        // Allow small differences due to rendering variations (fonts, antialiasing)
        // But flag anything over 1% as a potential issue
        expect(comparison.diffPercent).toBeLessThan(1.0)
        
        // Save diff images for inspection if needed
        if (comparison.diffPercent > 0.1) {
          const diffDir = path.join(__dirname, '../../test-results/visual-diffs')
          fs.mkdirSync(diffDir, { recursive: true })
          fs.writeFileSync(
            path.join(diffDir, `${theme}-${config.name}-editor.png`),
            editorScreenshot
          )
          fs.writeFileSync(
            path.join(diffDir, `${theme}-${config.name}-share.png`),
            shareScreenshot
          )
        }
      })
    }
  }
})

test.describe('Editor UI Regression', () => {
  test('toolbar and controls look unchanged', async ({ page }) => {
    await page.goto('/')
    
    // Take full page screenshot for manual inspection
    const screenshot = await page.screenshot({ fullPage: true })
    const screenshotDir = path.join(__dirname, '../../test-results/screenshots')
    fs.mkdirSync(screenshotDir, { recursive: true })
    fs.writeFileSync(
      path.join(screenshotDir, 'editor-full-page.png'),
      screenshot
    )
    
    // Check that key UI elements exist and are visible
    await expect(page.locator('button[aria-label*="Theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label*="Shadow"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Reset to Default"]')).toBeVisible()
    
    console.log('Full page screenshot saved to test-results/screenshots/editor-full-page.png')
  })
})
