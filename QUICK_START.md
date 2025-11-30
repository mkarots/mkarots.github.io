# Quick Start Guide - Personal Developer Portfolio & Blog

## TL;DR - What You're Getting

A modern, fast, and beautiful developer portfolio + blog built with:
- **Astro** - Modern static site generator
- **TypeScript** - Type safety
- **Tailwind CSS** - Beautiful, responsive design
- **MDX** - Write blog posts in Markdown with React components
- **GitHub Pages** - Free hosting with automatic deployments

## Why This Stack?

✅ **Dev-Friendly**: TypeScript, hot reload, component-based  
✅ **Publishing-Friendly**: Write in Markdown, git push to deploy  
✅ **Nice UI**: Tailwind CSS with dark mode, responsive design  
✅ **It Works**: Static site = fast, reliable, SEO-friendly  

## What You'll Have

### Homepage
- Hero section with your intro
- Featured projects showcase
- Recent blog posts
- Skills/tech stack display
- Social links

### Blog
- MDX support (Markdown + components)
- Syntax highlighting
- Tags/categories
- Reading time
- RSS feed
- SEO optimized

### Projects Page
- Project cards with descriptions
- Tech stack badges
- Live demo + GitHub links

### Features
- 🌙 Dark mode toggle
- 📱 Mobile responsive
- ⚡ Lightning fast (90+ Lighthouse score)
- 🔍 SEO optimized
- ♿ Accessible

## Getting Started (5 Minutes)

### 1. Initialize Project
```bash
npm create astro@latest
# Choose: blog template, TypeScript (strict), Yes to git
```

### 2. Install Dependencies
```bash
npm install -D @astrojs/tailwind tailwindcss @astrojs/mdx @astrojs/sitemap @astrojs/rss @astrojs/react react react-dom @tailwindcss/typography
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:4321` - you'll see the blog template!

### 4. Customize
- Update site info in [`astro.config.mjs`](astro.config.mjs)
- Add your content in `src/content/blog/`
- Customize components in `src/components/`
- Adjust styles in `tailwind.config.mjs`

### 5. Deploy to GitHub Pages
```bash
# Create GitHub repo
git remote add origin https://github.com/yourusername/blogfolio.git
git push -u origin main

# Enable GitHub Pages in repo settings
# Add the GitHub Actions workflow (see IMPLEMENTATION_GUIDE.md)
```

## Project Structure Overview

```
blogfolio/
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes (file-based routing)
│   │   ├── index.astro  # Homepage
│   │   └── blog/        # Blog pages
│   ├── content/         # Blog posts (MDX files)
│   └── styles/          # Global styles
├── public/              # Static assets (images, etc.)
└── astro.config.mjs     # Astro configuration
```

## Writing Blog Posts

Create a new file in `src/content/blog/my-post.mdx`:

```mdx
---
title: 'My First Post'
description: 'This is my first blog post'
pubDate: 2024-01-15
tags: ['astro', 'blogging']
---

# Hello World

This is my first blog post using Astro!

```javascript
console.log('Code blocks work great!');
```

You can even use React components here!
```

## Customization Checklist

- [ ] Update site title and description in [`astro.config.mjs`](astro.config.mjs)
- [ ] Replace favicon in `public/favicon.svg`
- [ ] Update social links in [`Header.astro`](src/components/Header.astro)
- [ ] Customize colors in [`tailwind.config.mjs`](tailwind.config.mjs)
- [ ] Add your bio to [`about.astro`](src/pages/about.astro)
- [ ] Add your projects to projects page
- [ ] Write your first blog post
- [ ] Add your profile image
- [ ] Update meta tags and SEO info

## Common Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro add    # Add integrations
```

## Deployment

### GitHub Pages (Recommended)
1. Push code to GitHub
2. Enable GitHub Pages in repo settings
3. Add GitHub Actions workflow (see [`IMPLEMENTATION_GUIDE.md`](IMPLEMENTATION_GUIDE.md))
4. Every push to main = automatic deployment!

### Alternative Hosting
- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Same as Vercel
- **Cloudflare Pages**: Fast global CDN

## Performance Tips

✅ Already optimized out of the box!
- Static site generation
- Minimal JavaScript
- Optimized images (use Astro's Image component)
- CSS purging with Tailwind
- Code splitting

## Next Steps

1. **Review the plan** - Check [`ARCHITECTURE.md`](ARCHITECTURE.md) for full details
2. **Implement** - Switch to Code mode to build it
3. **Customize** - Make it yours!
4. **Deploy** - Share with the world
5. **Write** - Start blogging!

## Need Help?

- 📚 [Astro Docs](https://docs.astro.build)
- 🎨 [Tailwind Docs](https://tailwindcss.com/docs)
- 📝 [MDX Guide](https://mdxjs.com/)
- 🚀 [Deployment Guide](https://docs.astro.build/en/guides/deploy/)

## Estimated Time

- **Setup**: 30 minutes
- **Customization**: 2-4 hours
- **Content creation**: Ongoing
- **Total to launch**: ~4-5 hours

## What Makes This Special?

Unlike other solutions:
- ✅ No complex build configs
- ✅ No heavy JavaScript frameworks (unless you want them)
- ✅ Write in Markdown, not a CMS
- ✅ Git-based workflow (version control for content!)
- ✅ Free hosting forever
- ✅ Blazing fast performance
- ✅ Modern dev experience

Ready to build? Let's switch to Code mode and make it happen! 🚀