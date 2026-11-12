# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-11-12

### Fixed
- **Critical:** API now returns absolute image URLs (`https://x-post-card-visualizer.vercel.app/api/image?url=...`) instead of relative paths, fixing broken avatars and images when XCard is embedded on third-party websites
- Radius range now matches web app: `0-40` instead of `0-24`, allowing exact preview-to-embed consistency

### Changed
- Improved performance with memoization of theme, shadow, width, and radius normalization

### Documentation
- Corrected repository and homepage URLs to point to correct GitHub owner (`jcafazza`)
- Updated README with correct web app repository link

## [0.1.1] - 2026-02-02

Initial public release.

### Added
- XCard component for embedding X (Twitter) posts
- Support for light, dim, and dark themes
- Configurable shadow intensity (flat, raised, floating, elevated)
- Customizable width (350-700px) and border radius
- Optional timestamp display
- Custom API endpoint support
- Loading skeleton and error states
- CORS-enabled default API endpoint
