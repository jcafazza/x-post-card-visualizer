# X Post Card Builder

Transform X (Twitter) posts into beautiful, customizable visual cards with real-time interactive controls.

![X Post Card Builder](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4)

## Product Vision

Unlike screenshot tools focused on social sharing, X Post Card Builder gives designers and creators granular control over card design to create embeddable post cards that match their website's brand aesthetic.

**Core Features:**
- 🎨 **Interactive Customization** - Drag to resize card width and adjust border radius in real-time
- 🌓 **Three Theme System** - Light, Dim, and Dark modes with opacity-based colors
- ✨ **Live Preview** - See changes instantly as you adjust controls
- 📥 **PNG Export** - High-quality 2x resolution download
- 🎯 **No Metrics** - Clean, focused design without clutter

---

## Project Structure

```
x-post-visualizer/
├── api/
│   └── scrape-post.js          # Vercel serverless function - scrapes X posts
├── web/                         # Next.js application
│   ├── app/
│   │   ├── page.tsx            # Main application page
│   │   ├── layout.tsx          # Root layout with Inter font
│   │   └── globals.css         # Tailwind + custom animations
│   ├── components/
│   │   ├── InteractivePostCard.tsx  # Draggable resize controls
│   │   ├── PostCard.tsx        # Card display component
│   │   ├── Toolbar.tsx         # Floating control buttons
│   │   └── URLInput.tsx        # URL import field
│   ├── lib/
│   │   ├── api.ts              # API client with error handling
│   │   ├── export.ts           # PNG export with html2canvas
│   │   ├── themes.ts           # Theme configuration
│   │   └── placeholder.ts      # Brad Radius default post
│   ├── types/
│   │   └── post.ts             # TypeScript interfaces
│   └── public/
│       └── avatars/            # Static assets
├── assets/
│   └── xLogo.svg               # X logo for header
├── package.json
├── vercel.json
└── README.md                   # This file
```

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **UI Components**: Base UI (headless) + Lucide React icons
- **Backend API**: Vercel Serverless Functions
- **Scraping**: Cheerio (lightweight HTML parsing)
- **Export**: html2canvas (client-side PNG generation)
- **Deployment**: Vercel (API + Frontend)

---

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies (API)
npm install

# Install web app dependencies
cd web
npm install
```

### 2. Run Development Server

```bash
# From web directory
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

**Note:** The app loads with Brad Radius's post as a placeholder. To fetch real posts, you'll need to deploy the API first.

### 3. Deploy API to Vercel

```bash
# From project root
vercel
```

After deployment, you'll get a URL like: `https://your-project.vercel.app`

### 4. Configure API Endpoint

Update `web/.env.local`:

```env
NEXT_PUBLIC_API_ENDPOINT=https://your-project.vercel.app/api/scrape-post
```

### 5. Deploy Web App

```bash
# From web directory
vercel
```

---

## Features

### Interactive Card Controls

- **Width Resize** - Drag left/right edges to resize (350px - 700px)
- **Border Radius** - Drag corners to adjust roundness (0px - 40px, snaps to 4px increments)
- **Live Indicators** - See current values while dragging

### Toolbar Controls

- **Theme Cycle** - Switch between Light, Dim, and Dark themes
- **Shadow Intensity** - Cycle through None, Light, Medium, Strong
- **Date Toggle** - Show/hide post timestamp
- **Reset** - Return to default width and border radius
- **Export** - Download as high-quality PNG (2x resolution)

### Theme System

**Light Theme**
- Background: `#FFFFFF`
- Text: `#000000` (primary), `#666666` (secondary), `#999999` (tertiary)
- Border: `#E6E6E6`

**Dim Theme**
- Background: `#15202B`
- Text: `#F2F2F2` (primary), `#8899A6` (secondary), `#6E767D` (tertiary)
- Border: `#38444D`

**Dark Theme**
- Background: `#000000`
- Text: `#FFFFFF` (primary), `#71767B` (secondary/tertiary)
- Border: `#2F3336`

---

## API Reference

### POST /api/scrape-post

Scrapes a public X post and returns structured data.

**Request:**
```json
{
  "url": "https://x.com/username/status/123456789"
}
```

