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

The poster is bundled as `dist/assets/poster.pdf`. `slope.png` and `output.jpg` are extracted poster imagery. Geographic data present in the original poster remains in that source document. The presentation does not collect or transmit visitor data.

Permanent source links:

- [Project report](https://github.com/DhmalTPS/Landslide-Category-Classifier/blob/74ba236bb4709c0c1f18a29338d06faba0829a2a/report.md)
- [README and implementation overview](https://github.com/DhmalTPS/Landslide-Category-Classifier/blob/74ba236bb4709c0c1f18a29338d06faba0829a2a/README.md)
- [Labelling guide](https://github.com/DhmalTPS/Landslide-Category-Classifier/blob/74ba236bb4709c0c1f18a29338d06faba0829a2a/labeling_guide.md)
