#!/usr/bin/env node

/**
 * Computes WCAG contrast ratios for theme colors
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text
 */

// Theme colors from web/lib/themes.ts
const themes = {
  light: {
    appBg: '#FAFAFA',
    textTertiary: '#6B6B6B',
    headerBg: '#FFFFFF',
    bg: '#FFFFFF',
  },
  dim: {
    appBg: '#10171E',
    textTertiary: '#8B98A5',
  },
  dark: {
    appBg: '#0A0A0A',
    textTertiary: '#8B98A5',
  },
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Calculate relative luminance
function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Calculate contrast ratio
function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b)
  
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

// Apply opacity to foreground color over background
function applyOpacity(fgHex, bgHex, opacity) {
  const fg = hexToRgb(fgHex)
  const bg = hexToRgb(bgHex)
  
  const r = Math.round(fg.r * opacity + bg.r * (1 - opacity))
  const g = Math.round(fg.g * opacity + bg.g * (1 - opacity))
  const b = Math.round(fg.b * opacity + bg.b * (1 - opacity))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

console.log('WCAG Contrast Ratios (AA requires 4.5:1 for normal text)\n')
console.log('=' .repeat(70))

// Privacy footer (textTertiary at 0.95 opacity on appBg)
console.log('\n1. Privacy Footer (textTertiary × 0.95 on appBg):')
Object.keys(themes).forEach(themeName => {
  const theme = themes[themeName]
  const effectiveColor = applyOpacity(theme.textTertiary, theme.appBg, 0.95)
  const ratio = contrastRatio(effectiveColor, theme.appBg)
  const pass = ratio >= 4.5 ? '✓ PASS' : '✗ FAIL'
  console.log(`   ${themeName.padEnd(6)}: ${ratio.toFixed(2)}:1  ${pass}`)
  console.log(`            (${theme.textTertiary} @ 0.95 → ${effectiveColor} on ${theme.appBg})`)
})

// URL input placeholder (textPrimary at 0.60 opacity on headerBg)
console.log('\n2. URL Input Placeholder (textPrimary × 0.60 on headerBg):')
// For light theme as example
const lightTextPrimary = '#000000'
const effectivePlaceholder = applyOpacity(lightTextPrimary, themes.light.headerBg, 0.60)
const placeholderRatio = contrastRatio(effectivePlaceholder, themes.light.headerBg)
const placeholderPass = placeholderRatio >= 4.5 ? '✓ PASS' : '✗ FAIL'
console.log(`   light  : ${placeholderRatio.toFixed(2)}:1  ${placeholderPass}`)
console.log(`            (${lightTextPrimary} @ 0.60 → ${effectivePlaceholder} on ${themes.light.headerBg})`)

// Card text tertiary on light theme (textTertiary on bg)
console.log('\n3. Card Tertiary Text on Light Theme (textTertiary on bg):')
const cardRatio = contrastRatio('#6B6B6B', '#FFFFFF')
const cardPass = cardRatio >= 4.5 ? '✓ PASS' : '✗ FAIL'
console.log(`   light  : ${cardRatio.toFixed(2)}:1  ${cardPass}`)
console.log(`            (#6B6B6B on #FFFFFF)`)

console.log('\n' + '='.repeat(70))
console.log('\nSummary:')
console.log('Changes made to meet WCAG AA (4.5:1):')
console.log('- Privacy footer: Increased opacity 0.6→0.95, darkened textTertiary')
console.log('- URL placeholder: Increased opacity from 0.4 to 0.60')
console.log('- Card tertiary (light): Changed from #999999 to #6B6B6B')
console.log('- Dim/dark textTertiary: Changed to #8B98A5 for better contrast')
