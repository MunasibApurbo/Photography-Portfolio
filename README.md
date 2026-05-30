# Munasib Apurbo Photography

Production-ready photography portfolio built with React, TypeScript, Vite, and Netlify.

## Local Work

```sh
npm install
npm run dev
```

## Publish Check

Run the same checks expected before a GitHub push or Netlify deploy:

```sh
npm run publish:check
```

## Netlify

This repo includes `netlify.toml` with:

- build command: `npm run build`
- publish directory: `dist`
- Node runtime: `22`
- SPA fallback routing
- security headers
- long-lived caching for generated assets
- `noimageindex` / `noarchive` headers for public gallery images

## Photo Privacy

The website publishes only optimized WebP files from `public/optimized`. Do not commit original camera files or raw exports. The app also blocks casual right-click, drag, copy, and drop actions on protected photo elements.

No public website can fully prevent screenshots or browser developer tools from accessing displayed images. For stronger protection, publish only lower-resolution and/or visibly watermarked derivatives.
