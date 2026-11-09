# Application structure

Matchplan runs locally in the browser. It has no separate HTTP backend or account database. Its application logic consists of progress validation and storage, project assessment/export, and the Python worker. This refactor separates those responsibilities while retaining the existing entry points.

| Responsibility              | Location                                                                  | Owns                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Navigation and composition  | `src/App.tsx`                                                             | Current view, lesson/project selection, connecting view actions                                            |
| Reading and editing         | `src/ui/`                                                                 | Course reader, task workspace, editor and accessible controls                                              |
| Progress defaults/selectors | `src/learning/progress-model.ts`                                          | Initial progress and lesson status; no browser access                                                      |
| Backup contract             | `src/learning/progress-codec.ts`                                          | Parsing unknown JSON, field limits, normalization, serialization                                           |
| Browser persistence         | `src/learning/progress-storage.ts`                                        | LocalStorage, corrupt-data preservation and explicit replacement                                           |
| React persistence lifecycle | `src/learning/useLearningProgress.ts`                                     | State synchronization, save errors, import/recovery application                                            |
| React execution lifecycle   | `src/learning/useCodeExecution.ts`                                        | Busy/result/error state, cancellation and stale-response protection                                        |
| Worker transport            | `src/runtime.ts`, `src/runtime-protocol.ts`                               | Typed messages, one pending task, warm reuse, timeouts, worker generations                                 |
| Python host and evaluation  | `src/python.worker.ts`, `src/python-evaluator.ts`                         | Local package loading, fresh evaluation namespaces, checks and figures                                     |
| Project catalog             | `src/projects/catalog.ts`                                                 | Prerequisites, milestones and practice files                                                               |
| Project assessment          | `src/projects/assessment.ts`                                              | Lesson/check composition and existing content corrections                                                  |
| Project completion          | `src/projects/completion.ts`                                              | Report/checklist/code completion rules                                                                     |
| Project delivery            | `src/projects/archive.ts`, `src/projects/readme.ts`                       | ZIPs, notebooks, scripts and project README generation                                                     |
| Curriculum and sources      | `src/course/`, `src/course-study.ts`, `src/project-definitions.ts`        | Learning content and fixtures                                                                              |
| Research-derived teaching   | `src/course/reference-foundations.ts`, `src/course/reference-sport-ai.ts` | Original explanations, reference examples and repository provenance, composed into existing study chapters |
| Chapter workbooks           | `src/learning/study-workbook.ts`                                          | Offline teaching text, examples, assignments and notes as ZIP; independent of code assessment              |
| Shared appearance           | `src/styles/tokens.css`                                                   | Named surfaces, text roles, focus/control colors and spacing                                               |

`src/progress.ts` and `src/projects.ts` remain stable public entry points. The implementation modules do not import their own entry point, avoiding circular imports. The progress codec and selectors have no React or DOM dependency. Browser access stays in storage; React effects stay in hooks. Worker messages share a compile-time contract between producer and consumer.

## Invariants

- Backups retain version 1 and the storage key `matchplan-academy-v1`; old backups remain readable.
- Imports and writes use the same codec. Invalid saved data is retained until an explicit recovery choice.
- Study marks never imply passed code. Editing project code invalidates its pass/review as before.
- Cancellation terminates a pending worker. Messages **and error events** from an old worker cannot affect a later attempt.
- Progress does not depend on archive generation. Archive code consumes progress and project completion.
- Export contents and assessment requirements are unchanged by the project split. Existing string-based content corrections remain localized in catalog/assessment rather than spread across the UI; replacing those with directly maintained source definitions is a separate content migration.

## Verification

Existing public tests cover execution/abort/errors, backup round-trips and recovery, project archives, curriculum solutions and the complete learning flow. A regression reproduces a late worker error cancelling a newer run and verifies its fix. No new test-only facade or server was introduced.
