import html2canvas from 'html2canvas'

const EXPORT_SCALE = 2 // Higher quality export (2x resolution)
const EXPORT_MIME_TYPE = 'image/png' as const

/**
 * Exports an element to PNG with transparent background to capture shadows.
 * 
 * @param elementId - The ID of the element to export
 * @param filename - The filename for the downloaded PNG (default: 'x-post-card.png')
 * @returns Promise that resolves when export completes
 * @throws Error if element not found, export fails, or blob creation fails
 */
export async function exportElementToPNG(
  elementId: string,
  filename: string = 'x-post-card.png'
): Promise<void> {
  const element = document.getElementById(elementId)

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  // Ensure element has a parent for shadow capture
  const parent = element.parentElement
  if (!parent) {
    throw new Error('Element must have a parent element for shadow capture')
  }

  // Temporarily ensure parent doesn't clip overflow to allow shadow capture
  const originalOverflow = parent.style.overflow || ''
  parent.style.overflow = 'visible'

  try {
    // Generate canvas from element
    // html2canvas captures box-shadows when backgroundColor is null
    const canvas = await html2canvas(element, {
      backgroundColor: null, // Transparent background - essential for shadows to show
      scale: EXPORT_SCALE,
      logging: false,
      useCORS: true,
      allowTaint: false,
    })

    // Convert to blob with proper error handling
    return new Promise<void>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          try {
            if (!blob) {
              reject(new Error('Failed to generate image blob'))
              return
            }

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = filename
            link.href = url
            link.click()

            // Cleanup
            URL.revokeObjectURL(url)
            resolve()
          } catch (error) {
            reject(error instanceof Error ? error : new Error('Failed to download image'))
          }
        },
        EXPORT_MIME_TYPE
      )
    })
  } catch (error) {
    throw error instanceof Error 
      ? error 
      : new Error('Failed to export element to PNG')
  } finally {
    // Always restore original overflow, even if export fails
    parent.style.overflow = originalOverflow
  }
}
