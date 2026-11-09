# Contributing

Matchplan Academy is a German-language personal learning application for football
data analysis. Contributions should keep the curriculum understandable, results
reproducible, and source ownership explicit. English is welcome in technical
discussions; keep user-facing course content consistent with the German interface.

## Propose a focused change

For a bug, describe how to reproduce it, the expected result, browser/runtime
versions, and relevant output. Use synthetic examples and remove personal data,
API keys, private learning backups, and club information from reports.
For a larger feature or curriculum change, discuss the intended behavior before
expanding the architecture or adding dependencies. See [architecture](docs/architecture.md)
and [design](docs/design.md) for existing responsibilities and interface conventions.

## Develop and validate

Follow [getting started](docs/getting-started.md), then run:

```sh
npm ci
npm run check
npm test
npm run verify:examples
python -m unittest discover -s Beispielprojekte/Matchplan-Fussball/tests -v
npm run build
```

Use Node 24 LTS and Python 3.11 or later; CI uses Python 3.12. Runtime preparation
needs internet on the first run. Run checks relevant to the change while iterating,
and report the checks actually completed with any failures or limitations.

Keep changes small. For behavior changes, add a regression test that would fail
before the fix. Verify UI changes in the browser, including keyboard interaction,
readability, narrow layouts, and error/recovery states. Avoid changing assessment
rules, backup compatibility, or exported files without documenting the effect.

## Preserve learning and data contracts

- A reading mark is separate from passing executable checks. Assisted attempts
  must remain distinguishable from independent completion.
- Invalid imported or stored progress must not silently replace recoverable data.
  Retain compatibility with existing version-1 backups where possible.
- Tests should exercise behavior and meaningful expected results, including input
  changes that expose hardcoded answers or leakage.
- Label synthetic fixtures, reference solutions, approximations, and external
  reproduction steps. Do not imply club use, certification, or model quality
  without evidence.
- Keep source, selection, revision, license, and hashes when changing datasets or
  importing external examples. Check reuse permissions before copying material.

## Third-party examples

`Beispielprojekte/Originale/` contains pinned, unchanged upstream selections.
Do not repair, reformat, or execute them as part of routine app work. Their
manifest verifies the imported bytes, including upstream licenses. If an upstream
refresh is needed, treat it as a provenance change with an explicit revision,
license review, updated hashes, and documentation of omitted files.
Own experiments belong in a separate working copy.

Project-owned contributions are supplied under the repository's MIT License.
Third-party terms remain in force; see [notices](THIRD_PARTY_NOTICES.md).
Follow the [security policy](SECURITY.md) for sensitive reports.
