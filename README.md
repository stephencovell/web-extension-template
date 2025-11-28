# Web Extension Template

A modern, lightweight browser extension template for Chrome and Firefox.

Built with **Vite**, **Preact**, **TypeScript**, and **Tailwind CSS v4**.

![Demo](assets/demo.png)

> **Like this template?** Give it a ⭐ to show your support and help others discover it!

## Why This Template?

This template powers [WebCheck360](https://chromewebstore.google.com/detail/seo-analysis-audit-webche/ablplooegcieapbedkpmiicblhdinjkh) — a full-featured SEO analysis extension that ships at just **~150KB**. That makes it one of the smallest and fastest extensions in its category.

If you need a production-ready foundation that stays lean, this is it.

## Features

- **Manifest V3** for Chrome and Firefox
- **Vite** for fast builds with watch mode
- **Preact** for a lightweight UI (~3KB)
- **TypeScript** with path aliases (`@/`)
- **Tailwind CSS v4** with CSS variables
- **Lucide icons** included
- **Dark mode** support
- Single build script for both platforms

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/stephencovell/web-extension-template.git
cd web-extension-template
pnpm install
```

### 2. Configure your extension

Edit `project.json`:

```json
{
  "name": "my-extension",
  "extension": {
    "name": "My Browser Extension",
    "description": "Your extension description.",
    "permissions": ["activeTab", "scripting", "storage"],
    "firefox": {
      "id": "extension@yourdomain.com"
    }
  }
}
```

### 3. Development

```bash
pnpm dev             # Build to dist/
pnpm dev:watch       # Watch mode - rebuilds on changes
```

### 4. Load in browser

**Chrome:**
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select `dist/`

**Firefox:**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on" → select `dist/manifest.json`

### 5. Build for production

```bash
pnpm build          # Chrome zip
pnpm build:firefox  # Firefox zip
pnpm build:all      # Both
```

Output: `artifact/my-extension-chrome-v1.0.0.zip`

## Project Structure

```
├── popup.html              # Extension popup entry
├── src/
│   ├── popup.tsx           # Popup mount point
│   ├── background.ts       # Service worker
│   ├── content.ts          # Content script
│   ├── tailwind.css        # CSS variables & Tailwind
│   ├── components/
│   │   ├── Popup.tsx
│   │   └── ui/             # Button, Card, Input
│   ├── features/           # Feature components
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   └── utils/
│       └── cn.ts           # Class name utility
├── public/icons/           # Extension icons
├── scripts/
│   └── build-extension.js
├── project.json            # Extension config
└── vite.config.ts
```

## Path Aliases

Use `@/` for clean imports:

```tsx
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
```

## Icons

[Lucide](https://lucide.dev/icons/) icons are included:

```tsx
import { Check, X, Plus } from 'lucide-preact'

<Button><Plus class="w-4 h-4" /> Add</Button>
```

## Theming

CSS variables in `src/tailwind.css`:

```css
@theme {
  --color-background: hsl(0 0% 100%);
  --color-primary: hsl(222 47% 11%);
}

.dark {
  --color-background: hsl(222 47% 11%);
}
```

## Extension Icons

Replace icons in `public/icons/`:

| File | Size | Usage |
|------|------|-------|
| `icon16.png` | 16x16 | Toolbar |
| `icon32.png` | 32x32 | Windows |
| `icon48.png` | 48x48 | Extensions page |
| `icon128.png` | 128x128 | Chrome Web Store |

## Built With This Template

- [WebCheck360](https://chromewebstore.google.com/detail/seo-analysis-audit-webche/ceomgmdmbbnapbhkdklfopnbpamhpeoe) — SEO Analysis & Website Audit Extension (~150KB)

## Contributing

Found a bug or have a suggestion? [Open an issue](https://github.com/user/web-extension-template/issues) or submit a PR.

If this template helped you, please consider giving it a ⭐!

## License

MIT
