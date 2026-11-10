import { useEffect, useRef, useState } from 'react';
import { exportKickbaseStarter, kickbaseSteps, previewPlayers } from '../kickbase/course';
import { PROGRESS_LIMITS } from '../learning/progress-codec';
import { PointsPerMillion } from './PointsPerMillion';
import './ProjectJourney.css';

export interface ProjectJourneyProps {
  completed: string[];
  notes: Record<string, string>;
  onComplete: (id: string, complete: boolean) => void;
  onNote: (id: string, text: string) => void;
  onPractice: (id: string) => void;
  onRead: (chapterId: string) => void;
}

const number = (value: number) =>
  value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function ProjectJourney({
  completed,
  notes,
  onComplete,
  onNote,
  onPractice,
  onRead,
}: ProjectJourneyProps) {
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      kickbaseSteps.findIndex((step) => !completed.includes(step.id)),
    ),
  );
  const [hint, setHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);
  const copyRequest = useRef(0);
  const step = kickbaseSteps[active];
  const isComplete = completed.includes(step.id);
  const completeCount = kickbaseSteps.filter((item) => completed.includes(item.id)).length;
  const maxEfficiency = Math.max(
    ...previewPlayers.map((player) => player.points / (player.marketValue / 1_000_000)),
  );

  useEffect(() => {
    if (shouldFocus.current) heading.current?.focus();
  }, [active]);

  function selectStep(index: number) {
    shouldFocus.current = true;
    copyRequest.current += 1;
    setHint(false);
    setFeedback('');
    setError('');
    setActive(index);
    if (index === active) heading.current?.focus();
  }

  async function copyCommand() {
    const request = ++copyRequest.current;
    setError('');
    setFeedback('');
    try {
      await navigator.clipboard.writeText(step.command);
      if (request === copyRequest.current) setFeedback('Befehl kopiert');
    } catch {
      if (request === copyRequest.current)
        setError('Kopieren nicht möglich. Markiere den Befehl und kopiere ihn mit Strg+C oder ⌘C.');
    }
  }

  function downloadStarter() {
    setDownloadError('');
    let url: string | undefined;
    let anchor: HTMLAnchorElement | undefined;
    try {
      const starter = exportKickbaseStarter();
      const bytes = new Uint8Array(starter.data.length);
      bytes.set(starter.data);
      url = URL.createObjectURL(new Blob([bytes], { type: 'application/zip' }));
      anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = starter.name;
      document.body.append(anchor);
      anchor.click();
    } catch {
      setDownloadError('Der Download konnte nicht gestartet werden. Bitte versuche es erneut.');
    } finally {
      anchor?.remove();
      if (url) {
        const objectUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
    }
  }

  return (
    <div className="project-journey">
      <header className="journey-intro">
        <div>
          <h1>Fußballdaten auswerten lernen</h1>
          <p>
            Öffne das Beispiel in deiner IDE und finde heraus, wie die Auswertung entsteht. Danach
            baust du sie um. Was du dafür wissen musst, steht bei der jeweiligen Aufgabe.
          </p>
        </div>
        <div className="journey-starter">
          <button type="button" onClick={downloadStarter}>
            Starterprojekt herunterladen
          </button>
          <span>Python-Projekt als ZIP für deine IDE</span>
          {downloadError && <p role="alert">{downloadError}</p>}
        </div>
      </header>

      <section className="journey-preview" aria-labelledby="preview-title">
        <div className="journey-preview-heading">
          <h2 id="preview-title">Praxisprojekt: Kickbase-Auswertung</h2>
          <p>Wer liefert mehr Punkte je Million Marktwert?</p>
        </div>
        <PointsPerMillion players={previewPlayers} />
        <div
          className="journey-table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Spielerdaten, horizontal scrollbar"
        >
          <table aria-label="Beispielauswertung: Kickbase">
            <thead>
              <tr>
                <th scope="col">Spieler</th>
                <th scope="col">Position</th>
                <th scope="col">Ø Punkte / Einsatz</th>
                <th scope="col">Marktwert · Mio. €</th>
                <th scope="col">Punkte / Mio. €</th>
              </tr>
            </thead>
            <tbody>
              {previewPlayers.map((player) => {
                const efficiency = player.points / (player.marketValue / 1_000_000);
                return (
                  <tr key={player.name}>
                    <th scope="row">{player.name}</th>
                    <td>{player.role}</td>
                    <td>{number(player.points)}</td>
                    <td>{number(player.marketValue / 1_000_000)}</td>
                    <td>
                      <span className="journey-efficiency">
                        <span>{number(efficiency)}</span>
                        <span className="journey-bar" aria-hidden="true">
                          <span style={{ width: `${(efficiency / maxEfficiency) * 100}%` }} />
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="journey-data-note">Fiktive Übungsdaten · kein Live-Zugriff</p>
      </section>

      <div className="journey-workspace">
        <nav className="journey-index" aria-label="Projektablauf">
          <h2>Projektablauf</h2>
          <p>
            {completeCount} von {kickbaseSteps.length} Schritten selbst geprüft
          </p>
          <ol>
            {kickbaseSteps.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={index === active ? 'step' : undefined}
                  aria-label={`Schritt ${index + 1}: ${item.title}`}
                  onClick={() => selectStep(index)}
                >
                  <span className="journey-step-number">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="journey-step-title">{item.title}</span>
                    <span className="journey-step-file">{item.folder}</span>
                    {completed.includes(item.id) && (
                      <span className="journey-step-done">Selbst geprüft</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="journey-index-note">
            Alle Schritte sind frei zugänglich. Setze das Häkchen, wenn du die Aufgabe im Editor
            geprüft hast.
          </p>
        </nav>

        <article className="journey-task" aria-labelledby="journey-task-title">
          <header>
            <div className="journey-task-heading">
              <h2 id="journey-task-title" ref={heading} tabIndex={-1}>
                {step.title}
              </h2>
              <p className="journey-task-position">
                Schritt {active + 1} von {kickbaseSteps.length}
              </p>
            </div>
            <p className="journey-question">{step.question}</p>
            <p className="journey-result">
              <span>Ergebnis</span>
              {step.result}
            </p>
          </header>

          <section className="journey-assignment" aria-labelledby="assignment-title">
            <h3 id="assignment-title">Aufgabe</h3>
            <ol>
              {step.assignment.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ol>
          </section>
          <section className="journey-editor" aria-labelledby="editor-title">
            <h3 id="editor-title">Im Editor</h3>
            <p>
              Datei oder Ordner <code>{step.folder}</code>
            </p>
            <div className="journey-command">
              <code>{step.command}</code>
              <button type="button" onClick={copyCommand}>
                Befehl kopieren
              </button>
            </div>
            <p className="journey-feedback" role="status">
              {feedback}
            </p>
            {error && <p role="alert">{error}</p>}
          </section>

          <div className="journey-support" key={step.id}>
            <details>
              <summary>Das brauchst du dafür</summary>
              <div className="journey-concepts">
                {step.concepts.map((concept) => (
                  <div key={concept.title}>
                    <h4>{concept.title}</h4>
                    <p>{concept.text}</p>
                  </div>
                ))}
              </div>
            </details>
            <div className="journey-hint">
              <button type="button" aria-expanded={hint} onClick={() => setHint(!hint)}>
                {hint ? 'Hinweis ausblenden' : 'Hinweis anzeigen'}
              </button>
              {hint && (
                <div>
                  <p>{step.hint}</p>
                  <details>
                    <summary>Wo liegt die Musterlösung?</summary>
                    <p>
                      Die Referenzen liegen in <code>solutions/metrics.py</code> und{' '}
                      <code>pipeline.py</code>. Die <code>README.md</code> erklärt die Zuordnung.
                      Vergleiche erst nach deinem eigenen Versuch.
                    </p>
                  </details>
                </div>
              )}
            </div>
          </div>

          <section className="journey-checks" aria-labelledby="checks-title">
            <h3 id="checks-title">Prüfe dein Ergebnis</h3>
            <ul>
              {step.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
            <label className="journey-complete">
              <input
                type="checkbox"
                checked={isComplete}
                onChange={(event) => onComplete(step.id, event.target.checked)}
              />
              Selbst geprüft
            </label>
            <p>
              Hier hältst du fest, was du selbst getestet hast. Die Website prüft deinen IDE-Code
              nicht automatisch.
            </p>
          </section>
          <label className="journey-notes">
            Deine Arbeitsnotizen
            <textarea
              value={notes[step.id] ?? ''}
              maxLength={PROGRESS_LIMITS.studyNotes}
              onChange={(event) =>
                onNote(step.id, event.target.value.slice(0, PROGRESS_LIMITS.studyNotes))
              }
              placeholder="Was hat funktioniert? Welche Frage bleibt offen?"
              rows={3}
            />
          </label>

          <details
            className="journey-transfer"
            key={`${step.id}-transfer`}
            open={isComplete || undefined}
          >
            <summary>Das Gelernte noch einmal anwenden</summary>
            <h4>Mit anderen Daten ausprobieren</h4>
            <p>{step.variant}</p>
            <h4>Ohne nachzusehen</h4>
            <p>{step.recall}</p>
          </details>
          <footer className="journey-task-footer">
            <div className="journey-related">
              <button type="button" onClick={() => onRead(step.studyChapterId)}>
                Passende Theorie lesen
              </button>
              {step.practiceIds.map((id, index) => (
                <button type="button" key={id} onClick={() => onPractice(id)}>
                  Optional: Browserübung{step.practiceIds.length > 1 ? ` ${index + 1}` : ''}
                </button>
              ))}
            </div>
            {active < kickbaseSteps.length - 1 ? (
              <button className="journey-next" type="button" onClick={() => selectStep(active + 1)}>
                Nächster Schritt
              </button>
            ) : (
              <p className="journey-finish">
                {completeCount === kickbaseSteps.length
                  ? 'Du hast alle sechs Schritte geprüft. Wähle jetzt eine eigene Spielerfrage und halte fest, welche Daten du dafür brauchst.'
                  : 'Einige Schritte sind noch offen. Du kannst sie links im Projektablauf wieder öffnen.'}
              </p>
            )}
          </footer>
        </article>
      </div>
    </div>
  );
}

export default ProjectJourney;
