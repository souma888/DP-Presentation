# Evidence map

Repository snapshot: `74ba236bb4709c0c1f18a29338d06faba0829a2a`. Statistics below are reported results, not independently reproduced experiments.

| Slide | Content | Evidence |
| --- | --- | --- |
| 1 | Name, objective, institution, course | Supplied poster: heading and course block |
| 2 | Difficult terrain, exposure, flat photographs | Poster: The Problem; terrain illustration is schematic |
| 3 | Six categories and visible evidence | Repository `report.md` §1 and `labeling_guide.md` |
| 4 | 4,954 collected photographs; 2,062 sites; 1,325 usable photographs | `report.md` §2 |
| 4 | Usable splits: 908 / 154 / 263 | Sum of six usable-class counts in the split table, excluding reject |
| 4 | Current labels made by an AI annotator | `report.md` §2, Label caveat; conflicts with poster wording |
| 5 | Three frozen backbones, linear heads, mean probabilities, 0.60 threshold | `report.md` §3; `README.md` |
| 6 | Ensemble 0.784 macro-F1; ConvNeXt 0.665; Qwen 0.327 | `report.md` §4.2; 263 usable test photos across 152 sites |
| 6 | 85.7% accuracy when answering usable photos, 69.2% usable coverage | `report.md` §4.3 |
| 6 | 60.5% end-to-end precision across all photos | `report.md` §4.3; 1,008 test photos including 745 rejects |
| 7 | Rock fall/topple, 78% confidence, dimensional estimates | Poster: Actual Project Output |
| 7 | Outline, depth, scale, geometry and 90% ranges | Poster methodology; `README.md`, Dimensions; `report.md` §6b |
| 8 | Team and faculty mentor | Poster team block |
| 8 | Blind labels and 30–50 local phone photographs | `report.md` summary and recommendations |
| 8 | Interactive 3D viewer proposed | Poster: Future Scope and implementation-status labels |

## Expanded theory and interactive evidence

The eight contextual theory chapters and study view use the same source snapshot. They distinguish background theory from operations the app actually implements.

| Topic | Evidence |
| --- | --- |
| Frozen representations, 1,536 / 2,048 / 768 feature dimensions, standardisation, logistic objective, balanced class weights, C grid | `TECHNICAL_REPORT.md` §4.1–4.3 |
| Equal-weight ensemble and selection across site / source / region / camera shifts | §4.4–4.6 |
| Measured threshold table: 0 / 0.5 / 0.6 / 0.7 / 0.8 / 0.9 | §4.5; out-of-fold train/validation predictions, before the photo gate |
| Precision / recall / macro-F1, bootstrap, pipeline denominators | §5; `report.md` §4.2–4.4 |
| Class counts, dominant-process rules, ambiguous photos | §3.3–3.5; `labeling_guide.md`; `report.md` §4.4 |
| Pinhole back-projection, depth fusion, outline, scale priorities, RANSAC, volume, 1,000 Monte Carlo draws | §7.1–7.10 |
| Current scale prior versus older interval tables, pseudo-label validation, unresolved calibration and grain-range issues | §15 |
| Bayesian field questions, expected information gain, four-shot survey | §9 |
| Rotation / walk distinction, homographies, triangulation, simulated stereo and video results | §8 |
| Prioritised local validation | §16 |

The scale slider illustrates uniform geometric scaling (length ∝ s, area ∝ s², volume ∝ s³). It does not recompute poster estimates or class-dependent volume laws. The confidence slider selects reported measurements; it does not interpolate or fabricate new experiments.

Background references: [USACE Slope Stability manual, EM 1110-2-1902](https://www.publications.usace.army.mil/Portals/76/Publications/EngineerManuals/EM_1110-2-1902.pdf) for effective-stress shear strength, and [USGS Landslide Types and Processes](https://pubs.usgs.gov/fs/2004/3072/fs-2004-3072.html) for movement mechanisms. Mohr–Coulomb is presented as context; the application does not calculate a factor of safety.

The poster is bundled as `dist/assets/poster.pdf`. `slope.png` and `output.jpg` are extracted poster imagery. Geographic data present in the original poster remains in that source document. The presentation does not collect or transmit visitor data.

Permanent source links:

- [Project report](https://github.com/DhmalTPS/Landslide-Category-Classifier/blob/74ba236bb4709c0c1f18a29338d06faba0829a2a/report.md)
- [README and implementation overview](https://github.com/DhmalTPS/Landslide-Category-Classifier/blob/74ba236bb4709c0c1f18a29338d06faba0829a2a/README.md)
- [Labelling guide](https://github.com/DhmalTPS/Landslide-Category-Classifier/blob/74ba236bb4709c0c1f18a29338d06faba0829a2a/labeling_guide.md)
