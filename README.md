# Slope Lens 3D — presentation

An eight-slide website for IC202P Design Practicum, Group 26, IIT Mandi, with a continuous study view and contextual technical chapters. The slides explain the field problem, six landslide categories, dataset, classification method, reported evaluation, measurement geometry, actual output, and next steps.

## Technical depth

Use **Theory** for a detailed explanation of the current slide, or **Study view** for all eight chapters in a continuous reading layout. These add roughly 3,200 words of project theory, equations, data tables, methodological choices, source links and documented limitations. Speaker notes explain how to present the material.

- Select any category on slide 3 to inspect its mechanism, field clues, class counts, test recall and precision.
- Slide 5 distinguishes frozen representations from trained class-balanced logistic-regression heads, including feature dimensions and probability averaging.
- Slide 6 switches between model comparison, measured confidence–coverage trade-offs, and per-class recall. Its slider selects reported out-of-fold thresholds; it does not run new experiments. Held-out system results alongside it remain fixed at the shipped 0.60 operating point.
- Slide 7 walks through outline, depth, scale, plane geometry and Monte Carlo ranges. A second tab preserves the actual poster output. Its theory chapter includes a scale-multiplier illustration, explicitly separate from the project's measurement output.
- Study chapters cover geotechnical background, leakage control, regularisation, augmentation, evaluation denominators, Bayesian field questions, multiview capture and the validation roadmap.

## Present locally

Requires Node.js 20 or newer. No dependencies, installation, account, API key or model download is needed.

```sh
npm start
```

Open http://127.0.0.1:4387. You can also open `dist/index.html` directly for an offline presentation. All presentation assets are local; only the source repository links require internet.

| Control | Action |
| --- | --- |
| Right / Space / Enter / Page Down | Next slide |
| Left / Page Up | Previous slide |
| 1–8, Home, End | Jump to a slide |
| F | Fullscreen |
| O | Slide overview |
| N | Speaker notes (visible on the same screen) |
| T | Contextual theory chapter |
| S | Toggle continuous study view |
| M | Pause or resume motion |
| B / Escape | Blank screen / restore |
| P or Ctrl+P | Print all eight slides |
| Horizontal swipe | Previous / next on touch screens |

Slide 2 has a cross-section and a pointer-responsive terrain study. The terrain is a mathematical illustration, **not a reconstruction produced by the project's model**. System reduced-motion preferences are respected. Hash links such as `#6` open a particular slide. Narrow screens allow vertical scrolling within each slide.

## Deploy

The complete static site is in `dist/`. Publish that directory on any static host. There are no server endpoints, uploads, external fonts, analytics or runtime dependencies.

```sh
npm run build
```

The build validates local asset references and the eight-slide structure, then runs presentation-control checks. It does not generate or transpile files.

- **GitHub Pages:** In repository Settings → Pages, choose **GitHub Actions** as the source. The included workflow validates and deploys `dist/` on pushes to `main` or manual runs. If Pages has not been enabled, enable it and run the workflow again.
- **Vercel:** Import this repository, choose Other, use `npm run build`, and set output directory to `dist`.
- **Netlify:** Import this repository; the included `netlify.toml` supplies the command and publish directory.
- **Sites:** `.openai/hosting.json` retains the existing private Site identity and static output directory.

## Content provenance

Primary sources are the supplied `G26_SlopeLens_Poster-2.pdf` and [Landslide-Category-Classifier](https://github.com/DhmalTPS/Landslide-Category-Classifier), reviewed at commit `74ba236bb4709c0c1f18a29338d06faba0829a2a`.

See [SOURCES.md](SOURCES.md) for a slide-by-slide evidence map. The deck distinguishes reported model confidence from test accuracy, usable-photo evaluation from full-pipeline evaluation, and current implementation from future scope. It is a presentation, not a running classifier.

The poster describes human labels; the repository report explicitly states that current labels are AI annotations. Slides 4 and 6 retain the report's disclosure. Absolute dimensions are estimates awaiting field validation. The project's interactive 3D terrain viewer remains proposed.

Poster imagery and the poster PDF were supplied for this presentation. No additional photographer or licence metadata was supplied for these images. Terrain illustrations and animation code were created for the deck. This repository does not relicense third-party material.

## Verification

`npm run build` checks the eight-slide structure, assets and controller contracts, including navigation, modal behaviour, study mode, tabs, measured threshold values, motion, print state and touch. These use a minimal DOM contract and do not replace browser layout checks. The expanded site was also reviewed in the browser, including the interactive threshold chart, measurement stages, theory panel, scale illustration and study view. Print styles are included; physical projector and printer behaviour should be checked on the event equipment.

Edit `dist/content.js` for the technical chapters, class evidence, threshold table and stage descriptions. `dist/app.js` handles the controls, and `dist/depth.css` styles the expanded content. All content and interactions run offline; linked external evidence requires internet.
