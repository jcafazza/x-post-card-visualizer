export interface Author {
  name: string
  handle: string
  avatar: string
  verified: boolean
}

export interface Content {
  text: string
  images: string[]
}

export interface PostData {
  author: Author
  content: Content
  timestamp: string
}

export type Theme = 'light' | 'dim' | 'dark'
export type BorderRadius = '0' | '8' | '16' | '20' | '24'
export type ShadowIntensity = 'none' | 'light' | 'medium' | 'strong'

export interface CardSettings {
  theme: Theme
  borderRadius: BorderRadius
  shadowIntensity: ShadowIntensity
  showDate: boolean
  cardWidth: number
  customBorderRadius: number
}
