# Matchplan Academy

[![CI](https://github.com/fbnkch/matchplan-academy/actions/workflows/ci.yml/badge.svg)](https://github.com/fbnkch/matchplan-academy/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Matchplan is a German-language learning app for football data analysis. Read the
theory on the website, then build in your IDE: study a focused example, explain
the principle, and apply it to your own implementation.

I started it to connect my interest in football scouting with Python and data
science. The first project is a dashboard for comparing player points and market
values. The season-dashboard scaffold has open implementation tasks, source
references, and progressively reduced guidance. Theory chapters and Python/SQL
exercises help when a task exposes a gap in your knowledge.

## What you can work on

- An IDE dashboard project with open tasks and small reference programs from other domains.
- Match reports, an xG model, a scouting app, and action valuation workshops.
- Data validation, statistical uncertainty, and model evaluation using football examples.
- Git theory, visual workflows, and a separate local lab for branches, conflicts, review, and releases.

Python runs in a Web Worker through Pyodide, including pandas and scikit-learn.
Progress stays in your browser; JSON backups and project ZIPs let you keep your work.

## Run locally

Use Node.js 24 and npm, then open the address printed by Vite.

```sh
npm ci
npm run dev
```

The first run downloads the pinned Python runtime and checks its package hashes.
The app needs no account or API keys. Native examples use Python 3.11 or later.

## Find your way around

| Directory                                       | Contents                                                  |
| ----------------------------------------------- | --------------------------------------------------------- |
| `src/ui/`                                       | Project walkthrough, course reader, and code editor       |
| `src/course/`, `src/kickbase/`                  | Lessons, teaching data, and the guided project            |
| `src/learning/`                                 | Progress validation, browser storage, and execution hooks |
| `src/projects/`                                 | Project assessment and ZIP exports                        |
| [Beispielprojekte/](Beispielprojekte/README.md) | Python projects to open in an IDE                         |

Worker execution and cancellation live in `src/runtime.ts`; exercise evaluation
lives in `src/python-evaluator.ts`. The app has no Python server or account database.

Each workshop lives in `src/projects/definitions/`: its `project.ts` holds the
task, checks, prerequisites, and transfer assignment; Python and CSV files sit
beside it. `src/projects/definition.ts` uses that CSV for both the browser lesson
and the IDE export. `src/projects.ts` remains the public entry point.

## Check a change

```sh
npm run check
npm test
npm run verify:examples
npm run build
```

[CI](.github/workflows/ci.yml) also checks the native Python examples. Keep changes
focused and names descriptive: camelCase in TypeScript, snake_case in Python.

## Data and license

Bundled football data is fictional. The dashboard has no live Kickbase connection;
results from the teaching fixtures do not establish performance on real matches.
See [dataset provenance](src/course/datasets/SOURCE.md).

Original code uses the [MIT License](LICENSE). Copied examples and other external
material retain their own terms in [third-party notices](THIRD_PARTY_NOTICES.md).
See [security](SECURITY.md) for privacy details and vulnerability reporting.
