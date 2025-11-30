# Blogfolio

A minimal, clean personal blog for developers. Built with Astro, TypeScript, and Tailwind CSS.

## Features

- ✨ **Minimal Design** - Clean, distraction-free reading experience
- 📝 **MDX Support** - Write in Markdown with React components
- 🌙 **Dark Mode** - Automatic theme switching
- ⚡ **Fast** - Static site generation, optimized performance
- 📱 **Responsive** - Works on all devices
- 🔍 **SEO Optimized** - Meta tags, sitemap, RSS feed
- 🚀 **Easy Deploy** - GitHub Pages with automatic deployments

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:4321/blogfolio`

## Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup and customization guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture and design decisions
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed implementation guide

## Customization

1. **Update site info** in `src/consts.ts`
2. **Edit homepage** in `src/pages/index.astro`
3. **Update links** in `src/components/Header.astro` and `src/components/Footer.astro`
4. **Configure deployment** in `astro.config.mjs`

## Writing

Create a new post in `src/content/blog/`:

```markdown
---
title: 'Your Post Title'
description: 'Brief description'
pubDate: 2024-01-15
---

# Your content here

Write in Markdown or MDX.
```

## Deployment

### GitHub Pages

1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to "GitHub Actions"
4. Update `site` and `base` in `astro.config.mjs`

Your site will be live at `https://yourusername.github.io/repo-name`

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

## Design Philosophy

This theme prioritizes:
- **Substance over style** - Content comes first
- **Readability** - Optimized typography and spacing
- **Simplicity** - No unnecessary features or distractions
- **Performance** - Fast loading, minimal JavaScript

Perfect for engineers who want to focus on writing.

## Tech Stack

- **[Astro](https://astro.build)** - Static site generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[MDX](https://mdxjs.com/)** - Enhanced Markdown
- **[React](https://react.dev/)** - Interactive components (theme toggle)

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## License

MIT - Feel free to use this for your own blog!

---

**Ready to start?** Check out [SETUP_GUIDE.md](SETUP_GUIDE.md) for next steps.
