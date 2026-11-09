# Fictional Matchplan teaching dataset

The bundled records are independently generated synthetic teaching data. They do
not contain, project, perturb or transform real match records. Teams, player
profiles, identifiers, dates, locations, pass outcomes and shot labels are fictional.
No external dataset or network request is used by the generator.

Rebuild with `python scripts/generate-teaching-data.py` (Python standard library
only). Revision `matchplan-synthetic-v1` fixes the rules, seed and UTF-8 JSON
serialization. `provenance.json` records SHA-256 hashes of the exact event and shot
file bytes. `--output-dir PATH` supports independent reproducibility checks.

There are 255 generated shots across twelve fictional matches on six dates, with
two matches per date so chronological evaluation must preserve date cohorts.
The 6,948 events cover the complete synthetic timelines of the first two matches
(3,474 events each, two halves and explicit start/end markers). For the other ten
matches event coverage is unknown: `events: null` means not supplied, never zero
observed events. Shots in the first two matches reference the same event IDs and
values as their nested event counterparts.

The nested event shape and 120 x 80 coordinate grid are provider-inspired teaching
contracts. Both halves attack the goal at (120, 40); units are not metres.
For a valid `pass` dictionary, omitted `outcome` explicitly means completed in
this exercise. Recognized unsuccessful outcomes are `Incomplete`, `Out`,
`Pass Offside`, `Injury Clearance` and `Unknown`. This convention must not be
generalized to other missing fields or feeds.

The compatibility column `provider_xg` stores generated geometry-based
probabilities, and nested shots call this value `generated_xg`. It is not an
external provider's estimate. `goal` is a generated binary label. Outcomes overlap:
central misses and distant goals deliberately prevent a perfectly separable
geometry exercise. These records support software and evaluation practice, not
claims about real players, scouting, provider calibration or football populations.

External StatsBomb data may be imported separately into an ignored local path
under its own terms. It is not the default bundled dataset and must not be
redistributed with the application.
