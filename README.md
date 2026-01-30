# X Post Card Visualizer

**Transform public X (Twitter) posts into beautiful, customizable visual cards**—no API keys, no login. Built for designers who want full aesthetic control (theme, radius, shadows) and reliable export.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg)](https://nextjs.org/)

---

## Features

| Feature | Description |
|--------|-------------|
| **Import** | Paste any public `x.com/.../status/...` URL to load the post |
| **Customize** | Resize width and corner radius; switch light/dim/dark themes; set shadow intensity (flat → elevated) |
| **Export** | Download high-quality PNG (2× resolution) for social or docs |
| **Share** | Copy a link that preserves your settings; share page matches your theme and layout |
| **Accessible** | WCAG 2.1–aligned, reduced motion supported |

---

## Quick Start

**Prerequisites:** Node.js 18+, npm

```bash
git clone https://github.com/your-username/x-post-card-visualizer.git
cd x-post-card-visualizer

cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Paste a public X post URL, customize with the toolbar, and export PNG or copy a share link.

### Deploy (Vercel)

1. Import the repo as a **Next.js** project  
2. Set **Root Directory** to `web`  
3. Deploy  

UI and API routes ship together.

---

## How It Works

- **Scraping** — X’s syndication endpoints (`cdn.syndication.twimg.com`) with tokenized request and HTML embed fallback; no API keys.
- **Image proxy** — Remote media via `web/app/api/image` for same-origin loading and reliable PNG export.

---

## Project Structure

```
x-post-card-visualizer/
├── web/
│   ├── app/
│   │   ├── api/
│   │   │   ├── scrape-post/route.ts   # POST /api/scrape-post
│   │   │   └── image/route.ts         # GET  /api/image?url=...
│   │   ├── share/                     # Share page (URL-driven settings)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                    # React components
│   ├── hooks/                         # Custom hooks (e.g. useReducedMotion)
│   ├── lib/                           # Utilities, themes, API client
│   ├── types/                         # TypeScript types
│   └── constants/                     # UI constants (animations, card settings)
├── PRODUCT.md                         # Product specification
├── THEMES.md                          # Design system
├── QUICKSTART.md                      # Run + deploy
└── CONTRIBUTING.md                    # Contribution guidelines
```

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [PRODUCT.md](./PRODUCT.md) | Product spec, user workflow, feature requirements |
| [THEMES.md](./THEMES.md) | Design system and theme documentation |
| [QUICKSTART.md](./QUICKSTART.md) | Fastest path to run and deploy |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [web/API.md](./web/API.md) | API routes reference |

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for code style, workflow, and PR process.

---

## Tech & License

**Stack:** [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [html2canvas](https://github.com/niklasvh/html2canvas). Deploy anywhere (e.g. [Vercel](https://vercel.com/)).

**License:** MIT — see [LICENSE](./LICENSE).

---

**[John Cafazza](https://github.com/johncafazza)** · X Post Card Visualizer