**Response:**
```json
{
  "author": {
    "name": "Display Name",
    "handle": "@username",
    "avatar": "https://...",
    "verified": false
  },
  "content": {
    "text": "Post content...",
    "images": ["https://..."]
  },
  "timestamp": "2026-01-22T23:37:00Z"
}
```

**Error Responses:**
- `400` - Invalid URL format
- `404` - Post not found or deleted
- `500` - Scraping failed or post structure changed

---

## Development Roadmap

### ✅ MVP (Complete)
- [x] Next.js app with TypeScript and Tailwind CSS v4
- [x] Vercel API scraper endpoint with Cheerio
- [x] Interactive card resize controls (width + border radius)
- [x] Three theme system (light/dim/dark)
- [x] Floating toolbar with cycle buttons
- [x] Real-time preview updates
- [x] PNG export functionality (2x resolution)
- [x] Brad Radius placeholder content
- [x] Error handling and loading states
- [x] Tooltips showing current values

### 🔮 Phase 2 (Post-MVP)
- [ ] Web component for embeds
- [ ] Copy embed code feature
- [ ] CDN hosting for web component
- [ ] More preset templates
- [ ] Save/share custom styles
- [ ] URL parameter for pre-configured cards

### 🚀 Future Enhancements
- [ ] Font selection/typography controls
- [ ] Gradient backgrounds
- [ ] Custom color pickers
- [ ] Batch processing multiple posts
- [ ] User accounts and saved presets
- [ ] Figma plugin integration

---

## Troubleshooting

### API Issues

**Problem:** "Could not extract post data"
- X's HTML structure may have changed
- Check if the post is public and accessible
- Try updating the scraper logic in [`api/scrape-post.js`](api/scrape-post.js)

**Problem:** API connection errors
- Verify `NEXT_PUBLIC_API_ENDPOINT` in `web/.env.local`
- Make sure the Vercel API is deployed and accessible
- Check browser console for CORS errors

**Problem:** "Post not found or deleted"
- The post may be private, deleted, or from a protected account
- Only public posts can be scraped

### Export Issues

**Problem:** PNG export fails
- Check that the card is fully visible on screen
- Browser console will show specific error messages
- Try a different browser (Chrome/Edge recommended)

**Problem:** Exported PNG is blank
- Ensure card has loaded completely before exporting
- Check that external images (avatars) have loaded
- html2canvas may have CORS issues with some images

### Development Issues

**Problem:** Module not found errors
- Make sure you're in the `web` directory: `cd web`
- Run `npm install` to install all dependencies
- Delete `node_modules` and `.next` folders, then reinstall

**Problem:** Tailwind styles not working
- Tailwind v4 uses `@import "tailwindcss"` syntax
- Make sure `postcss.config.mjs` is configured correctly
- Check that `@tailwindcss/postcss` is installed

---

## Notes on Scraping

### Limitations

- **No real metrics**: Likes, retweets, and replies require JavaScript rendering or X API access
- **Structure changes**: If X updates their HTML structure, the scraper may break and need updates
- **Rate limiting**: Consider adding rate limiting if this becomes public
- **Protected accounts**: Cannot scrape posts from private/protected accounts

### Upgrading to Puppeteer (Optional)

If you need real metrics or more robust scraping:

1. Install Puppeteer: `npm install puppeteer-core chrome-aws-lambda`
2. Update [`api/scrape-post.js`](api/scrape-post.js) to use Puppeteer
3. Note: This increases cold start time and memory usage on Vercel

---

## Contributing

This is a personal project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test thoroughly
4. Commit with descriptive messages: `git commit -m "Add your feature"`
5. Push to your fork: `git push origin feature/your-feature`
6. Open a Pull Request

---

## License

MIT License - feel free to use and modify as needed.

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Base UI Components](https://base-ui.com/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [html2canvas](https://html2canvas.hertzen.com/)

---

## Questions?

- Check the [web/README.md](web/README.md) for detailed web app documentation
- See [PRODUCT.md](PRODUCT.md) for full product specification
- Review [QUICKSTART.md](QUICKSTART.md) for step-by-step setup guide

---

**Built with ❤️ for designers and creators**
