import { describe, it, expect } from 'vitest'
import { extractMedia, normalizeTwimgMediaUrl } from './media-extraction'

describe('normalizeTwimgMediaUrl', () => {
  it('returns null for invalid URLs', () => {
    expect(normalizeTwimgMediaUrl(undefined)).toBe(null)
    expect(normalizeTwimgMediaUrl(null)).toBe(null)
    expect(normalizeTwimgMediaUrl('')).toBe(null)
    expect(normalizeTwimgMediaUrl('not-a-url')).toBe(null)
  })

  it('returns null for non-twimg URLs', () => {
    expect(normalizeTwimgMediaUrl('https://example.com/image.jpg')).toBe(null)
  })

  it('returns null for profile images', () => {
    expect(normalizeTwimgMediaUrl('https://pbs.twimg.com/profile_images/123/avatar.jpg')).toBe(null)
  })

  it('normalizes photo URLs correctly', () => {
    const result = normalizeTwimgMediaUrl('https://pbs.twimg.com/media/AbCd1234?format=jpg&name=small')
    expect(result).toEqual({
      url: 'https://pbs.twimg.com/media/AbCd1234?format=jpg&name=large',
      kind: 'photo'
    })
  })

  it('normalizes video thumb URLs correctly', () => {
    const result = normalizeTwimgMediaUrl('https://pbs.twimg.com/ext_tw_video_thumb/123/abc.jpg')
    expect(result).toEqual({
      url: 'https://pbs.twimg.com/ext_tw_video_thumb/123/abc.jpg?format=jpg&name=large',
      kind: 'thumb'
    })
  })
})

describe('extractMedia', () => {
  it('returns 4 photos when payload has 1 video thumb + 4 photos', () => {
    const payload = {
      video: {
        poster: 'https://pbs.twimg.com/ext_tw_video_thumb/1/thumb.jpg'
      },
      photos: [
        { url: 'https://pbs.twimg.com/media/photo1.jpg' },
        { url: 'https://pbs.twimg.com/media/photo2.jpg' },
        { url: 'https://pbs.twimg.com/media/photo3.jpg' },
        { url: 'https://pbs.twimg.com/media/photo4.jpg' },
      ]
    }

    const result = extractMedia(payload)
    
    expect(result).toHaveLength(4)
    // All results should be photos (video thumb filtered out)
    expect(result.every(url => url.includes('/media/'))).toBe(true)
    expect(result.every(url => !url.includes('video_thumb'))).toBe(true)
  })

  it('returns later valid photos when first candidates fail normalization', () => {
    const payload = {
      photos: [
        // These should fail normalization (not twimg URLs)
        { url: 'https://example.com/bad1.jpg' },
        { url: 'https://example.com/bad2.jpg' },
        // These should succeed
        { url: 'https://pbs.twimg.com/media/photo1.jpg' },
        { url: 'https://pbs.twimg.com/media/photo2.jpg' },
      ],
      mediaDetails: [
        // Profile image should be filtered out
        { media_url_https: 'https://pbs.twimg.com/profile_images/123/avatar.jpg' },
        // This should succeed
        { media_url_https: 'https://pbs.twimg.com/media/photo3.jpg' },
      ]
    }

    const result = extractMedia(payload)
    
    expect(result).toHaveLength(3)
    expect(result).toEqual([
      'https://pbs.twimg.com/media/photo1.jpg?format=jpg&name=large',
      'https://pbs.twimg.com/media/photo2.jpg?format=jpg&name=large',
      'https://pbs.twimg.com/media/photo3.jpg?format=jpg&name=large',
    ])
  })

  it('collapses duplicates and caps at 4', () => {
    const payload = {
      photos: [
        { url: 'https://pbs.twimg.com/media/photo1.jpg' },
        { url: 'https://pbs.twimg.com/media/photo1.jpg' }, // duplicate
        { url: 'https://pbs.twimg.com/media/photo2.jpg' },
      ],
      mediaDetails: [
        { media_url_https: 'https://pbs.twimg.com/media/photo1.jpg' }, // duplicate
        { media_url_https: 'https://pbs.twimg.com/media/photo3.jpg' },
        { media_url_https: 'https://pbs.twimg.com/media/photo4.jpg' },
        { media_url_https: 'https://pbs.twimg.com/media/photo5.jpg' },
        { media_url_https: 'https://pbs.twimg.com/media/photo6.jpg' }, // beyond limit
      ]
    }

    const result = extractMedia(payload)
    
    expect(result).toHaveLength(4)
    expect(result).toEqual([
      'https://pbs.twimg.com/media/photo1.jpg?format=jpg&name=large',
      'https://pbs.twimg.com/media/photo2.jpg?format=jpg&name=large',
      'https://pbs.twimg.com/media/photo3.jpg?format=jpg&name=large',
      'https://pbs.twimg.com/media/photo4.jpg?format=jpg&name=large',
    ])
  })

  it('handles empty or missing data gracefully', () => {
    expect(extractMedia({})).toEqual([])
    expect(extractMedia({ photos: [] })).toEqual([])
    expect(extractMedia({ photos: null })).toEqual([])
  })

  it('prioritizes photos over video thumbs even when thumbs come first in payload', () => {
    const payload = {
      mediaDetails: [
        { media_url_https: 'https://pbs.twimg.com/ext_tw_video_thumb/1/thumb.jpg' },
        { media_url_https: 'https://pbs.twimg.com/media/photo1.jpg' },
        { media_url_https: 'https://pbs.twimg.com/media/photo2.jpg' },
      ]
    }

    const result = extractMedia(payload)
    
    expect(result).toHaveLength(2)
    // Only photos should be returned
    expect(result.every(url => url.includes('/media/'))).toBe(true)
  })

  it('returns video thumbs when no photos are available', () => {
    const payload = {
      video: {
        poster: 'https://pbs.twimg.com/ext_tw_video_thumb/1/thumb.jpg'
      }
    }

    const result = extractMedia(payload)
    
    expect(result).toHaveLength(1)
    expect(result[0]).toContain('video_thumb')
  })
})
