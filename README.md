# Slope Lens 3D — project presentation

An eight-slide, browser-based presentation for IC202P Group 26, IIT Mandi. Static HTML, CSS and JavaScript; no runtime dependencies, API keys, tracking or model downloads.

## Present

Run `npm run dev`, then open http://127.0.0.1:4387. You can also open `dist/index.html` directly for an offline presentation. Every visual asset is local, including the supplied poster. A modern Chromium, Firefox or Safari browser is recommended.

- Left/right arrows, Page Up/Page Down, Space or Enter: navigate.
- Keys 1–8: jump to a slide. Home/End: first/last slide.
- F: fullscreen; O: overview; N: speaker notes; B: blank screen.
- Swipe horizontally on touch devices. Smaller screens scroll within each slide.
- Browser Print / Save as PDF: eight landscape pages using the print stylesheet.

Speaker notes appear in the same window and are visible on a mirrored projector. Close them before showing the deck. Fullscreen depends on browser support and user interaction.

## Deploy

`npm run build` checks the slide count and local asset references. Publish the **dist** directory to any static host. There is no compilation step. Hash-based slide URLs work without route rewrites.

- Netlify: build command `npm run build`, publish directory `dist`.
- Vercel: framework Other, build command `npm run build`, output directory `dist`.
- GitHub Pages: the included Actions workflow deploys `dist` when Pages is configured to use GitHub Actions.
- Sites: `.openai/hosting.json` retains the registered project identity.

Node 22 or later is sufficient for the optional local server and checks. The presentation itself runs without Node.

## Content and sources

The supplied `G26_SlopeLens_Poster-2.pdf` provides project identity, team names, the field workflow and the example output. Images are extracted from that poster; original photographer/licence metadata was not supplied. Original explanatory SVG diagrams are included in the website. The project poster is available in the final slide.

Technical claims follow [Landslide-Category-Classifier](https://github.com/DhmalTPS/Landslide-Category-Classifier/tree/74ba236bb4709c0c1f18a29338d06faba0829a2a), snapshot `74ba236bb4709c0c1f18a29338d06faba0829a2a`:

- `report.md` §2: 4,954 collected photos, 2,062 sites, 1,325 usable; usable splits 908/154/263. All current labels are AI-made, despite the poster's “human labelled” wording. Blind human review remains pending.
- §3: frozen DINOv2-base/large and SigLIP2-base probes, probability averaging, train/validation-only selection and threshold 0.60.
- §4.2: usable-test accuracy 0.806, macro-F1 0.784, CI [0.688, 0.857]; ConvNeXt 0.665 and Qwen 0.327 macro-F1.
- §4.3: full-pipeline precision 0.605 over all 1,008 test photos; confident usable-photo accuracy 0.857 at 0.692 coverage.
- §6b: measurement pipeline and lack of ground-truth field sizes. The 3D viewer is proposed, not implemented.

Slide 7 reproduces one output example (78% confidence) and does not run inference. Numerical estimates are not surveyed measurements. This site is a presentation of the prototype, not the classifier application. Decision support only: findings require confirmation by a geologist or geotechnical engineer.

## Structure

`dist/index.html` holds the eight slides; `dist/style.css` handles responsive, reduced-motion and print styles; `dist/app.js` holds navigation, diagrams and speaker notes. Edit these files directly. Source links are pinned to a commit so the reported evidence can be reviewed later.
