# Matchplan Academy

A German-language football analytics learning application built with React,
TypeScript, and Python running in the browser. It connects reading, executable
exercises, project work, and portable learning records in one local application.

The project began as a personal route into football data analysis and scouting.
Its engineering focus is making a substantial curriculum usable and verifiable:
typed execution boundaries, recoverable browser storage, reproducible datasets,
and exports that can continue as ordinary Python projects in an IDE.

## What you can do

- Read eight core study chapters and two optional extensions on video analysis
  and AI engineering, with source notes and downloadable chapter workbooks.
- Work through 66 Python/SQL lessons, including seven review exercises, with
  starter code, staged hints, reference solutions, checks, and reflection prompts.
- Complete four project workshops: match reporting, an xG model, a scouting app,
  and action values. Export code, data, notebooks, reports, and assumptions as ZIPs.
- Run Python, SQLite, pandas, NumPy, scikit-learn, and Matplotlib locally in a
  Web Worker; cancel execution and download figures.
- Keep notes and progress in the browser, export/import JSON backups, and recover
  from invalid stored data without silently replacing the original.
- Continue outside the browser with an own-code Python CLI starter and four
  workshop folders under [Beispielprojekte](Beispielprojekte/README.md).

The application and teaching content are in German. This README is in English
so reviewers can inspect the implementation and its scope.

## Run locally

Use Node.js 24 LTS, npm, and a current browser with WebAssembly support.
Python 3.11 or later is needed only for native examples and provenance checks.

```sh
npm ci
npm run dev
```

Open the address printed by Vite, normally `http://localhost:5173`.
The first run downloads the pinned Python analysis packages and checks their
SHA-256 hashes against the Pyodide manifest. Later runs reuse valid local files.
No account, API key, or paid AI service is needed for the main application.

See [getting started](docs/getting-started.md) for the learning flow, backups,
native Python commands, and troubleshooting. The application is a static site;
[deployment instructions](docs/deployment.md) describe private Vercel hosting.
Public source availability and access to a hosted instance are separate choices.

## Engineering decisions

| Concern              | Implementation and tradeoff                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Python execution     | A typed Worker protocol keeps evaluation off the UI thread. One warm worker reduces startup costs; cancellation destroys it and a new attempt creates a new generation. Late messages/errors cannot complete a newer run. |
| Persistence          | A shared codec validates imports and saved progress. Storage and React lifecycle code are separate. This supports migration and explicit recovery, but there is no server backup or device synchronization.               |
| Assessment           | Code checks, study marks, and project completion have distinct rules. Passing checks demonstrates the exercise contract, not the quality of a sporting recommendation.                                                    |
| Project delivery     | Catalog, assessment, completion, and archive generation are separate modules. ZIP export consumes learning state without owning persistence.                                                                              |
| Runtime distribution | Pinned Pyodide assets and checksummed packages are served with the app. This avoids a Python backend but adds roughly 50 MB of runtime assets and requires an initial download.                                           |
| Content provenance   | Dataset snapshots and copied upstream examples have revision/hash manifests. Original teaching material and external source code have distinct ownership and licensing.                                                   |

[Architecture](docs/architecture.md) explains module responsibilities and
invariants. [Design](docs/design.md) documents the interface system.

## Code to inspect

| Location                                          | Responsibility                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `src/learning/`                                   | Progress contracts, storage recovery, React hooks, chapter workbooks |
| `src/runtime.ts`, `src/runtime-protocol.ts`       | Worker lifecycle, typed transport, timeouts and cancellation         |
| `src/python.worker.ts`, `src/python-evaluator.ts` | Python/SQL host, exercise checks and figure handling                 |
| `src/projects/`                                   | Project catalog, assessment, completion and archive delivery         |
| `src/course/`, `src/course-study.ts`              | Curriculum, source provenance and teaching fixtures                  |
| `src/ui/`, `src/styles/`                          | Reading workspace, editor, controls and shared visual roles          |
| `scripts/`                                        | Runtime preparation, dataset rebuilding and example verification     |
| `Beispielprojekte/Matchplan-Fussball/`            | Small native Python package with CSV validation, CLI and tests       |

## Verification

```sh
npm run check
npm test
npm run verify:examples
python -m unittest discover -s Beispielprojekte/Matchplan-Fussball/tests -v
npm run build
```

`check` runs TypeScript and formatting checks. Vitest covers the UI learning flow,
backup migration/recovery, execution lifecycle, project completion and exports.
It also runs starters, reference solutions, and exported analysis scripts against
the real Pyodide engine; UI tests substitute the runtime at its boundary.
Example verification checks file hashes without executing the upstream demos.
The [CI workflow](.github/workflows/ci.yml) runs these checks on Node 24 and Python 3.12.

## Data and limits

Most introductory exercises and all four workshop fixtures use synthetic data.
The distributed practice data is independently generated and fictional: 6,948
nested events from two synthetic matches and 255 shots across twelve matches.
The generator and SHA-256 manifest make it reproducible without a data-provider
account. Scores on this sample test implementation, not real-world model quality.

StatsBomb is a schema reference and an optional local data source. Its raw data
is **not redistributed** in this repository or the hosted application. The
optional downloader writes only to ignored `.local/` after explicit acceptance
of the source terms. See [dataset provenance](src/course/datasets/SOURCE.md).

There is no job-readiness certification, assessment proctoring, or automatic
backup across devices. The browser downloads a scientific runtime on first use;
this trades a larger initial transfer for running analysis without a Python server.

## Sources, ownership and contributions

Project-owned code and documentation use the [MIT License](LICENSE).
The optional StatsBomb downloads, bundled font, dependencies, and copied upstream demos
retain their own terms; see [third-party notices](THIRD_PARTY_NOTICES.md).
The three upstream AI/RAG example selections are attributed study references,
not original Matchplan implementations. They were preserved without repair and
were not executed as part of this project.

[Contributing](CONTRIBUTING.md) describes focused changes and validation.
Report vulnerabilities according to the [security policy](SECURITY.md).
