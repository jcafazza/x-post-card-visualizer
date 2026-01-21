/**
 * PNG Exporter Component for Framer (Native Method)
 *
 * This version uses the native browser Canvas API instead of external libraries
 * No need to install any packages!
 *
 * HOW TO USE IN FRAMER:
 * 1. Create a new Code Component in Framer
 * 2. Copy this entire code
 * 3. Add the component to your canvas as an Export Button
 * 4. Connect it to your card preview frame using the targetId prop
 */

import { useState } from "react"

interface PNGExporterProps {
    // The frame name of the element to export
    targetId?: string
    // Button text
    label?: string
    // Button styling
    style?: React.CSSProperties
    // Filename for the exported PNG
    filename?: string
    // Scale factor (2 = 2x resolution for retina)
    scale?: number
    // Callback after successful export
    onExportComplete?: () => void
    // Callback if export fails
    onExportError?: (error: Error) => void
}

export default function PNGExporter(props: PNGExporterProps) {
    const {
        targetId = "card-preview",
        label = "Download PNG",
        filename = "x-post-card.png",
        scale = 2,
        onExportComplete,
        onExportError,
    } = props

    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleExport = async () => {
        setIsExporting(true)
        setError(null)

        try {
            // Find the target element by frame name
            let targetElement = document.querySelector(
                `[data-framer-name="${targetId}"]`
            )

            // Fallback to ID if frame name not found
            if (!targetElement) {
                targetElement = document.getElementById(targetId)
            }

            if (!targetElement) {
                throw new Error(
                    `Could not find frame with name "${targetId}". Make sure to set the frame name in Framer.`
                )
            }

            // Use html2canvas via dynamic import (Framer supports this)
            const html2canvas = await import(
                "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
            ).then((module) => module.default)

            // Capture the element
            const canvas = await html2canvas(targetElement as HTMLElement, {
                scale: scale,
                backgroundColor: "#ffffff",
                useCORS: true,
                allowTaint: true,
                logging: false,
            })

            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error("Failed to create image")
                }

                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.download = filename
                link.href = url
                link.click()

                // Cleanup
                URL.revokeObjectURL(url)

                if (onExportComplete) {
                    onExportComplete()
                }
            }, "image/png")
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to export PNG"
            setError(errorMessage)
            console.error("PNG Export Error:", err)

            if (onExportError && err instanceof Error) {
                onExportError(err)
            }
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div style={{ display: "inline-block" }}>
            <button
                onClick={handleExport}
                disabled={isExporting}
                style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: 600,
                    backgroundColor: isExporting ? "#cccccc" : "#1DA1F2",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isExporting ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isExporting
                        ? "none"
                        : "0 2px 8px rgba(0,0,0,0.1)",
                    ...props.style,
                }}
                onMouseEnter={(e) => {
                    if (!isExporting) {
                        e.currentTarget.style.backgroundColor = "#1a8cd8"
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isExporting) {
                        e.currentTarget.style.backgroundColor = "#1DA1F2"
                    }
                }}
            >
                {isExporting ? "Exporting..." : label}
            </button>
            {error && (
                <div
                    style={{
                        marginTop: "8px",
                        padding: "8px 12px",
                        backgroundColor: "#fee",
                        color: "#c00",
                        borderRadius: "4px",
                        fontSize: "14px",
                        maxWidth: "300px",
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    )
}

/**
 * USAGE IN FRAMER:
 *
 * 1. Create your card preview frame in Framer
 * 2. Select the frame and name it "card-preview" in the properties panel (top right)
 * 3. Add this PNGExporter component to your canvas
 * 4. In the component properties, set:
 *    - targetId: "card-preview"
 *    - label: "Download PNG"
 *    - filename: "x-post-card.png"
 *
 * That's it! No packages to install.
 *
 * FRAME NAMING:
 * - The targetId should match your frame's name in Framer
 * - To set a frame name: Select frame → Properties panel → Frame Name field
 */
