import html2canvas from 'html2canvas'

export async function exportElementToPNG(
  elementId: string,
  filename: string = 'x-post-card.png'
): Promise<void> {
  const element = document.getElementById(elementId)

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  // Generate canvas from element
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2, // Higher quality export
    logging: false,
  })

  // Convert to blob and download
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error('Failed to generate image')
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()

    // Cleanup
    URL.revokeObjectURL(url)
  }, 'image/png')
}
