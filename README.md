# Slope Lens 3D — presentation

An eight-slide website for IC202P Design Practicum, Group 26, IIT Mandi. The presentation explains the field problem, six landslide categories, dataset, classification method, reported evaluation, an actual output example, and next steps.

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

`npm run build` checks structure, assets and navigation/state behaviour. Syntax is checked with `node --check`. Browser visual verification could not be completed in this environment: the in-app browser timed out on localhost, and Windows automation stopped because it could not verify the current browser URL. Before a live event, open the site on the presentation computer and check fullscreen, slide 7's output image, and print preview.
