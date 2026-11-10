# Getting started

## Requirements and first launch

Use Node.js 24 LTS, npm, and a current browser with WebAssembly and Web Worker
support. Native Python work requires Python 3.11 or later; the web app does not
require a system Python installation.

From the repository root:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. On Windows, use
`npm.cmd` if PowerShell blocks the npm script shim.

The `predev`, `pretest`, and `prebuild` hooks prepare the pinned Pyodide runtime
and its analysis packages under `public/pyodide/`. The initial preparation needs
internet access and roughly 50 MB of local runtime files. Package downloads are
checked against the SHA-256 hashes in the runtime manifest. Existing valid
packages are reused. Wait for preparation to finish before opening the app.

The app serves those assets locally. It is not an installable offline PWA: the
local server must keep running. External tutorials and media still need internet.
No API credentials are required for the Matchplan curriculum.

## Choose a learning flow

**Projektweg** is the default. Start with the working Kickbase-style dashboard,
download the IDE project, and complete six milestones with decreasing support.
Each step connects a football question to a file, a command, and explicit checks.
Short explanations and hints are available beside the task. Notes and self-checked
milestones use the existing JSON backup; they never imply passed executable tests.
The example uses fictional players and needs no Kickbase credentials. Live data
access is a separate extension, subject to the provider's terms and availability.

**Studium** is the reading entry point. It contains eight core chapters and two
optional extensions, searchable explanations, reference programs, source notes,
and local project assignments. Chapter workbooks export the teaching text,
examples, assignments, sources, and your notes as a ZIP. Reading marks are
self-assessment and do not imply a passed code exercise.

**Lernraum** and **Lernpfad** contain the 66 executable lessons. Read the task,
edit the starter, run it, inspect the checks and output, and reflect on the result.
Hints and reference solutions are available; the progress record distinguishes
independent completion from assisted practice. SQL uses SQLite, so some syntax
and behavior differ from PostgreSQL. Matplotlib output can be downloaded as SVG.

The code editor uses spaces for indentation. Tab moves focus out of the editor.
A running attempt can be cancelled, including an infinite loop. Cancellation
restarts the Python worker on the next attempt; ordinary attempts reuse a warm
interpreter with fresh evaluation namespaces.

The four project workshops combine code checks, milestones, a report, and a
personal review. Finishing requires passing code checks, completing milestones,
editing the report with at least 80 characters, and confirming the review.
These rules check participation and exercise behavior; they do not independently
validate an analytical recommendation or external club feedback.

## Export work and protect progress

Progress, code, notes, hints used, and project reports are stored in localStorage
under `matchplan-academy-v1`. Storage belongs to the browser origin, including
protocol, host, and port. A different port or browser can appear to have no progress.

Use **Exportieren** to save a JSON backup and **Importieren** to restore it.
Invalid imports do not replace the current learning record. If saved browser
data becomes unreadable, the recovery UI offers original-data download, backup
import, or explicit replacement. Back up before clearing website data, moving
to another device, or changing hosting URLs. There is no automatic synchronization.
Backups contain your entered text and code; review them before sharing.

**Projekt als ZIP exportieren** includes your current `analyse.py`, a labelled
`reference_solution.py`, CSV fixtures, a notebook, report, notes, requirements,
and project instructions. Scouting exports also include a Streamlit `app.py`.
Export is available before completion, so your starter may still be incomplete.
The **Abschluss** area offers a combined portfolio export and remaining work.

Install exported requirements in a separate Python environment, then follow
the exported README. Scripts read CSVs relative to their own directory and save
figures as PNG. Local workshop copies are also in `Beispielprojekte/Werkstaetten/`.

## Native Python starter

[Matchplan-Fussball](../Beispielprojekte/Matchplan-Fussball/README.md) is a small
own-code package for CSV validation and a synthetic scouting shortlist. It uses
Python's standard library for analysis and tests. From the repository root:

```sh
cd Beispielprojekte/Matchplan-Fussball
python -m venv .venv
```

On Windows:

```powershell
.venv\Scripts\python -m pip install -e .
.venv\Scripts\python -m matchplan_data.pipeline --input data/players.csv --output reports
.venv\Scripts\python -m unittest discover -s tests -v
```

On macOS/Linux, replace `.venv\Scripts\python` with `.venv/bin/python`.
Installing the package can need internet to obtain setuptools. The output is
`reports/shortlist.csv` and `reports/manifest.json`. The package README documents
expected results, limitations, and suggested extensions. These synthetic profiles
are teaching fixtures and do not describe real player quality.

The three folders in `Beispielprojekte/Originale/` are separate, unchanged
upstream AI/RAG study examples. They are not dependencies of the web application.
Read [their setup notes](../Beispielprojekte/Originale/README.md) before use;
external providers, credentials, missing assets, or incomplete scaffolds may be
involved. They were not repaired, installed, or executed by this project.

## Check and build

Run these from the repository root:

```sh
npm run check
npm test
npm run verify:examples
python -m unittest discover -s Beispielprojekte/Matchplan-Fussball/tests -v
npm run build
npx vite preview
```

`check` combines typechecking and formatting checks; `npm run format:check` is
available separately. `verify:examples` compares copied originals with the local
provenance manifest without running them or making network requests. The native
starter tests can run without installing the package.

`npm test` includes real-engine Pyodide tests as well as UI and module tests.
Runtime preparation can download files on the first test/build. A successful
build produces `dist/`, a static HTTP-served application including runtime assets.
Do not open `dist/index.html` directly from the filesystem. See
[deployment](deployment.md) for hosting and access protection.

## Data and troubleshooting

Normal use reads fictional teaching data bundled with the application. Rebuild
it without network access using `python scripts/generate-teaching-data.py`.
The generator must reproduce the checksums in `provenance.json`.

For independent study with real observations, review the upstream StatsBomb
user agreement, then run
`python scripts/prepare-practice-data.py --accept-source-terms`.
This optional network download stays in ignored `.local/external-data/statsbomb/`.
It does not replace application data and must not be committed or deployed.
See [dataset provenance](../src/course/datasets/SOURCE.md) for the distinction.
External links can change independently of this repository.

If runtime preparation fails, inspect the reported package or network error and
retry after restoring connectivity. Do not disable checksum validation. If the
browser cannot start Python, use a current browser and inspect failed requests
for `/pyodide/` assets. Restarting the server does not clear browser progress.
If storage is unavailable or full, use the visible save warning and export a
backup before closing the page.
