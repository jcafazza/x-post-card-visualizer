/**
 * Media extraction utilities for X post scraping.
 * Separated for testability.
 */

export type NormalizedMedia = { url: string; kind: 'photo' | 'thumb' }

/**
 * Normalizes a twimg media URL to a high-quality variant.
 * Returns null if the URL is not a valid tweet media URL.
 */
export function normalizeTwimgMediaUrl(input?: string): NormalizedMedia | null {
  if (!input || typeof input !== 'string') return null
  if (!input.startsWith('http')) return null

  let u: URL
  try {
    u = new URL(input)
  } catch {
    return null
  }

  const host = u.hostname.toLowerCase()
  if (host !== 'pbs.twimg.com' && !host.endsWith('.twimg.com')) return null

  const path = u.pathname

  // Never treat avatars/icons/etc as tweet media.
  if (path.includes('/profile_images/')) return null

  // Ignore non-tweet media assets that often appear in embeds.
  if (path.includes('/card_img/')) return null
  if (path.includes('/semantic_core_img/')) return null

  const isPhoto = path.includes('/media/')
  const isThumb =
    path.includes('/ext_tw_video_thumb/') ||
    path.includes('/amplify_video_thumb/') ||
    path.includes('/tweet_video_thumb/')

  if (!isPhoto && !isThumb) return null

  const baseUrl = `${u.origin}${u.pathname}`
  return {
    url: `${baseUrl}?format=jpg&name=large`,
    kind: isPhoto ? 'photo' : 'thumb',
  }
}

/**
 * Extracts high-quality images from the syndication response.
 * Returns up to 4 images, prioritizing photos over video thumbnails.
 */
export function extractMedia(data: any): string[] {
  const rawCandidates: string[] = []
  const anyData = data as any
  const seen = new Set<string>()

  // Helper to add unique candidates (Set-based dedup during collection)
  const addCandidate = (url: string | undefined | null) => {
    if (url && typeof url === 'string' && !seen.has(url)) {
      rawCandidates.push(url)
      seen.add(url)
    }
  }

  // 1. Try photos array (standard images)
  if (data.photos && Array.isArray(data.photos)) {
    for (const p of data.photos) {
      addCandidate(p?.url)
    }
  }

  // 2. Try mediaDetails (often contains video thumbnails/gifs or high-res variants)
  if (data.mediaDetails && Array.isArray(data.mediaDetails)) {
    for (const m of data.mediaDetails) {
      addCandidate(m?.media_url_https)
    }
  }

  // 2b. Extra brute-force paths (payload shape can vary)
  const altMediaLists: any[] = [
    anyData?.entities?.media,
    anyData?.extended_entities?.media,
    anyData?.media,
    anyData?.media_details,
  ].filter(Boolean)
  for (const list of altMediaLists) {
    if (!Array.isArray(list)) continue
    for (const m of list) {
      const u = m?.media_url_https || m?.media_url || m?.url || m?.mediaUrl || m?.src
      addCandidate(u)
    }
  }

  // 3. Video poster as a fallback (only helps for video/GIF posts)
  if (data.video?.poster) {
    addCandidate(data.video.poster)
  }

  // Normalize all candidates (some may fail normalization)
  const normalized: NormalizedMedia[] = []
  for (const c of rawCandidates) {
    const n = normalizeTwimgMediaUrl(c)
    if (n) normalized.push(n)
  }

  // If the tweet has real photos, drop video thumbs (they often cause "extra" broken images).
  const hasPhotos = normalized.some((m) => m.kind === 'photo')
  const filtered = hasPhotos ? normalized.filter((m) => m.kind === 'photo') : normalized

  // Deduplicate by normalized URL and cap to 4
  const out: string[] = []
  const seenNormalized = new Set<string>()
  for (const m of filtered) {
    if (seenNormalized.has(m.url)) continue
    seenNormalized.add(m.url)
    out.push(m.url)
    if (out.length >= 4) break
  }

  return out
}
