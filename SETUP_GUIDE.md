# Setup Guide - Blogfolio

## Quick Start

Your personal developer blog is ready to use! Here's how to get started.

## 🚀 Running Locally

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321/blogfolio` to see your site.

## ✏️ Customization

### 1. Update Site Information

Edit [`src/consts.ts`](src/consts.ts):

```typescript
export const SITE_TITLE = 'Your Name';
export const SITE_DESCRIPTION = 'Your site description';
```

### 2. Update Personal Information

**Homepage** ([`src/pages/index.astro`](src/pages/index.astro)):
- Line 48: Change "Your Name"
- Line 51: Update your title/role
- Line 54: Update your bio

**Header** ([`src/components/Header.astro`](src/components/Header.astro)):
- Social links are minimal - customize as needed

**Footer** ([`src/components/Footer.astro`](src/components/Footer.astro)):
- Line 9: Update copyright name
- Lines 13-32: Update social links (GitHub, Twitter, Email)

### 3. Customize Your Projects

**Edit the projects array in [`src/pages/index.astro`](src/pages/index.astro)** (lines 16-36):

```typescript
const projects = [
	{
		name: 'your-project-name',
		description: 'Brief description of what this project does',
		url: 'https://github.com/yourusername/project-name',
		language: 'TypeScript',  // or Python, Go, Rust, etc.
	},
	// Add more projects...
];
```

**Tips for showcasing projects:**
- Feature your 3-5 best or most recent projects
- Keep descriptions concise (1-2 sentences)
- Include the primary language/technology
- Link directly to the GitHub repository
- Update the "View all projects" link (line 95) with your GitHub profile

### 3. Configure for GitHub Pages

**Update [`astro.config.mjs`](astro.config.mjs)**:

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name',  // Change this to your repo name
  // ... rest of config
});
```

### 4. Writing Blog Posts

Create a new file in `src/content/blog/`:

```markdown
---
title: 'Your Post Title'
description: 'A brief description'
pubDate: 2024-01-15
tags: ['tag1', 'tag2']
draft: false
---

# Your Content Here

Write your post in Markdown or MDX format.
```

**Supported frontmatter fields:**
- `title` (required): Post title
- `description` (required): Brief description
- `pubDate` (required): Publication date
- `updatedDate` (optional): Last update date
- `heroImage` (optional): Header image
- `tags` (optional): Array of tags
- `draft` (optional): Set to `true` to hide from production

## 🎨 Design Philosophy

This theme is intentionally minimal and clean:
- **Light color palette**: Grays and subtle accents
- **Content-first**: No distractions, focus on writing
- **Readable typography**: Optimized for long-form reading
- **Dark mode**: Automatic theme switching
- **Responsive**: Works on all devices

## 📁 Project Structure

```
blogfolio/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── layouts/          # Page layouts
│   │   └── BlogPost.astro
│   ├── pages/            # Routes
│   │   ├── index.astro   # Homepage
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── about.astro
│   ├── content/          # Blog posts
│   │   └── blog/
│   │       └── *.md(x)
│   └── styles/
│       └── global.css
├── public/               # Static assets
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Pages deployment
```

## 🚢 Deployment to GitHub Pages

### Step 1: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. The workflow will automatically deploy on every push to `main`

### Step 3: Update Configuration

Make sure [`astro.config.mjs`](astro.config.mjs) has the correct `site` and `base`:

```javascript
site: 'https://yourusername.github.io',
base: '/your-repo-name',
```

### Step 4: Push and Deploy

```bash
git push
```

Your site will be live at: `https://yourusername.github.io/your-repo-name`

## 🛠️ Available Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

## 📝 Writing Tips

### Code Blocks

Use triple backticks with language:

\`\`\`javascript
const greeting = 'Hello, World!';
console.log(greeting);
\`\`\`

### Images

Place images in `src/assets/` or `public/`:

```markdown
![Alt text](../../assets/my-image.jpg)
```

### Links

```markdown
[Link text](https://example.com)
```

### Using MDX

MDX files (`.mdx`) allow you to use React components:

```mdx
---
title: 'My Post'
---

import MyComponent from '../../components/MyComponent.tsx';

# Regular Markdown

<MyComponent />
```

## 🎨 Customizing Colors

The theme uses a minimal gray palette. To customize, edit [`src/styles/global.css`](src/styles/global.css):

```css
:root {
	--accent: #4a5568;        /* Main accent color */
	--accent-dark: #2d3748;   /* Darker accent */
}
```

Tailwind classes are available throughout. The design uses:
- `gray-*` for most UI elements
- Minimal use of color for focus on content
- Dark mode variants with `dark:` prefix

## 🔧 Advanced Customization

### Adding New Pages

Create a new file in `src/pages/`:

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<html lang="en">
  <head>
    <BaseHead title="Page Title" description="Description" />
  </head>
  <body class="flex flex-col min-h-screen bg-white dark:bg-gray-900">
    <Header />
    <main class="flex-1">
      <!-- Your content -->
    </main>
    <Footer />
  </body>
</html>
```

### Modifying the Theme Toggle

The theme toggle is in [`src/components/ThemeToggle.tsx`](src/components/ThemeToggle.tsx). It automatically:
- Detects system preference
- Saves user choice to localStorage
- Prevents flash of unstyled content

### Adding Analytics

Add your analytics script to [`src/components/BaseHead.astro`](src/components/BaseHead.astro):

```astro
<!-- Analytics -->
<script async src="https://your-analytics.com/script.js"></script>
```

## 📊 Performance

The site is optimized for performance:
- Static site generation (no server needed)
- Minimal JavaScript (only for theme toggle)
- Optimized images
- Fast page loads
- SEO-friendly

Expected Lighthouse scores: 90+

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules .astro dist
npm install
npm run build
```

### Base Path Issues

If assets aren't loading, check that `base` in [`astro.config.mjs`](astro.config.mjs) matches your repository name.

### Dark Mode Not Working

The theme toggle requires JavaScript. Make sure it's enabled in your browser.

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MDX Guide](https://mdxjs.com/)
- [GitHub Pages](https://pages.github.com/)

## 🤝 Contributing

This is your personal blog! Customize it however you like. The minimal design is intentional - it's a foundation for your content.

---

**Ready to start writing?** Create your first post in `src/content/blog/` and run `npm run dev`!