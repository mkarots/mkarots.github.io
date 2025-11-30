# Implementation Guide - Personal Developer Portfolio & Blog

## Phase 1: Project Initialization

### Step 1: Create Astro Project
```bash
# Using npm
npm create astro@latest

# Follow prompts:
# - Where should we create your new project? → ./
# - How would you like to start your new project? → Use blog template
# - Install dependencies? → Yes
# - Do you plan to write TypeScript? → Yes
# - How strict should TypeScript be? → Strict
# - Initialize a new git repository? → Yes
```

### Step 2: Install Additional Dependencies
```bash
npm install -D @astrojs/tailwind tailwindcss
npm install -D @astrojs/mdx
npm install -D @astrojs/sitemap
npm install -D @astrojs/rss
npm install -D @astrojs/react react react-dom
```

### Step 3: Configure Astro
Update [`astro.config.mjs`](astro.config.mjs):
```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/blogfolio',
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    react(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

## Phase 2: Project Structure Setup

### Directory Structure
```
src/
├── components/
│   ├── BaseHead.astro          # SEO meta tags
│   ├── Header.astro            # Site header
│   ├── Footer.astro            # Site footer
│   ├── Navigation.astro        # Main navigation
│   ├── BlogCard.astro          # Blog post card
│   ├── ProjectCard.astro       # Project showcase card
│   ├── Hero.astro              # Homepage hero section
│   ├── SkillBadge.astro        # Technology badge
│   └── ThemeToggle.tsx         # Dark mode toggle (React)
├── layouts/
│   ├── BaseLayout.astro        # Base HTML structure
│   ├── BlogPost.astro          # Blog post layout
│   └── MarkdownPost.astro      # Markdown wrapper
├── pages/
│   ├── index.astro             # Homepage
│   ├── blog/
│   │   ├── index.astro         # Blog listing
│   │   └── [...slug].astro     # Dynamic blog routes
│   ├── projects.astro          # Projects page
│   ├── about.astro             # About page
│   └── rss.xml.js              # RSS feed
├── content/
│   ├── blog/                   # Blog posts (MDX)
│   └── config.ts               # Content collections schema
├── styles/
│   └── global.css              # Global styles
└── utils/
    ├── formatDate.ts           # Date formatting
    └── getReadingTime.ts       # Reading time calculation
```

## Phase 3: Core Components

### BaseHead Component
```astro
---
// src/components/BaseHead.astro
export interface Props {
  title: string;
  description: string;
  image?: string;
}

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const { title, description, image = '/og-image.png' } = Astro.props;
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="generator" content={Astro.generator} />

<title>{title}</title>
<meta name="description" content={description} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.url)} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={Astro.url} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={new URL(image, Astro.url)} />

<link rel="canonical" href={canonicalURL} />
```

### Header Component
```astro
---
// src/components/Header.astro
import Navigation from './Navigation.astro';
import ThemeToggle from './ThemeToggle';
---

<header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">
        Your Name
      </a>
      <div class="flex items-center gap-4">
        <Navigation />
        <ThemeToggle client:load />
      </div>
    </div>
  </div>
</header>
```

### Navigation Component
```astro
---
// src/components/Navigation.astro
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];
---

<nav class="hidden md:flex gap-6">
  {navItems.map(({ href, label }) => (
    <a
      href={href}
      class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
    >
      {label}
    </a>
  ))}
</nav>
```

### ThemeToggle Component (React)
```tsx
// src/components/ThemeToggle.tsx
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

## Phase 4: Content Collections

### Content Schema
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### Sample Blog Post
```mdx
---
title: 'Getting Started with Astro'
description: 'Learn how to build fast, content-focused websites with Astro'
pubDate: 2024-01-15
tags: ['astro', 'web-development', 'tutorial']
heroImage: '/blog/astro-intro.jpg'
---

# Getting Started with Astro

Astro is a modern static site generator that delivers lightning-fast performance...

## Why Astro?

- **Zero JS by default**: Ships only the JavaScript you need
- **Component Islands**: Mix and match frameworks
- **Content Collections**: Type-safe content management

```javascript
// Example code block
const greeting = 'Hello, Astro!';
console.log(greeting);
```

## Conclusion

Astro is perfect for content-focused sites like blogs and portfolios.
```

## Phase 5: Page Layouts

### Base Layout
```astro
---
// src/layouts/BaseLayout.astro
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

export interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
---

<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <BaseHead title={title} description={description} image={image} />
  </head>
  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <Header />
    <main class="min-h-screen">
      <slot />
    </main>
    <Footer />
    <script>
      // Theme initialization
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    </script>
  </body>
</html>
```

### Blog Post Layout
```astro
---
// src/layouts/BlogPost.astro
import BaseLayout from './BaseLayout.astro';
import { formatDate } from '../utils/formatDate';

const { frontmatter } = Astro.props;
---

<BaseLayout title={frontmatter.title} description={frontmatter.description}>
  <article class="max-w-3xl mx-auto px-4 py-12">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
      <div class="flex gap-4 text-gray-600 dark:text-gray-400">
        <time datetime={frontmatter.pubDate.toISOString()}>
          {formatDate(frontmatter.pubDate)}
        </time>
        {frontmatter.tags && (
          <div class="flex gap-2">
            {frontmatter.tags.map((tag: string) => (
              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
    <div class="prose dark:prose-invert max-w-none">
      <slot />
    </div>
  </article>
</BaseLayout>
```

## Phase 6: GitHub Pages Deployment

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Phase 7: Styling with Tailwind

### Tailwind Configuration
```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### Global Styles
```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply antialiased;
  }
}
```

## Phase 8: Utilities

### Date Formatting
```typescript
// src/utils/formatDate.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
```

### Reading Time
```typescript
// src/utils/getReadingTime.ts
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

## Next Steps

1. Review the architecture and implementation plan
2. Confirm you're happy with the approach
3. Switch to Code mode to implement the solution
4. Customize design and content to your preferences
5. Deploy to GitHub Pages

## Customization Ideas

- Add your own color scheme
- Include project showcases with live demos
- Add contact form
- Integrate analytics
- Add newsletter signup
- Include testimonials section
- Add case studies for major projects