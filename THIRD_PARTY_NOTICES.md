# Third-party notices

## Project-owned material

The root [MIT License](LICENSE) applies to project-owned code and documentation,
including the Matchplan application, original teaching material, and own-code
Python examples. It does not relicense third-party source, datasets, fonts,
dependencies, linked publications, logos, or media. Original upstream authors
retain their copyrights.

## Generated Git workflow viewers

`public/diagrams/git-*.html` was generated with Archify 3.0.1. The embedded
viewer uses MIT-licensed Archify code, copyright 2026 tt-a1i and 2025 Cocoon AI;
the complete notice is in `public/licenses/archify.txt`. Embedded JetBrains Mono
font notices and the SIL Open Font License remain inside each HTML artifact.
The Git explanations and workflow specifications were written for Matchplan.

## Complete upstream sports source archives

`Beispielprojekte/Originale/Archive/` contains unmodified GitHub source ZIPs of
these independently maintained projects, each pinned to a full commit in the
[archive manifest](Beispielprojekte/Originale/Archive/manifest.json):

| Project                                                                         | Upstream copyright                        | License                      |
| ------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------- |
| [FastF1](https://github.com/theOehrly/Fast-F1)                                  | Philipp Schäfer, 2026                     | MIT, `LICENSE` inside ZIP    |
| [nba_api](https://github.com/swar/nba_api)                                      | Swar Patel, 2018                          | MIT, `LICENSE` inside ZIP    |
| [nflreadpy](https://github.com/nflverse/nflreadpy)                              | nflreadpy contributors, 2025              | MIT, `LICENSE.md` inside ZIP |
| [mplsoccer](https://github.com/andrewRowlinson/mplsoccer)                       | Anmol Durgapal and Andrew Rowlinson, 2025 | MIT, `LICENSE` inside ZIP    |
| [Soccer Analytics Handbook](https://github.com/devinpleuler/analytics-handbook) | Devin Pleuler, 2020                       | MIT, `LICENSE` inside ZIP    |

All original archive bytes and license texts are retained. The extraction helper
creates ignored working copies for IDE study without installing or executing
upstream code. Git history and separately referenced Git submodules are not part
of GitHub source ZIPs. External datasets, fonts, APIs, marks and other services
remain subject to their own terms. The pinned projects were not run or
certified compatible with current provider endpoints.

## Selected upstream AI/RAG examples

These are selected source folders, not complete upstream repositories or original
Matchplan implementations. They are preserved at fixed revisions without repair.
They were not installed or executed as part of this project; external services,
credentials, missing assets, or unfinished scaffolds may prevent reproduction.

| Local selection                                   | Upstream and revision                                                                                                                                                                                                | Copyright and license                                                                            |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Beispielprojekte/Originale/patchy-agentic-rag/`  | [patchy631/ai-engineering-hub](https://github.com/patchy631/ai-engineering-hub), `agentic_rag`, revision `042aeb5067384981eeba6a07fa882f436bb1660d`                                                                  | Copyright (c) 2024 patchy631; [MIT text](Beispielprojekte/Originale/patchy-agentic-rag/LICENSE)  |
| `Beispielprojekte/Originale/patchy-colivara-rag/` | [patchy631/ai-engineering-hub](https://github.com/patchy631/ai-engineering-hub), `Colivara-deepseek-website-RAG`, same revision                                                                                      | Copyright (c) 2024 patchy631; [MIT text](Beispielprojekte/Originale/patchy-colivara-rag/LICENSE) |
| `Beispielprojekte/Originale/adil-hybrid-rag/`     | [AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects), `projects/02-hybrid-rag-over-notion`, revision `ecd9484ce791ab5f63d397b488deba9517b9ad3b` | Copyright (c) 2026 Adil Shamim; [MIT text](Beispielprojekte/Originale/adil-hybrid-rag/LICENSE)   |

The [manifest](Beispielprojekte/Originale/manifest.json) records each copied file's
source URL, byte size, and SHA-256, plus excluded assets. Keep the copyright and
permission notices with redistributed copies or substantial portions. See the
[originals guide](Beispielprojekte/Originale/README.md) for setup and scope.
`npm run verify:examples` checks the local copies without executing them.

## Practice data and optional StatsBomb source

The distributed files under `src/course/datasets/` are independently generated
fictional teaching data, covered by the root MIT License. They are not player
observations or a transformed StatsBomb extract. Their generator, seed, coverage,
and checksums are documented in [SOURCE.md](src/course/datasets/SOURCE.md).

The course refers to the StatsBomb event schema. An optional downloader can
retrieve the pinned source revision
`4b73468fc5b0f1950f9f66fada70ad3a4f9327cb` from
[Hudl/StatsBomb Open Data](https://github.com/hudl/open-data) for private local study.
It requires `--accept-source-terms`, writes to ignored `.local/external-data/`,
and never replaces the distributed fixtures. No StatsBomb raw records are
included in the public repository or deployed bundle.

The upstream [user agreement](https://github.com/hudl/open-data/blob/master/LICENSE.pdf)
restricts redistribution and commercial exploitation. Publishing derived
analysis requires StatsBomb attribution and its logo; consult its current
[README](https://github.com/hudl/open-data#terms--conditions) and
[media pack](https://statsbomb.com/media-pack/). The root MIT License grants no
rights over those optional downloads.

## Font

`public/fonts/dm-sans-variable.ttf` is DM Sans, copyright 2014 The DM Sans Project
Authors. It uses the SIL Open Font License 1.1, retained in
[public/fonts/OFL-DM-Sans.txt](public/fonts/OFL-DM-Sans.txt). The font license and
any reserved-name conditions apply independently of the application license.

## JavaScript and Python runtime dependencies

React, CodeMirror, fflate, Pyodide, and the development tools are third-party
software. Exact npm versions and transitive dependencies are recorded in
`package-lock.json`; their copyright and license texts remain in their installed
packages. Bundling them does not transfer their ownership to this project.

Runtime preparation collects the installed production npm packages' full license
texts into `public/licenses/npm.txt`, served with the deployed application.
Pyodide uses MPL-2.0; its license is retained under `public/licenses/` and its
unmodified source is available at the pinned upstream release `314.0.7`.

Pyodide includes Python and a scientific package ecosystem, including NumPy,
pandas, scikit-learn, and Matplotlib. Runtime package versions and hashes are
recorded in the pinned Pyodide `pyodide-lock.json`, copied to `public/pyodide/`
during preparation. Python and these packages retain their respective licenses;
they are not all licensed under the root MIT License. Consult the distributed
package metadata and upstream license texts when redistributing runtime assets.

The standalone Matchplan Python starter performs its analysis with the standard
library and uses setuptools to build/install. Workshop exports can request
additional third-party packages in their requirements files. Installing those
packages does not relicense them.

## Linked sources and media

The design review method draws on [Unslop](https://heydamir.design/unslop) by
Damir Sokolovsky (@heydamir), licensed under CC BY 4.0. This credits the adapted
method; project-owned application code remains MIT.

Course source notes credit the relevant repositories, tutorials, publications,
and providers. A link or teaching summary does not grant permission to copy an
entire linked work. Materials without an established reuse permission are linked
rather than copied as original source folders. External videos, PDFs, logos, and
provider services retain their owners' terms. Inclusion is not an endorsement
or evidence of a commercial or club relationship.
