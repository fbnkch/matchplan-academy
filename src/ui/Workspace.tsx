import { useState, type Ref } from 'react';
import type {
  Lesson,
  LessonProgress,
  RunResult,
  ProjectDefinition,
  ProjectProgress,
} from '../types';
import { CodeEditor } from './CodeEditor';

interface Props {
  lesson: Lesson;
  current: LessonProgress;
  busy: boolean;
  result: RunResult | null;
  error: string;
  heading: Ref<HTMLHeadingElement>;
  update: (patch: Partial<LessonProgress>) => void;
  execute: () => void;
  cancel: () => void;
  select: (id: string) => void;
  lessons: Lesson[];
  next?: Lesson;
  project?: ProjectDefinition;
  projectProgress?: ProjectProgress;
  updateProject?: (patch: Partial<ProjectProgress>) => void;
}
export function Workspace({
  lesson,
  current: currentLessonProgress,
  busy: isCodeRunning,
  result,
  error,
  heading,
  update: updateLessonProgress,
  execute: executeCode,
  cancel: cancelExecution,
  select: selectLesson,
  lessons,
  next: nextLesson,
  project,
  projectProgress,
  updateProject: updateProjectProgress,
}: Props) {
  const [isResetConfirmationVisible, setResetConfirmationVisible] = useState(false);
  const language = lesson.language === 'sql' ? 'sql' : 'python';
  return (
    <div className="workbench">
      <div className="instruction-pane">
        <article className="lesson-content">
          <div className="exercise-bar">
            <span>Übung</span>
            <span>
              {lesson.level ? `${lesson.level} · ` : ''}
              {language.toUpperCase()} · {lesson.minutes} Min
            </span>
            {lesson.transfer && <span>Transferaufgabe</span>}
          </div>
          <h2 tabIndex={-1} ref={heading}>
            {project?.title ?? lesson.title}
          </h2>
          {project ? (
            <>
              <p className="concept">{project.question}</p>
              {project.brief.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </>
          ) : (
            <>
              {lesson.explanation.slice(0, 1).map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </>
          )}
          <section className="task" aria-labelledby="task-heading">
            <h3 id="task-heading">Aufgaben</h3>
            <ol className="task-steps">
              <li>{lesson.task}</li>
            </ol>
            <section className="help-section">
              {lesson.hints.slice(0, currentLessonProgress.hintLevel).map((hint, index) => (
                <div className="hint" key={index}>
                  <strong>Hinweis {index + 1}</strong>
                  <p>{hint}</p>
                </div>
              ))}
              <div className="actions">
                <button
                  disabled={currentLessonProgress.hintLevel >= lesson.hints.length || isCodeRunning}
                  onClick={() =>
                    updateLessonProgress({ hintLevel: currentLessonProgress.hintLevel + 1 })
                  }
                >
                  Nächsten Hinweis zeigen
                </button>
                <button
                  className="text-button"
                  disabled={isCodeRunning || currentLessonProgress.solutionViewed}
                  onClick={() => updateLessonProgress({ solutionViewed: true })}
                >
                  Musterlösung aufdecken
                </button>
              </div>
              {currentLessonProgress.solutionViewed && (
                <div className="solution">
                  <p>
                    Vergleiche die Musterlösung mit deinem Ansatz. Bearbeite danach eine neue
                    Transferaufgabe ohne Vorlage.
                  </p>
                  <pre>
                    <code>{lesson.solution}</code>
                  </pre>
                </div>
              )}
            </section>
          </section>
          <details className="reference-material" key={lesson.id}>
            <summary>Nachschlagen</summary>
            {!project && (
              <>
                {(lesson.explanation.length > 1 || lesson.objective) && (
                  <details key={lesson.id}>
                    <summary>Hintergrund & Lernziel</summary>
                    {lesson.explanation.slice(1).map((text, index) => (
                      <p key={index}>{text}</p>
                    ))}
                    {lesson.objective && (
                      <p>
                        <strong>Lernziel:</strong> {lesson.objective}
                      </p>
                    )}
                  </details>
                )}
              </>
            )}
            {!!(project?.prerequisites ?? lesson.prerequisites)?.length && (
              <div className="prerequisites">
                <h3>Grundlagen nachschlagen</h3>
                {(project?.prerequisites ?? lesson.prerequisites ?? []).map((id) => (
                  <button className="text-button" key={id} onClick={() => selectLesson(id)}>
                    {lessons.find((prerequisiteLesson) => prerequisiteLesson.id === id)?.title ??
                      id}
                  </button>
                ))}
              </div>
            )}
            <details className="example">
              <summary>Beispiel lesen</summary>
              <pre>
                <code>{lesson.example}</code>
              </pre>
              {'exampleNote' in lesson && typeof lesson.exampleNote === 'string' && (
                <p className="muted">{lesson.exampleNote}</p>
              )}
            </details>
            {!!lesson.sources?.length && (
              <details>
                <summary>Offiziell nachlesen</summary>
                <ul>
                  {lesson.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </details>
          {lesson.setup && (
            <section aria-label="Geladene Übungsdaten">
              <details key={lesson.id}>
                <summary>Geladene Übungsdaten</summary>
                <p>
                  {lesson.level === 'Praxis' ? 'Diese Daten' : 'Diese fiktiven Daten'} stehen deinem
                  Code bereits zur Verfügung. Du kannst die Variablennamen direkt in deiner Lösung
                  verwenden.
                </p>
                <pre>
                  <code>{lesson.dataPreview ?? lesson.setup}</code>
                </pre>
              </details>
            </section>
          )}
        </article>
        {project && projectProgress && updateProjectProgress && (
          <section className="milestones">
            <h3>Meilensteine & Ergebnisse</h3>
            {project.milestones.map((milestone) => (
              <div className="milestone" key={milestone.id}>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={projectProgress.milestones.includes(milestone.id)}
                    onChange={(event) =>
                      updateProjectProgress({
                        milestones: event.target.checked
                          ? [...projectProgress.milestones, milestone.id]
                          : projectProgress.milestones.filter((id) => id !== milestone.id),
                        reviewed: false,
                      })
                    }
                  />
                  <strong>{milestone.title}</strong>
                </label>
                <p>{milestone.description}</p>
                <p>
                  <strong>Abgabe:</strong> {milestone.deliverable}
                </p>
                <ul>
                  {milestone.criteria.map((criterion) => (
                    <li key={criterion}>{criterion}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h3>Grenzen dieser Analyse</h3>
            <ul>
              {project.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
            <details>
              <summary>Projektdateien ansehen ({project.files.length})</summary>
              {project.files.map((projectFile) => (
                <details key={projectFile.name}>
                  <summary>{projectFile.name}</summary>
                  <pre>{projectFile.content}</pre>
                </details>
              ))}
            </details>
          </section>
        )}
      </div>
      <div className="analysis-pane">
        <section className="editor-section" aria-label="Code bearbeiten">
          <div className="pane-toolbar">
            <strong>{language === 'sql' ? 'analyse.sql' : 'analyse.py'}</strong>
            <span className="editor-mode">{isCodeRunning ? 'Wird geprüft' : 'Bearbeiten'}</span>
            <button disabled={isCodeRunning} onClick={() => setResetConfirmationVisible(true)}>
              Code neu starten
            </button>
          </div>
          {isResetConfirmationVisible && (
            <div className="reset-confirm" role="group" aria-label="Code zurücksetzen bestätigen">
              <p>
                Deinen Code durch den Startcode ersetzen? Deine bisherige Lösung wird überschrieben.
              </p>
              <div className="actions">
                <button
                  onClick={() => {
                    updateLessonProgress({ code: lesson.starter, passed: false });
                    setResetConfirmationVisible(false);
                  }}
                >
                  Startcode wiederherstellen
                </button>
                <button onClick={() => setResetConfirmationVisible(false)}>Code behalten</button>
              </div>
            </div>
          )}
          <CodeEditor
            value={currentLessonProgress.code}
            language={language}
            disabled={isCodeRunning}
            onChange={(code) => updateLessonProgress({ code, passed: false })}
          />
          <div className="editor-actions">
            <button className="primary" disabled={isCodeRunning} onClick={executeCode}>
              {isCodeRunning
                ? `${language === 'sql' ? 'SQL' : 'Python'} lädt / prüft …`
                : 'Ausführen & prüfen'}
            </button>
            {isCodeRunning && <button onClick={cancelExecution}>Abbrechen</button>}
          </div>
          <details className="keyboard-note">
            <summary>Tastaturbedienung</summary>
            <p id="editor-keyboard">
              Mit Tab wechselst du zum nächsten Bedienelement. Rücke Code mit Leerzeichen ein.
              Strg/Cmd + Z macht die letzte Änderung rückgängig.
            </p>
          </details>
        </section>
        <section
          className="output-section"
          role="region"
          aria-label="Ausgabe und Prüfungen"
          aria-live="polite"
          aria-busy={isCodeRunning}
        >
          <div className="pane-toolbar">
            <h3>Ausgabe & Prüfungen</h3>
          </div>
          {isCodeRunning ? (
            <p>
              Die Anwendung lädt bei Bedarf {language === 'sql' ? 'SQL' : 'Python'} und die
              benötigten Pakete. Anschließend führt sie deinen Code aus und prüft ihn mit mehreren
              Eingaben.
            </p>
          ) : error ? (
            <p role="alert" className="error">
              {error}
            </p>
          ) : result ? (
            <>
              <pre className="terminal">{result.output || 'Keine Textausgabe.'}</pre>
              {result.error && (
                <p role="alert" className="error">
                  {result.error}
                </p>
              )}
              <ul className="checks">
                {result.checks.map((check, index) => (
                  <li key={index}>
                    <strong>
                      {check.passed ? '✓ Bestanden' : '× Noch nicht bestanden'}: {check.label}
                    </strong>
                    {!check.passed && (
                      <small>
                        Erwartet: {check.expected} · Erhalten: {check.actual}
                      </small>
                    )}
                  </li>
                ))}
              </ul>
              {result.figures?.map((figure, index) => (
                <figure key={index}>
                  <img
                    src={`data:image/svg+xml;base64,${figure}`}
                    alt={`Analyse-Grafik ${index + 1} zum Auftrag ${lesson.title}`}
                  />
                  <figcaption>
                    <a
                      href={`data:image/svg+xml;base64,${figure}`}
                      download={`matchplan-${lesson.id}-${index + 1}.svg`}
                    >
                      Grafik {index + 1} herunterladen (SVG)
                    </a>
                  </figcaption>
                </figure>
              ))}
            </>
          ) : (
            <p className="muted">
              Führe deinen Code aus. Hier erscheinen Ausgabe, Grafiken und Rückmeldungen.
            </p>
          )}
          {currentLessonProgress.passed && (
            <div className="pass-panel">
              <h3>
                {currentLessonProgress.hintLevel > 0 || currentLessonProgress.solutionViewed
                  ? 'Mit Hilfe geübt'
                  : 'Selbstständig gelöst'}
              </h3>
              <p>
                Dein Code besteht die vorbereiteten Prüfungen. Beschreibe jetzt, was das Ergebnis
                bedeutet. Prüfe später an neuen Eingaben, ob du den Ansatz ohne Vorlage wieder
                anwenden kannst.
              </p>
              {nextLesson ? (
                <button className="primary" onClick={() => selectLesson(nextLesson.id)}>
                  Nächste Lektion: {nextLesson.title} →
                </button>
              ) : (
                <p>Auftrag bearbeitet. Prüfe deinen Befund und seine Grenzen.</p>
              )}
            </div>
          )}
        </section>
        {project && projectProgress && updateProjectProgress ? (
          <section className="report-section">
            <h3>Scouting-Bericht</h3>
            <p>
              Belege deine Entscheidung mit den Ergebnissen und erkläre, welche Fragen die Daten
              offenlassen. Die Anwendung speichert den Bericht lokal. Für den Projektabschluss
              brauchst du eine eigene Ausarbeitung mit mindestens 80 Zeichen, alle Meilensteine,
              bestandene Codeprüfungen und deine Selbstprüfung.
            </p>
            <label htmlFor="project-report">Dein Projektbericht</label>
            <textarea
              id="project-report"
              className="report-editor"
              maxLength={50000}
              value={projectProgress.report}
              onChange={(event) =>
                updateProjectProgress({ report: event.target.value, reviewed: false })
              }
            />
            <label htmlFor="project-notes">Arbeitsnotizen</label>
            <textarea
              id="project-notes"
              maxLength={50000}
              value={projectProgress.notes}
              onChange={(event) => updateProjectProgress({ notes: event.target.value })}
            />
            <h3>Eigene Qualitätsprüfung</h3>
            <ul>
              {project.rubric.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
            <label className="check-label">
              <input
                type="checkbox"
                checked={projectProgress.reviewed}
                onChange={(event) => updateProjectProgress({ reviewed: event.target.checked })}
              />
              Ich habe meinen Bericht anhand der Kriterien selbst geprüft.
            </label>
            <p className="muted">
              Du bestätigst damit deine eigene Prüfung. Für fachliche Rückmeldung gibst du den
              Bericht einer anderen Person zur Begutachtung.
            </p>
          </section>
        ) : (
          <section className="reflection-section">
            <details key={lesson.id} open={currentLessonProgress.passed}>
              <summary>Reflexion & Selbstprüfung</summary>
              <h3>Vom Code zum Befund</h3>
              <p>{lesson.reflection}</p>
              <label htmlFor="reflection">Deine Reflexion</label>
              <textarea
                id="reflection"
                maxLength={50000}
                value={currentLessonProgress.reflection}
                placeholder="Mein Befund … Eine Grenze dieser Auswertung …"
                onChange={(event) => updateLessonProgress({ reflection: event.target.value })}
              />
              <h3>Selbstprüfung</h3>
              <ul>
                {lesson.rubric.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
              <p className="muted">
                Die Anwendung speichert deinen Text. Prüfe ihn selbst anhand der Kriterien; die
                Codeprüfung bewertet die Reflexion nicht.
              </p>
            </details>
          </section>
        )}
      </div>
    </div>
  );
}
