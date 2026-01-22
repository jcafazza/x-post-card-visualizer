'use client'

import { useState } from 'react'
import { PostData, CardSettings } from '@/types/post'
import { 
  generateReactCode, 
  generateHTMLCode, 
  generateVueCode, 
  generateVanillaJSCode,
  getInstallationInstructions,
  getAPIReference 
} from '@/lib/codeGenerator'
import { Tabs } from '@base-ui/react/tabs'
import { Copy, Check } from 'lucide-react'
import { ThemeStyles } from '@/types/post'

interface DevDocsProps {
  post: PostData
  settings: CardSettings
  currentTheme: ThemeStyles
}

type CodeFormat = 'react' | 'html' | 'vue' | 'vanilla'

export default function DevDocs({ post, settings, currentTheme }: DevDocsProps) {
  const [activeFormat, setActiveFormat] = useState<CodeFormat>('react')
  const [copiedFormat, setCopiedFormat] = useState<CodeFormat | null>(null)

  const getCode = (format: CodeFormat): string => {
    switch (format) {
      case 'react':
        return generateReactCode(post, settings)
      case 'html':
        return generateHTMLCode(post, settings)
      case 'vue':
        return generateVueCode(post, settings)
      case 'vanilla':
        return generateVanillaJSCode(post, settings)
    }
  }

  const handleCopy = async (format: CodeFormat) => {
    const code = getCode(format)
    try {
      await navigator.clipboard.writeText(code)
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const apiReference = getAPIReference(settings)
  const installationText = getInstallationInstructions(activeFormat)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Installation Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.textPrimary }}>
          Installation
        </h2>
        <div 
          className="rounded-[100px] border p-4"
          style={{
            backgroundColor: currentTheme.bg,
            borderColor: currentTheme.border,
          }}
        >
          <code 
            className="text-sm font-light block whitespace-pre-wrap"
            style={{ color: currentTheme.textSecondary }}
          >
            {installationText}
          </code>
        </div>
      </section>

      {/* Anatomy Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.textPrimary }}>
          Anatomy
        </h2>
        <Tabs.Root 
          defaultValue="react"
          onValueChange={(value) => {
            if (value) setActiveFormat(value as CodeFormat)
          }}
        >
          <Tabs.List 
            className="flex gap-2 mb-4 p-1"
            style={{
              backgroundColor: currentTheme.toolbarBg,
              borderRadius: '100px',
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            {(['react', 'html', 'vue', 'vanilla'] as CodeFormat[]).map((format) => (
              <Tabs.Tab
                key={format}
                value={format}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize"
                style={{
                  backgroundColor: activeFormat === format 
                    ? (settings.theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)')
                    : 'transparent',
                  color: activeFormat === format ? currentTheme.textPrimary : currentTheme.textSecondary,
                }}
              >
                {format === 'vanilla' ? 'JavaScript' : format}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {(['react', 'html', 'vue', 'vanilla'] as CodeFormat[]).map((format) => (
            <Tabs.Panel key={format} value={format}>
              <div className="relative">
                <div 
                  className="rounded-[100px] border p-6 overflow-x-auto"
                  style={{
                    backgroundColor: currentTheme.bg,
                    borderColor: currentTheme.border,
                  }}
                >
                  <pre className="text-xs font-light whitespace-pre-wrap" style={{ color: currentTheme.textSecondary }}>
                    <code>{getCode(format)}</code>
                  </pre>
                </div>
                <button
                  onClick={() => handleCopy(format)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: currentTheme.toolbarBg,
                    border: `1px solid ${currentTheme.border}`,
                    color: copiedFormat === format ? '#10B981' : currentTheme.textSecondary,
                  }}
                  aria-label={`Copy ${format} code`}
                >
                  {copiedFormat === format ? (
                    <Check className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <Copy className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      </section>

      {/* API Reference Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.textPrimary }}>
          API Reference
        </h2>
        <div 
          className="rounded-[100px] border overflow-hidden"
          style={{
            backgroundColor: currentTheme.bg,
            borderColor: currentTheme.border,
          }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${currentTheme.border}` }}>
                <th 
                  className="text-left p-4 text-sm font-medium"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Prop
                </th>
                <th 
                  className="text-left p-4 text-sm font-medium"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Type
                </th>
                <th 
                  className="text-left p-4 text-sm font-medium"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Description
                </th>
                <th 
                  className="text-left p-4 text-sm font-medium"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Current Value
                </th>
              </tr>
            </thead>
            <tbody>
              {apiReference.map((row, index) => (
                <tr 
                  key={row.prop}
                  style={{ 
                    borderBottom: index < apiReference.length - 1 ? `1px solid ${currentTheme.border}` : 'none' 
                  }}
                >
                  <td 
                    className="p-4 text-sm font-medium"
                    style={{ color: currentTheme.textPrimary }}
                  >
                    {row.prop}
                  </td>
                  <td 
                    className="p-4 text-sm font-light"
                    style={{ color: currentTheme.textSecondary }}
                  >
                    <code>{row.type}</code>
                  </td>
                  <td 
                    className="p-4 text-sm font-light"
                    style={{ color: currentTheme.textSecondary }}
                  >
                    {row.description}
                  </td>
                  <td 
                    className="p-4 text-sm font-light"
                    style={{ color: currentTheme.textSecondary }}
                  >
                    <code>{row.currentValue}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
