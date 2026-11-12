import { describe, it, expect } from 'vitest'
import { buildSnippet } from './snippet'
import { CardSettings } from '@/types/post'

describe('buildSnippet', () => {
  const baseSettings: CardSettings = {
    theme: 'dark',
    borderRadius: '20',
    shadowIntensity: 'floating',
    showDate: true,
    cardWidth: 500,
    customBorderRadius: 20,
  }

  it('does not include npm install line', () => {
    const snippet = buildSnippet(baseSettings, 'https://x.com/user/status/123')
    
    expect(snippet).not.toContain('npm install')
    expect(snippet.startsWith('import { XCard }')).toBe(true)
  })

  it('reflects current theme setting', () => {
    const snippet = buildSnippet({ ...baseSettings, theme: 'light' }, 'https://x.com/test/status/1')
    
    expect(snippet).toContain('theme="light"')
    expect(snippet).not.toContain('theme="dark"')
  })

  it('reflects current shadow setting', () => {
    const snippet = buildSnippet({ ...baseSettings, shadowIntensity: 'elevated' }, 'https://x.com/test/status/1')
    
    expect(snippet).toContain('shadow="elevated"')
    expect(snippet).not.toContain('shadow="floating"')
  })

  it('reflects current width', () => {
    const snippet = buildSnippet({ ...baseSettings, cardWidth: 650 }, 'https://x.com/test/status/1')
    
    expect(snippet).toContain('width={650}')
  })

  it('reflects custom border radius', () => {
    const snippet = buildSnippet({ ...baseSettings, customBorderRadius: 32 }, 'https://x.com/test/status/1')
    
    expect(snippet).toContain('radius={32}')
  })

  it('reflects showDate setting', () => {
    const snippetWithDate = buildSnippet({ ...baseSettings, showDate: true }, 'https://x.com/test/status/1')
    const snippetWithoutDate = buildSnippet({ ...baseSettings, showDate: false }, 'https://x.com/test/status/1')
    
    expect(snippetWithDate).toContain('showDate={true}')
    expect(snippetWithoutDate).toContain('showDate={false}')
  })

  it('uses source URL when provided', () => {
    const url = 'https://x.com/elonmusk/status/123456'
    const snippet = buildSnippet(baseSettings, url)
    
    expect(snippet).toContain(`url="${url}"`)
  })

  it('uses placeholder URL when source URL is null', () => {
    const snippet = buildSnippet(baseSettings, null)
    
    expect(snippet).toContain('url="https://x.com/username/status/123"')
  })

  it('escapes double quotes in URL', () => {
    const urlWithQuotes = 'https://x.com/test/status/123"malicious'
    const snippet = buildSnippet(baseSettings, urlWithQuotes)
    
    // Check that the quote was escaped
    expect(snippet).toContain('\\"malicious')
    // The original unescaped string should not appear at the quote boundary
    expect(snippet.includes('123"malicious')).toBe(false)
  })

  it('produces valid paste-ready JSX', () => {
    const snippet = buildSnippet(baseSettings, 'https://x.com/test/status/1')
    
    // Should have proper structure
    expect(snippet).toContain('import { XCard }')
    expect(snippet).toContain('function MyComponent()')
    expect(snippet).toContain('return (')
    expect(snippet).toContain('<XCard')
    expect(snippet).toContain('/>')
    expect(snippet).toContain(')')
    expect(snippet).toContain('}')
  })
})
