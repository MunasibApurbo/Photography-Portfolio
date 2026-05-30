# 📸 Premium Minimalist Photography Portfolio Template

A premium, state-of-the-art, high-fidelity responsive photography portfolio built with **React**, **TypeScript**, **Vite**, **Tailored Vanilla CSS**, and **Framer Motion**. Featuring ultra-smooth inertia scrolling (via Lenis), custom masonry grids, dominant color sorting, touch-friendly fluid lightboxes, and a powerful image-optimization engine.

Designed for photographers and developers who want a gorgeous, lightning-fast, production-ready portfolio that is incredibly easy to manage and host.

---

## ✨ Features

- ⚡ **Lightning Fast Performance**: Fully compiled with Vite and optimized to achieve near-perfect lighthouse scores.
- 🎨 **Minimalist Premium Aesthetics**: Elegant dark mode, clean typography (Inter / Outfit), glassmorphic nav overlays, and beautiful micro-interactions.
- 🖼️ **Automated Photo Processing**: A built-in custom script analyzes aspect ratios, extracts dominant colors (clustering into Red, Orange, Green, Cyan, Blue, Violet, Neutral via HSV conversion), and converts photos into highly-compressed dual-size `.webp` variants.
- 📐 **Dynamic Masonry Layout**: Masonry photo grids that adapt naturally to vertical or landscape orientations.
- 📱 **Responsive & Accessible**: Touch-gesture swipable lightboxes for mobile, full keyboard navigation (arrows/escape), skip-links, and semantic SEO markup.
- ⚙️ **One-File Configuration**: Customize every single bio paragraph, stat, contact link, hero copy, and visual parameter from a single file (`src/config.ts`).

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
First, install the package dependencies (includes `sharp` for server-side image processing):
```bash
npm install
```

### 2. Configure Your Portfolio
Open `src/config.ts` and modify the values with your name, bio, social media targets, and category listings. Everything updates instantly across the site:
```typescript
export const config = {
  name: 'Jane Doe',
  title: 'Jane Doe | Photography',
  email: 'janedoe@example.com',
  socials: {
    linkedin: 'https://www.linkedin.com/in/janedoe/',
    github: 'https://github.com/janedoe',
    facebook: 'https://facebook.com/janedoe',
    twitter: 'https://x.com/janedoe',
    whatsapp: 'https://wa.me/1234567890',
  },
  baseUrl: 'https://janedoe.com/',
  
  hero: {
    title: 'Jane Doe',
    subtitle: 'Everyday moments, shaped through color, mood, and memory.',
    heroImageName: 'forest.jpg', // Raw image filename for hero backdrop
  },
  
  about: {
    heading: 'I look for quiet moments that stay with me.',
    paragraphs: [
      "Hey, I'm Jane Doe. I take photos on streets and walks...",
      "I shoot with whatever I can get my hands on..."
    ],
    stats: {
      focus: 'Street, travel, portrait',
      location: 'New York, USA',
      gear: 'Whatever is in my hands',
    }
  }
};

// Define your visual gallery tab sections
export const CATEGORY_ORDER = ['Street', 'Nature', 'Travel', 'Portrait', 'Still Life'] as const;
```

---

## 📸 Adding and Optimizing Your Photos

No more manual resizing, aspect-ratio calculations, or dominant color clustering! The built-in automated script does everything for you.

1. **Delete the placeholder images** in `raw-images/` and drop your high-resolution original photographs (e.g. `.jpg`, `.png`, `.heic`) directly inside that folder.
2. Run the optimization command:
   ```bash
   npm run optimize
   ```
3. **What the script does behind the scenes:**
   - Detects all newly added files, while skipping previously processed images for rapid incremental runs.
   - Resizes each photo to standard web resolutions: `-900.webp` (for masonry grids) and `-1800.webp` (for high-fidelity lightboxes), saving them inside `public/optimized/`.
   - Calculates the exact aspect ratio (`width / height`) to feed the masonry grid calculations.
   - Resizes to `1x1` to read dominant RGB channels, converts them to HSV space, and groups the photo into its nearest logical color tier (Red, Orange, Yellow, Green, Cyan, Blue, Violet, Neutral) for chromatic gallery sorting.
   - Automatically writes or updates the entire catalog inside `src/data/photoManifest.ts`.
   - **Retains custom titles and categories** you've already filled out in previous runs, preventing data loss!
4. Go to `src/data/photoManifest.ts` to easily assign categories (e.g., `'Nature'`, `'Street'`) and custom titles (e.g., `'Golden Hour Silhouette'`) to your new pictures.

---

## 🛠️ Development & Build Commands

- **Run Dev Server**: Launch local hot-reloaded development environment:
  ```bash
  npm run dev
  ```
- **Typecheck Code**: Audit TypeScript compiles clean:
  ```bash
  npm run typecheck
  ```
- **Build Production Bundle**: Create highly compressed static production bundle in `dist/`:
  ```bash
  npm run build
  ```
- **Preview Production Build**: Test your built bundle locally:
  ```bash
  npm run preview
  ```

---

## 🌐 Deploying to Production

This portfolio compiles down to clean, static HTML, JS, and CSS, making it perfect for free, zero-config hosting platforms:

### 🚀 Option A: Netlify (Recommended)
This template includes a pre-configured `netlify.toml` file setting up high-performance cache controls for webp images and single-page routing:
1. Connect your GitHub repository to Netlify.
2. Set the build command to `npm run build` and publish directory to `dist`.
3. Done! Updates deploy automatically every time you push to GitHub.

### 🚀 Option B: Vercel
1. Run `npx vercel` in the project root or connect Vercel to your repository.
2. Select **Vite** as the framework template.
3. Done!

### 🚀 Option C: GitHub Pages
Since this is a Vite-based single-page application, to host on GitHub Pages:
1. Set the correct `base` path in `vite.config.ts` if your repository is a subfolder project (e.g. `base: '/my-repository-name/'`). If hosting under a custom root domain (e.g. `janedoe.com`), keep `base: '/'`.
2. Configure a GitHub Actions workflow to build and deploy the `dist/` directory to your `gh-pages` branch.

---

## 📄 License

This template is open-sourced under the MIT License. Feel free to use, modify, and share it however you like!
