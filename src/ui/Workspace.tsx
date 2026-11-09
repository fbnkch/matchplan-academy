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
  current,
  busy,
  result,
  error,
  heading,
  update,
  execute,
  cancel,
  select,
  lessons,
  next,
  project,
  projectProgress,
  updateProject,
}: Props) {
  const [reset, setReset] = useState(false);
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
              {project.brief.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </>
          ) : (
            <>
              {lesson.explanation.slice(0, 1).map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </>
          )}
          <section className="task" aria-labelledby="task-heading">
            <h3 id="task-heading">Aufgaben</h3>
            <ol className="task-steps">
              <li>{lesson.task}</li>
            </ol>
            <section className="help-section">
              {lesson.hints.slice(0, current.hintLevel).map((hint, i) => (
                <div className="hint" key={i}>
                  <strong>Hinweis {i + 1}</strong>
                  <p>{hint}</p>
                </div>
              ))}
              <div className="actions">
                <button
                  disabled={current.hintLevel >= lesson.hints.length || busy}
                  onClick={() => update({ hintLevel: current.hintLevel + 1 })}
                >
                  Nächsten Hinweis zeigen
                </button>
                <button
                  className="text-button"
                  disabled={busy || current.solutionViewed}
                  onClick={() => update({ solutionViewed: true })}
                >
                  Musterlösung aufdecken
                </button>
              </div>
              {current.solutionViewed && (
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
                    {lesson.explanation.slice(1).map((text, i) => (
                      <p key={i}>{text}</p>
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
                  <button className="text-button" key={id} onClick={() => select(id)}>
                    {lessons.find((l) => l.id === id)?.title ?? id}
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
                  {lesson.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.title} ↗
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
        {project && projectProgress && updateProject && (
          <section className="milestones">
            <h3>Meilensteine & Ergebnisse</h3>
            {project.milestones.map((m) => (
              <div className="milestone" key={m.id}>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={projectProgress.milestones.includes(m.id)}
                    onChange={(e) =>
                      updateProject({
                        milestones: e.target.checked
                          ? [...projectProgress.milestones, m.id]
                          : projectProgress.milestones.filter((id) => id !== m.id),
                        reviewed: false,
                      })
                    }
                  />
                  <strong>{m.title}</strong>
                </label>
                <p>{m.description}</p>
                <p>
                  <strong>Abgabe:</strong> {m.deliverable}
                </p>
                <ul>
                  {m.criteria.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h3>Grenzen dieser Analyse</h3>
            <ul>
              {project.limitations.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <details>
              <summary>Projektdateien ansehen ({project.files.length})</summary>
              {project.files.map((f) => (
                <details key={f.name}>
                  <summary>{f.name}</summary>
                  <pre>{f.content}</pre>
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
            <span className="editor-mode">{busy ? 'Wird geprüft' : 'Bearbeiten'}</span>
            <button disabled={busy} onClick={() => setReset(true)}>
              Code neu starten
            </button>
          </div>
          {reset && (
            <div className="reset-confirm" role="group" aria-label="Code zurücksetzen bestätigen">
              <p>
                Deinen Code durch den Startcode ersetzen? Deine bisherige Lösung wird überschrieben.
              </p>
              <div className="actions">
                <button
                  onClick={() => {
                    update({ code: lesson.starter, passed: false });
                    setReset(false);
                  }}
                >
                  Startcode wiederherstellen
                </button>
                <button onClick={() => setReset(false)}>Code behalten</button>
              </div>
            </div>
          )}
          <CodeEditor
            value={current.code}
            language={language}
            disabled={busy}
            onChange={(code) => update({ code, passed: false })}
          />
          <div className="editor-actions">
            <button className="primary" disabled={busy} onClick={execute}>
              {busy
                ? `${language === 'sql' ? 'SQL' : 'Python'} lädt / prüft …`
                : 'Ausführen & prüfen'}
            </button>
            {busy && <button onClick={cancel}>Abbrechen</button>}
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
          aria-busy={busy}
        >
          <div className="pane-toolbar">
            <h3>Ausgabe & Prüfungen</h3>
          </div>
          {busy ? (
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
                {result.checks.map((check, i) => (
                  <li key={i}>
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
              {result.figures?.map((figure, i) => (
                <figure key={i}>
                  <img
                    src={`data:image/svg+xml;base64,${figure}`}
                    alt={`Analyse-Grafik ${i + 1} zum Auftrag ${lesson.title}`}
                  />
                  <figcaption>
                    <a
                      href={`data:image/svg+xml;base64,${figure}`}
                      download={`matchplan-${lesson.id}-${i + 1}.svg`}
                    >
                      Grafik {i + 1} herunterladen (SVG)
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
          {current.passed && (
            <div className="pass-panel">
              <h3>
                {current.hintLevel > 0 || current.solutionViewed
                  ? 'Mit Hilfe geübt'
                  : 'Selbstständig gelöst'}
              </h3>
              <p>
                Dein Code besteht die vorbereiteten Prüfungen. Beschreibe jetzt, was das Ergebnis
                bedeutet. Prüfe später an neuen Eingaben, ob du den Ansatz ohne Vorlage wieder
                anwenden kannst.
              </p>
              {next ? (
                <button className="primary" onClick={() => select(next.id)}>
                  Nächste Lektion: {next.title} →
                </button>
              ) : (
                <p>Auftrag bearbeitet. Prüfe deinen Befund und seine Grenzen.</p>
              )}
            </div>
          )}
        </section>
        {project && projectProgress && updateProject ? (
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
              onChange={(e) => updateProject({ report: e.target.value, reviewed: false })}
            />
            <label htmlFor="project-notes">Arbeitsnotizen</label>
            <textarea
              id="project-notes"
              maxLength={50000}
              value={projectProgress.notes}
              onChange={(e) => updateProject({ notes: e.target.value })}
            />
            <h3>Eigene Qualitätsprüfung</h3>
            <ul>
              {project.rubric.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <label className="check-label">
              <input
                type="checkbox"
                checked={projectProgress.reviewed}
                onChange={(e) => updateProject({ reviewed: e.target.checked })}
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
            <details key={lesson.id} open={current.passed}>
              <summary>Reflexion & Selbstprüfung</summary>
              <h3>Vom Code zum Befund</h3>
              <p>{lesson.reflection}</p>
              <label htmlFor="reflection">Deine Reflexion</label>
              <textarea
                id="reflection"
                maxLength={50000}
                value={current.reflection}
                placeholder="Mein Befund … Eine Grenze dieser Auswertung …"
                onChange={(e) => update({ reflection: e.target.value })}
              />
              <h3>Selbstprüfung</h3>
              <ul>
                {lesson.rubric.map((c, i) => (
                  <li key={i}>{c}</li>
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
