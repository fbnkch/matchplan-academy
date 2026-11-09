# Design review: Matchplan

## Summary

**Good.** This is a React web learning application for an aspiring football data analyst. Its principal job is sustained reading followed by a concrete codebase extension. The Insideout-inspired chapter index, restrained serif headings and quiet reading surface remain the visual direction. Apple's accessibility, hierarchy and input principles apply; native macOS menus, glass and system chrome do not apply to this browser app.

The audit found light implementation drift rather than grounds for another redesign. Refinement keeps the content order, course functionality and palette. No decorative illustration or motion was added.

## Direction

- **Product:** Learn football analytics, then extend and explain a working analysis.
- **Character:** Deliberate, readable, exact.
- **World:** An analyst's study notebook: source material, code, evidence and written conclusions.
- **Moments:** The actual football questions and learner-produced charts carry detail; navigation stays quiet.
- **Signature:** The numbered chapter sequence connects each theory topic to a code extension and explicit acceptance criteria.

## Findings and changes

| Priority | Finding                                                                            | Change                                                                                                                        |
| -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Medium   | Media assignments and environment notes shared one subdued paragraph.              | Give the assignment a primary text paragraph and keep format/environment in secondary text.                                   |
| Medium   | Main navigation shrank to 10.4px at compact widths and wrapped unevenly.           | Use 12px labels, a three-column compact grid and targets at least 54px high; desktop navigation stays visible when scrolling. |
| Medium   | Repeated, slightly different colors in shell and reader obscured consistent roles. | Share named color/spacing tokens. Inputs, article and canvas keep distinct surfaces.                                          |
| Medium   | A fixed header height could constrain enlarged text.                               | Use a minimum height and wrapping rather than a fixed row height; respect browser default font size.                          |
| Low      | The reader mixed Unicode arrows with the existing SVG icon set.                    | Reuse authored SVG icons with one stroke and explicit accessible text; distinguish code practice from reading in navigation.  |
| Low      | Chapter position appeared as an isolated heading accessory.                        | Place it in a course-navigation toolbar next to the return action.                                                            |
| Low      | Global list margins produced extra, inconsistent chapter-row spacing.              | Give chapter lists their own zero-margin rows and retain content-driven heights.                                              |

## Accessibility measurements

Contrast computed from sRGB hex values, using WCAG luminance:

| Foreground / surface                 |   Ratio |
| ------------------------------------ | ------: |
| Primary `#252b27` / canvas `#e9e7e2` | 11.69:1 |
| Secondary `#545c56` / canvas         |  5.59:1 |
| Metadata `#626a63` / canvas          |  4.52:1 |
| Secondary / article `#faf9f4`        |  6.55:1 |
| Focus `#356448` / article            |  6.49:1 |
| Input outline `#7a827b` / article    |  3.75:1 |

Status remains textual and checkbox-based. Notes have visible labels, a distinct input surface and a shared character limit with backup validation. Chapter navigation focuses the newly requested heading. Inputs, select controls and links have keyboard focus indicators. Forced colors use semantic tokens; no motion is necessary. External videos load only after an explicit click.

Browser checks covered the 1280px desktop view, a 390px compact view, and 768px with text enlarged to 200%. No page-level horizontal overflow was observed. The desktop rail uses `6rem` (96px at the default text size), so it widens with enlarged text rather than forcing navigation words into a fixed 96px strip. Labels were checked including their associated HTML labels. Forced-color token behavior was reviewed in source; no claim of a full screen-reader or operating-system contrast-mode audit is made.

## References read

- `accessibility.md › Vision`: “Support larger text sizes.” Translated to browser font settings and enlarged-text checks.
- `layout.md › Visual hierarchy`: “Group related items to clearly express related information or functions.” Applied to the media assignment and its metadata.
- `layout.md › Adaptability`: “Be prepared for text-size changes.” Applied to flexible headers and content-driven rows.
- `typography.md › Conveying hierarchy`: “Minimize the number of typefaces you use”. Retain the existing serif/body pairing rather than introduce a third face.
- `color.md › Inclusive color`: “Avoid relying solely on color”. Preserve text-based status.
- `buttons.md › Content`: “Ensure that each button clearly communicates its purpose.” Keep named navigation and exercise actions.
- `sidebars.md › Best practices`: “In general, show no more than two levels of hierarchy in a sidebar.” Retain one chapter level and separate in-chapter anchors.
- `entering-data.md › Best practices`: “Be clear about the data you need.” Preserve visible note labels and describe their purpose.
- `focus-and-selection.md › Best practices`: “Avoid changing focus without people’s interaction.” Focus moves in response to chapter/navigation actions.
- Also read `designing-for-macos.md` and `cross-platform.md` to separate applicable desktop-input principles from native-only conventions.

The studio judgments are restraint, rhythm and retaining the requested serif/italic course identity despite generic anti-pattern heuristics. The product is a reader, so chart imagery belongs in real exercise output rather than decorative chrome.

Method: Impeccable polish and craft-floor; Apple Design foundations; Unslop's layered spacing/color/icons/copy/type/layout/details/visuals/motion pass. Unslop by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0. No story video or generated image was requested or created.
