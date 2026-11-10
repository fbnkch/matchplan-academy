# Matchplan Academy

[![CI](https://github.com/fbnkch/matchplan-academy/actions/workflows/ci.yml/badge.svg)](https://github.com/fbnkch/matchplan-academy/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Learn football data analysis by working on a running project. Matchplan is a
German-language learning app built around a simple progression: understand an
example, change it, then implement the missing parts yourself.

I started it to connect my interest in football scouting with Python and data
science. The first project is a dashboard for comparing player points and market
values. Theory chapters and Python/SQL exercises help with the task at hand;
downloadable projects let you continue in your own IDE.

## What you can work on

- A guided dashboard project with separate exercises and reference solutions.
- Match reports, an xG model, a scouting app, and action valuation workshops.
- Data validation, statistical uncertainty, and model evaluation using football examples.

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
