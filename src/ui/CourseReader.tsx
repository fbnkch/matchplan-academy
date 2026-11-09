import { useEffect, useRef, useState } from 'react';
import type { StudyChapter } from '../course-study';
import { InterfaceIcon } from './InterfaceIcon';
import { PROGRESS_LIMITS } from '../learning/progress-codec';
import { downloadStudyWorkbook } from '../learning/study-workbook';
import './CourseReader.css';

export interface CourseReaderProps {
  chapters: StudyChapter[];
  initialChapterId?: string;
  onPractice: (lessonId: string) => void;
  practiceLabels?: Record<string, string>;
  onProject: (projectId: string) => void;
  notes: Record<string, string>;
  onNote: (chapterId: string, text: string) => void;
  completed: string[];
  onComplete: (id: string, complete: boolean) => void;
}

function playlistEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const list = parsed.searchParams.get('list');
    if (
      (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be') &&
      list &&
      /^[\w-]+$/.test(list)
    ) {
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}`;
    }
  } catch {
    /* A resource without a playlist stays a normal link. */
  }
  return null;
}

function MediaResource({ media }: { media: StudyChapter['media'][number] }) {
  const [watch, setWatch] = useState(false);
  const embed = playlistEmbed(media.url);
  return (
    <li className="study-resource">
      <h3>
        <a href={media.url} target="_blank" rel="noopener noreferrer">
          {media.title}
          <span className="study-newtab"> (neuer Tab)</span>
        </a>
      </h3>
      <p className="study-resource-action">{media.action}</p>
      <p className="study-resource-meta">
        {[media.kind, media.environment].filter(Boolean).join(' · ')}
      </p>
      {embed && (
        <>
          {watch ? (
            <iframe
              className="study-video"
              src={embed}
              title={`YouTube-Playlist: ${media.title}`}
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="study-video-consent">
              <p>
                Die Playlist wird erst nach deinem Klick von YouTube geladen. Dabei wird eine
                Verbindung zu YouTube hergestellt.
              </p>
              <button className="study-button" type="button" onClick={() => setWatch(true)}>
                Video hier ansehen
              </button>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export function CourseReader({
  chapters,
  initialChapterId,
  onPractice,
  practiceLabels = {},
  onProject,
  notes,
  onNote,
  completed,
  onComplete,
}: CourseReaderProps) {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(initialChapterId ?? null);
  const [query, setQuery] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const index = chapters.findIndex((chapter) => chapter.id === selectedChapter);
  const chapter = chapters[index];
  const count = chapters.filter((item) => completed.includes(item.id)).length;
  const needle = query.trim().toLocaleLowerCase('de');
  const matchingChapters = chapters.filter(
    (item) =>
      !needle ||
      [
        item.title,
        item.lead,
        ...item.sections.flatMap((section) => [
          section.title,
          ...section.paragraphs,
          section.example?.code ?? '',
        ]),
      ]
        .join(' ')
        .toLocaleLowerCase('de')
        .includes(needle),
  );

  useEffect(() => {
    heading.current?.focus({ preventScroll: false });
    setDownloadError('');
  }, [selectedChapter]);

  if (!chapter)
    return (
      <div className="study-root">
        <header className="study-course-header">
          <div>
            <h1 ref={heading} tabIndex={-1}>
              Fußballdaten verstehen.
              <br />
              <em>Analysen selbst entwickeln.</em>
            </h1>
            <p className="study-intro">
              Jedes Kapitel erklärt eine Methode und zeigt, wann du sie brauchst. Bearbeite die
              verlinkten Tutorials und erweitere anschließend eine vorhandene Analyse mit eigenem
              Code.
            </p>
            {chapters[0] && (
              <button
                className="study-button study-primary"
                type="button"
                onClick={() => setSelectedChapter(chapters[0].id)}
              >
                Mit dem ersten Kapitel beginnen{' '}
                <InterfaceIcon name="arrowRight" className="study-inline-icon" />
              </button>
            )}
          </div>
          <div className="study-course-summary">
            <p>{chapters.length} Kapitel</p>
            <p>Theorie · Medien · Projektarbeit</p>
            <p>
              {count} von {chapters.length} selbst als studiert markiert
            </p>
          </div>
        </header>
        <section className="study-curriculum" aria-labelledby="study-curriculum-title">
          <div className="study-section-heading">
            <h2 id="study-curriculum-title">Der Lernpfad</h2>
            <p>Grundlagen und Aufgaben für deine Analysen</p>
          </div>
          <label className="study-search">
            Im Lernstoff suchen
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Zum Beispiel: Join, Ableitung, Kalibration"
            />
          </label>
          {needle && <p role="status">{matchingChapters.length} passende Kapitel</p>}
          <ol className="study-chapter-list">
            {matchingChapters.map((item) => (
              <li key={item.id}>
                <button
                  className="study-chapter-row"
                  type="button"
                  onClick={() => setSelectedChapter(item.id)}
                >
                  <span className="study-number" aria-hidden="true">
                    {String(chapters.indexOf(item) + 1).padStart(2, '0')}
                  </span>
                  <span className="study-row-copy">
                    <strong>{item.title}</strong>
                    {item.optional && <small>Optionale Vertiefung</small>}
                    <span>{item.lead}</span>
                  </span>
                  <span className="study-row-status">
                    {completed.includes(item.id) ? 'Als studiert markiert' : 'Noch offen'}
                  </span>
                  <InterfaceIcon name="arrowRight" className="study-inline-icon study-row-arrow" />
                </button>
              </li>
            ))}
          </ol>
          {!chapters.length && <p>Die Kapitel werden hier angezeigt, sobald sie verfügbar sind.</p>}
          <p className="study-fineprint">
            Markiere ein Kapitel, wenn du es bearbeitet hast. Bestandene Codeübungen erfasst der
            Lernraum separat.
          </p>
        </section>
      </div>
    );

  return (
    <div className="study-root">
      <div className="study-reader-layout">
        <aside className="study-outline">
          <label className="study-mobile-chapters">
            Kapitel wechseln
            <select value={chapter.id} onChange={(event) => setSelectedChapter(event.target.value)}>
              {chapters.map((item, position) => (
                <option key={item.id} value={item.id}>
                  {position + 1}. {item.title}
                </option>
              ))}
            </select>
          </label>
          <nav aria-label="Kapitelübersicht">
            <ol>
              {chapters.map((item, position) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="study-outline-chapter"
                    aria-current={item.id === chapter.id ? 'page' : undefined}
                    onClick={() => setSelectedChapter(item.id)}
                  >
                    <span className="study-number" aria-hidden="true">
                      {String(position + 1).padStart(2, '0')}
                    </span>
                    <span>
                      {item.title}
                      {completed.includes(item.id) && <small>Als studiert markiert</small>}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <nav className="study-page-outline" aria-label="In diesem Kapitel">
            <p>In diesem Kapitel</p>
            <a href="#study-theory">Grundlagen</a>
            <a href="#study-media">Medien vertiefen</a>
            <a href="#study-build">Am Code weiterbauen</a>
            <a href="#study-reflection">Reflexion & Notizen</a>
          </nav>
        </aside>
        <article className="study-article" key={chapter.id} aria-labelledby="study-chapter-title">
          <header className="study-article-header">
            <nav className="study-course-back" aria-label="Kursnavigation">
              <button
                className="study-text-button"
                type="button"
                onClick={() => setSelectedChapter(null)}
              >
                <InterfaceIcon name="arrowLeft" className="study-inline-icon" /> Kursübersicht
              </button>
              <span>
                Kapitel {index + 1} von {chapters.length}
              </span>
            </nav>
            <h1 ref={heading} tabIndex={-1} id="study-chapter-title">
              {chapter.title}
            </h1>
            <p className="study-lead">{chapter.lead}</p>
            {chapter.optional && (
              <p>
                Optionale Vertiefung. Du kannst den Kernlernweg und die Scouting-Projekte ohne
                dieses Kapitel bearbeiten.
              </p>
            )}
          </header>
          <section
            id="study-theory"
            className="study-content-section"
            aria-labelledby="study-theory-title"
          >
            <h2 id="study-theory-title">Grundlagen</h2>
            <details className="study-section-index">
              <summary>Abschnitte dieses Kapitels</summary>
              <nav aria-label="Theorieabschnitte">
                {chapter.sections.map((section, i) => (
                  <a key={i} href={`#study-section-${i}`}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </details>
            {chapter.sections.map((section, sectionIndex) => (
              <section
                id={`study-section-${sectionIndex}`}
                className="study-theory-section"
                key={`${sectionIndex}-${section.title}`}
              >
                <h3>{section.title}</h3>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
                {section.example && (
                  <div className="study-worked-example">
                    <h4>Durchgerechnetes Beispiel</h4>
                    <pre>
                      <code>{section.example.code}</code>
                    </pre>
                    <h4>Erwartetes Ergebnis</h4>
                    <pre>{section.example.expected}</pre>
                    <p>{section.example.explanation}</p>
                    <small>
                      Referenzbeispiel zum Nachrechnen. Es zählt nicht als bestandene Codeübung.
                    </small>
                  </div>
                )}
              </section>
            ))}
          </section>
          <section
            id="study-media"
            className="study-content-section"
            aria-labelledby="study-media-title"
          >
            <h2 id="study-media-title">Medien vertiefen</h2>
            <ul className="study-resources">
              {chapter.media.map((media, mediaIndex) => (
                <MediaResource key={`${mediaIndex}-${media.url}`} media={media} />
              ))}
            </ul>
            {!chapter.media.length && (
              <p>Für dieses Kapitel sind keine ergänzenden Medien hinterlegt.</p>
            )}
          </section>
          <section
            id="study-build"
            className="study-content-section"
            aria-labelledby="study-build-title"
          >
            <h2 id="study-build-title">Am Code weiterbauen</h2>
            <h3>{chapter.build.title}</h3>
            <p>{chapter.build.brief}</p>
            <a
              className="study-build-link"
              href={chapter.build.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Codebasis öffnen <span className="study-newtab">(neuer Tab)</span>
            </a>
            <p className="study-local-work">
              Die Erklärung und die Referenzbeispiele stehen in diesem Kapitel. Du kannst damit
              lokal arbeiten. Die verlinkte Codebasis dient der zusätzlichen Reproduktion und
              Vertiefung.
            </p>
            <button
              className="study-button"
              type="button"
              onClick={() => {
                try {
                  downloadStudyWorkbook(chapter, notes[chapter.id] ?? '');
                  setDownloadError('');
                } catch {
                  setDownloadError(
                    'Die Arbeitsmappe konnte nicht erstellt werden. Bitte erneut versuchen.',
                  );
                }
              }}
            >
              Kapitel als Arbeitsmappe laden
            </button>
            {downloadError && <p role="alert">{downloadError}</p>}
            {!!chapter.references?.length && (
              <details className="study-source-audit">
                <summary>
                  Herkunft und Einordnung der Repositories ({chapter.references.length})
                </summary>
                {chapter.references.map((source) => (
                  <div key={source.url}>
                    <h3>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title}
                      </a>
                    </h3>
                    <p>{source.focus}</p>
                    <p>Lizenz: {source.license}</p>
                    <p>Geprüfte Dateien: {source.inspected.join(', ')}</p>
                  </div>
                ))}
              </details>
            )}
            <h3>Woran du dein Ergebnis prüfst</h3>
            <ul className="study-acceptance">
              {chapter.build.acceptance.map((criterion, criterionIndex) => (
                <li key={criterionIndex}>{criterion}</li>
              ))}
            </ul>
            {!!chapter.localProjects?.length && (
              <section aria-label="Beispiele für deine IDE">
                <h3>In deiner IDE weiterarbeiten</h3>
                <p>
                  Öffne im Website-Projekt den Ordner <code>Beispielprojekte</code>. Diese lokalen
                  Beispiele passen zum Kapitel. Ihre README beschreibt Struktur, Voraussetzungen und
                  Startschritte.
                </p>
                <ul>
                  {chapter.localProjects.map((project) => (
                    <li key={project.path}>
                      <strong>{project.title}</strong>
                      <p>
                        <code>{project.path}</code>
                      </p>
                      <small>{project.kind}</small>
                    </li>
                  ))}
                </ul>
                <p>
                  Die Upstream-Originale bleiben unverändert. Kopiere ein Beispiel für deine eigenen
                  Änderungen in einen separaten Arbeitsordner.
                </p>
              </section>
            )}
            {chapter.projectId && (
              <button
                type="button"
                className="study-button study-primary"
                onClick={() => onProject(chapter.projectId!)}
              >
                Projekt öffnen
              </button>
            )}
            {!!chapter.practiceIds.length && (
              <div className="study-practice">
                <h3>Optional: gezielt üben</h3>
                <p>
                  Nutze die vorhandenen Übungen, wenn du einen Schritt praktisch festigen möchtest.
                </p>
                <div className="study-actions">
                  {chapter.practiceIds.map((id) => (
                    <button
                      className="study-button"
                      type="button"
                      key={id}
                      onClick={() => onPractice(id)}
                    >
                      Übung öffnen: {practiceLabels[id] ?? id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
          <section
            id="study-reflection"
            className="study-content-section"
            aria-labelledby="study-reflection-title"
          >
            <h2 id="study-reflection-title">Reflexion & Notizen</h2>
            <ol className="study-questions">
              {chapter.questions.map((question, questionIndex) => (
                <li key={questionIndex}>{question}</li>
              ))}
            </ol>
            <label className="study-note-label" htmlFor="study-notes">
              Deine Notizen
            </label>
            <p className="study-fineprint" id="study-notes-help">
              Halte Gedanken, offene Fragen und Beobachtungen fest. Bis zu{' '}
              {PROGRESS_LIMITS.studyNotes.toLocaleString('de-DE')} Zeichen pro Kapitel.
            </p>
            <textarea
              id="study-notes"
              value={notes[chapter.id] ?? ''}
              maxLength={PROGRESS_LIMITS.studyNotes}
              rows={8}
              aria-describedby="study-notes-help"
              onChange={(event) =>
                onNote(chapter.id, event.target.value.slice(0, PROGRESS_LIMITS.studyNotes))
              }
            />
            <div className="study-completion">
              <label>
                <input
                  type="checkbox"
                  checked={completed.includes(chapter.id)}
                  onChange={(event) => onComplete(chapter.id, event.target.checked)}
                />
                Als studiert markieren
              </label>
              <p>
                Damit hältst du deinen Lesefortschritt fest. Der Status deiner Codeübungen bleibt
                unverändert.
              </p>
            </div>
          </section>
          <nav className="study-pagination" aria-label="Kapitelnavigation">
            <div>
              {index > 0 && (
                <button
                  className="study-text-button"
                  type="button"
                  onClick={() => setSelectedChapter(chapters[index - 1].id)}
                >
                  <InterfaceIcon name="arrowLeft" className="study-inline-icon" /> Vorheriges
                  Kapitel<span>{chapters[index - 1].title}</span>
                </button>
              )}
            </div>
            <div>
              {index < chapters.length - 1 ? (
                <button
                  className="study-text-button"
                  type="button"
                  onClick={() => setSelectedChapter(chapters[index + 1].id)}
                >
                  Nächstes Kapitel <InterfaceIcon name="arrowRight" className="study-inline-icon" />
                  <span>{chapters[index + 1].title}</span>
                </button>
              ) : (
                <button
                  className="study-text-button"
                  type="button"
                  onClick={() => setSelectedChapter(null)}
                >
                  Zur Kursübersicht{' '}
                  <InterfaceIcon name="arrowRight" className="study-inline-icon" />
                </button>
              )}
            </div>
          </nav>
        </article>
      </div>
    </div>
  );
}
