# Interface design

Matchplan is a learning tool for football data analysis. Its main working view
connects a football question to a small dataset, an explanation and an IDE task.
Kickbase is the first practice project, not the product identity.

## Learning flow

The project path uses six numbered steps because their sequence matters:
understand a working example, change it, implement a calculation, test a time
window, import and preserve data, then compare player profiles. Support decreases
as the learner progresses. Steps remain freely accessible.

Each step provides a question, expected output, working files and commands.
Theory and hints appear beside the assignment in disclosures. The reference
library and executable Python/SQL exercises remain separate destinations.

Self-checked steps record the learner's own assessment. They never count as
passed code checks. Notes, code and completion records use the version-1 backup
format described in [architecture](architecture.md).

## Visual language

The interface uses locally served DM Sans and monospace for code and measured
values. Headings and controls have regular or medium weight; figures use tabular
spacing. A 4px spacing rhythm groups related controls. Desktop navigation has a
240px text column. Narrow layouts stack in reading order.

| Role                         | Value                              |
| ---------------------------- | ---------------------------------- |
| Main canvas                  | `#f5f6f4`                          |
| Reading and working surfaces | `#ffffff`                          |
| Primary text                 | `#202820`                          |
| Secondary text               | `#505b53`                          |
| Accent                       | `#286347`                          |
| Controls                     | 8px radius, visible keyboard focus |
| Dark editor canvas           | `#16211c`                          |
| Raised editor surface        | `#1f2e26`                          |
| Editor text                  | `#f1f5f2`                          |
| Editor secondary text        | `#c1cec5`                          |

Shared roles live in `src/styles/tokens.css`. The editor and console define an
acyclic local palette in `src/App.css`; their foreground and background tokens
must stay independent. Forced Colors uses system colors. Hover and press feedback
uses one easing curve, with reduced-motion overrides.

## Interactive data example

The points-per-million view is the main visual example. Market value is the
x-axis; average points per appearance is the y-axis. Rays from the origin show
fixed points-per-million ratios. Selecting a player updates the highlighted ray,
the arithmetic and the corresponding call to the starter's `points_per_million`
function. The calculation is illustrative, not an embedded Python interpreter.

Native radio controls support player selection. The chart has a visible caption,
and a table provides the numeric data. Calculation updates use a polite live
region. The example identifies all players and values as fictional and does not
imply live Kickbase access or a recommendation to buy a player.

## Accessibility and verification

Text uses contrast appropriate to its size. Focus indicators and meaningful
chart strokes remain distinguishable from adjacent surfaces. The
[contrast audit](contrast-audit.md) records measured pairs and the limits of that
review.

Notes have explicit labels and the same length limits as the persistence codec.
Navigation and step changes manage keyboard focus. Download and clipboard
failures provide a recovery message. External videos load only on request.

UI tests cover the complete step flow, notes, self-checks, help, calculation
selection and export recovery. Archive tests verify the actual project files and
exclude caches. Browser checks cover desktop and 390px layouts; the native
Python reference tests also run against an archive downloaded through the UI.

## Design references

The review method draws on Unslop by Damir Sokolovsky (@heydamir), CC BY 4.0:
https://heydamir.design/unslop. This credits the adapted method; project-owned
application code remains MIT.

The numbered progression pattern was compared with
[React Bits' stepper](https://reactbits.dev/components/stepper). Its source and
animation library are not used. The interface keeps its existing typography,
icons and native controls. The learning rationale is documented in the
[research notes](research/LEARNING-STRATEGY.md).
