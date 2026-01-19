# Bachelorette site starter

Vite + React + TypeScript single-page site for a bachelorette weekend. Includes a main overview page, bridesmaid detail pages, QR/link CTA to buy the bride a drink, itinerary, and highlight sections with celebratory styling.

## Run locally

```bash
npm install
npm run dev
```

If you hit an `esbuild` install error, delete `node_modules` and retry the install on your machine (the dependencies are listed in `package.json`).

## Project structure

- `src/routes/Home.tsx`: main overview page with hero, CTA, highlights, itinerary, and bridesmaid grid.
- `src/routes/Bridesmaid.tsx`: detail page for each bridesmaid with photo, bio, and social links.
- `src/data/party.ts`: centralized content for the bride, itinerary, and bridesmaids (edit this to customize).
- `public/qr-placeholder.svg`: placeholder QR graphic (replace with your generated QR if desired).

## Build

```bash
npm run build
```
