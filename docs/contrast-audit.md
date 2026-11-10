# Contrast audit, 10 November 2026

The review covers the existing light interface and its dark editor/output panels.
A separate reviewer inspected CSS inheritance and calculated contrast pairs. The
implementation pass confirmed the failures using computed browser styles, then
checked the repaired surfaces in the browser. No deployment or Git publication
was performed.

## Findings and corrections

The Lernraum's local theme contained a cycle: `--panel: var(--text)` and
`--text: var(--panel)`. Both properties became invalid at computed-value time,
along with dependent backgrounds. This exposed light outer surfaces beneath
light syntax colors and left dark inherited text on dark toolbars.

| Measured case before the fix                   |  Ratio |
| ---------------------------------------------- | -----: |
| Active editor line                             | 1.00:1 |
| Toolbar title and reset button                 | 1.15:1 |
| Run button label                               | 1.08:1 |
| Empty output/help text                         | 1.71:1 |
| Syntax keyword on the exposed light background | 1.92:1 |

The editor and output now define an acyclic local palette: `#16211c` canvas,
`#1f2e26` raised panels, `#f1f5f2` text, and `#c1cec5` secondary text. Surface
properties consume background tokens rather than using the foreground token as
a background. Syntax colors remain separate from interface text.

Primary buttons inside dark panels have explicit foreground/background pairs,
including hover and disabled states. The local focus indicator is light, and
forced-color rules restore system colors. CodeMirror selection matches and
matching brackets use the same readable surfaces. The comparison rays in the
points-per-million plot now use the control-border token instead of a pale stroke.

| Measured case after the fix                                  |                Ratio |
| ------------------------------------------------------------ | -------------------: |
| Lowest of 28 editor text/surface pairs, comment on selection |               5.20:1 |
| Focus indicator against raised dark panel                    |               8.72:1 |
| Control border against dark canvas                           |               6.36:1 |
| Comparison ray against white plot surface                    | approximately 4.00:1 |

## Browser coverage

Computed foreground colors were checked against ancestor backgrounds on all
seven main views: Projektweg, Studium, Lernpfad, Projekte, Wiederholen, Abschluss
and Lernraum. No failures remained in these sampled rendered states.

Additional Lernraum checks covered Python comments/strings/numbers/keywords,
the active line, secondary help text, reset confirmation, Run hover, loading,
printed output, passed/failed checks, and a Python exception. Test-code edits
used an isolated incognito profile rather than the learner's saved code.

Desktop and 390px layouts were inspected visually. At 390px, document width
remained within the viewport, and the sampled text check found no failures.
The editor palette matrix also covers active-line and selection surfaces that
a simple ancestor-background scan cannot detect by itself.

## Criteria and limits

The thresholds follow [WCAG 2.2 text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html):
4.5:1 for normal text and 3:1 for qualifying large text. Meaningful control and
graphic indicators use [3:1 non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
Disabled controls are exempt, though they retain readable text here.

This is a targeted contrast review, not a complete WCAG conformance assessment.
The browser scan uses computed text colors and ancestor background compositing;
it does not certify every possible editor selection, image, overlay or operating
system theme. Forced Colors was reviewed in source, not exercised in a native
Windows high-contrast session. Existing keyboard, runtime, progress and export
behavior remains covered by the relevant application tests.
