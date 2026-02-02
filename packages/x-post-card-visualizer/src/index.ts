// Main component and default API URL (for reference or custom tooling)
export { XCard, DEFAULT_API_URL } from './XCard'

// Sub-components for advanced usage
export { PostCard, PostCardSkeleton } from './PostCard'

// Theme utilities
export { getThemeStyles, getShadowForIntensity, themeConfig } from './themes'

// Formatting utilities (e.g. for card footer timestamp)
export { formatPostTimestamp } from './utils'

// Types
export type {
  XCardProps,
  PostData,
  Author,
  Content,
  Theme,
  ShadowIntensity,
  ThemeStyles,
} from './types'
