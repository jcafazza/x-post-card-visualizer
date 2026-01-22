'use client'

import { useState } from 'react'
import { PostData } from '@/types/post'
import { fetchPostData } from '@/lib/api'

interface URLInputProps {
  onPostLoad: (post: PostData) => void
  theme: any
}

export default function URLInput({ onPostLoad, theme }: URLInputProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('Required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const postData = await fetchPostData(url)
      onPostLoad(postData)
      setError(null)
      setUrl('') // Clear input after success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border rounded-full p-1 ${
        isFocused ? 'scale-[1.01] shadow-md bg-white/10' : 'scale-100 shadow-none'
      }`}
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.02)', 
        borderColor: theme.headerBorder,
      }}
    >
      <div className="flex-1 relative flex items-center">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste X post URL..."
          disabled={isLoading}
          className="w-full bg-transparent border-none py-1.5 pl-3 pr-24 text-base transition-all duration-500 outline-none placeholder:opacity-40 font-light"
          style={{ 
            color: theme.appText,
          }}
        />
        
        <div className="absolute right-1 flex items-center gap-2">
          {error && (
            <span className="text-[10px] font-medium text-red-500 animate-in fade-in slide-in-from-right-1">
              {error}
            </span>
          )}
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-0 hover:brightness-110 active:scale-95"
            style={{ 
              backgroundColor: theme.appText, 
              color: theme.appBg 
            }}
          >
            {isLoading ? '...' : 'Import'}
          </button>
        </div>
      </div>
    </form>
  )
}
