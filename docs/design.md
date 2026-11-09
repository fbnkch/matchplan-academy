# Matchplan visual system

The current direction follows the user's 8 November 2026 request to use Insideout's classical-ML course as the reference. It supersedes the earlier terminal and DataCamp directions. The learning model now starts with theory, source material and extending existing codebases; executable exercises remain available for targeted practice.

## Reference and implementation

- Warm gray canvas (#e9e7e2), cream reading surfaces (#fcfbf8 / #faf9f4), dark ink (#252b27) and dark primary controls.
- A narrow 96px navigation rail, numbered chapter index and fine dividers instead of a statistics dashboard.
- Serif headings (Georgia), local DM Sans for body and controls, monospace for code. The font license remains in public/fonts/.
- A sticky chapter outline and article text constrained to approximately 65 characters per line.
- No copied branding, source prose or imagery from the reference.

Studium is the default entry. Every chapter follows the same order: foundations, selected media, a codebase extension with acceptance criteria, reflection and notes. Optional buttons lead to existing exercises or project workspaces with readable titles rather than internal IDs. Existing course search, cards, code editor and project exports remain accessible through the navigation.

## Behavior and accessibility

Buttons retain visible focus and descriptive names. Chapter changes focus the article heading. Status uses text and checkboxes. Narrow layouts stack and offer a compact chapter selector instead of the full sidebar. Forced colors are supported and the reader requires no motion. Editable notes have a distinct light surface and visible labels.

Study marks are self-reported and never count as passed code checks. Notes and study marks use the existing local backup and recovery mechanism. YouTube embeds load only after an explicit click. External codebases and PDFs stay with their publishers.

## Verification

Integration checks cover navigation, notes, study marks, opt-in video embeds, exercise/project callbacks, persistence across remount and all chapter targets. Runtime and grading behavior are preserved. Test counts are recorded in the delivery rather than hard-coded here. Desktop and narrow-layout browser checks are part of the final integration pass.

## Refinement and implementation structure

The shared palette and spacing roles live in `src/styles/tokens.css`; the reader consumes those roles instead of maintaining another palette. Navigation uses at least 12px labels, a compact three-column layout on small screens and SVG icons from one set. Assignment text is primary content, while media format and environment are secondary. Header rows grow with enlarged text.

`design-review.md` records the Impeccable, Unslop and Apple Design review, source headings and measured contrast. The requested serif/italic identity is retained as an intentional reference choice. `architecture.md` maps progress, assessment, archive and execution responsibilities. No animation or image was added solely as decoration.
