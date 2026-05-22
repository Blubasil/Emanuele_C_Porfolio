# Emanuele Canova — Design Portfolio (Web)

Interactive web version of the PDF portfolio **Design-Portfolio-Emanuele_Canova_ML.pdf**, with full-page scroll matching all 25 slides.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

Output is in `dist/`.

## Controls

- **Scroll** — move between pages (scroll-snap)
- **Arrow keys / Page Up & Down / Space** — previous / next page
- **Side dots** — jump to a page
- **Bottom bar** — previous / next buttons and page counter

## Assets

Page images are exported from the source PDF (`public/assets/pages/`). To regenerate:

```bash
py -3 scripts/extract_pdf.py
py -3 scripts/optimize_assets.py
```

## Source PDF

`Design-Portfolio-Emanuele_Canova_ML.pdf` in the project root.
