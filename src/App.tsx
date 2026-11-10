import { useEffect, useRef, useState } from 'react';
import { lessons, tracks } from './content';
import {
  projects,
  getProjectProgress,
  isProjectComplete,
  getCompletion,
  exportProject,
  exportPortfolio,
} from './projects';
import { useCodeExecution } from './learning/useCodeExecution';
import { useLearningProgress } from './learning/useLearningProgress';
import {
  importProgress,
  exportProgress,
  getStatus,
  getLessonProgress,
  getRawProgress,
} from './progress';
import type { LessonProgress, ProjectProgress } from './types';
import { Workspace } from './ui/Workspace';
import { InterfaceIcon } from './ui/InterfaceIcon';
import { CourseReader } from './ui/CourseReader';
import { ProjectJourney } from './ui/ProjectJourney';
import { kickbaseSteps } from './kickbase/course';
import { studyChapters } from './course-study';
import { learningResources } from './course/resources';
import './fonts.css';
import './App.css';

const pages = [
  'Projektweg',
  'Studium',
  'Lernraum',
  'Lernpfad',
  'Projekte',
  'Wiederholen',
  'Abschluss',
] as const;
type Page = (typeof pages)[number];
export default function App({ initialPage = 'Projektweg' }: { initialPage?: Page } = {}) {
  const { progress, setProgress, storageIssue, storageError, replaceProgress, recoverProgress } =
    useLearningProgress();
  const { busy, result, error, setError, run, stop, clear } = useCodeExecution();
  const [page, setPage] = useState<Page>(initialPage);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [chapters, setChapters] = useState(false);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [studyChapterId, setStudyChapterId] = useState<string>();
  const importGeneration = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pageHeading = useRef<HTMLHeadingElement>(null);
  const [selection, setSelection] = useState(0);
  const shouldFocus = useRef(false);
  const selectedLesson = lessons.find((l) => l.id === progress.selectedLesson) ?? lessons[0];
  const project = page === 'Projekte' ? projects.find((p) => p.id === projectId) : undefined;
  const lesson = project?.lesson ?? selectedLesson;
  const current = getLessonProgress(progress, lesson);
  const completion = getCompletion(progress);
  const journeyCount = kickbaseSteps.filter((step) =>
    progress.study?.completed.includes(step.id),
  ).length;
  function saveStudyNote(id: string, text: string) {
    setProgress((p) => ({
      ...p,
      study: { notes: { ...p.study?.notes, [id]: text }, completed: p.study?.completed ?? [] },
    }));
  }
  function markStudy(id: string, complete: boolean) {
    setProgress((p) => ({
      ...p,
      study: {
        notes: p.study?.notes ?? {},
        completed: complete
          ? [...new Set([...(p.study?.completed ?? []), id])]
          : (p.study?.completed ?? []).filter((value) => value !== id),
      },
    }));
  }
  const activeTrack = tracks.find((t) => t.id === (selectedLesson.trackId ?? 'python'));
  const query = search.trim().toLocaleLowerCase('de');
  const matching = (l: typeof lesson) =>
    !query || `${l.title} ${l.concept}`.toLocaleLowerCase('de').includes(query);

  useEffect(
    () => () => {
      importGeneration.current++;
    },
    [],
  );
  useEffect(() => {
    if (shouldFocus.current) {
      const target =
        page === 'Projektweg'
          ? document.getElementById('workspace')
          : (page === 'Lernraum' || project ? heading : pageHeading).current;
      target?.focus();
      shouldFocus.current = false;
    }
  }, [selection, page, project]);
  function navigate(next: Page) {
    clear();
    setPage(next);
    shouldFocus.current = true;
    setSelection((n) => n + 1);
  }
  function select(id: string) {
    if (!lessons.some((l) => l.id === id)) return;
    clear();
    setProgress((p) => ({ ...p, selectedLesson: id }));
    setChapters(false);
    setPage('Lernraum');
    shouldFocus.current = true;
    setSelection((n) => n + 1);
  }
  function openProject(id: string) {
    clear();
    setProjectId(id);
    setPage('Projekte');
    shouldFocus.current = true;
    setSelection((n) => n + 1);
  }
  function update(patch: Partial<LessonProgress>) {
    if (patch.code !== undefined) clear();
    setProgress((p) => ({
      ...p,
      lessons: {
        ...p.lessons,
        [lesson.id]: {
          ...getLessonProgress(p, lesson),
          ...patch,
          ...(patch.code !== undefined ? { passed: false } : {}),
        },
      },
      ...(project && patch.code !== undefined
        ? {
            projects: {
              ...p.projects,
              [project.id]: {
                ...getProjectProgress(p, project.id),
                reviewed: false,
              },
            },
          }
        : {}),
    }));
  }
  function updateProject(patch: Partial<ProjectProgress>) {
    if (!project) return;
    setProgress((p) => ({
      ...p,
      projects: {
        ...p.projects,
        [project.id]: { ...getProjectProgress(p, project.id), ...patch },
      },
    }));
  }
  async function execute() {
    const target = lesson;
    const response = await run(current.code, target);
    if (!response) return;
    const passed =
      !response.error &&
      response.checks.length > 0 &&
      response.checks.every((check) => check.passed);
    setProgress((progress) => ({
      ...progress,
      lessons: {
        ...progress.lessons,
        [target.id]: { ...getLessonProgress(progress, target), passed },
      },
    }));
  }
  async function importFile(file: File | undefined) {
    if (!file) return;
    const ticket = ++importGeneration.current;
    try {
      const imported = importProgress(await file.text());
      if (ticket !== importGeneration.current) return;
      clear();
      replaceProgress(imported);
      setNotice('Fortschritt importiert. Du kannst weiterlernen.');
      const hasJourney = kickbaseSteps.some(
        (step) =>
          imported.study?.completed.includes(step.id) ||
          imported.study?.notes[step.id] !== undefined,
      );
      setPage(hasJourney ? 'Projektweg' : 'Lernraum');
      shouldFocus.current = true;
      setSelection((n) => n + 1);
    } catch (cause) {
      if (ticket === importGeneration.current)
        setNotice(
          cause instanceof Error ? cause.message : 'Die Datei konnte nicht importiert werden.',
        );
    }
  }
  function downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function downloadText(text: string, name: string) {
    downloadBlob(new Blob([text], { type: 'application/json' }), name);
  }
  function downloadArchive(kind: 'project' | 'portfolio') {
    try {
      const archive =
        kind === 'project' && project
          ? exportProject(project, progress)
          : exportPortfolio(progress);
      downloadBlob(
        new Blob([new Uint8Array(archive.data).buffer], {
          type: 'application/zip',
        }),
        archive.name,
      );
      setNotice('ZIP-Datei exportiert. Dein aktueller Arbeitsstand ist enthalten.');
    } catch (cause) {
      setNotice(
        cause instanceof Error ? cause.message : 'Export fehlgeschlagen. Bitte erneut versuchen.',
      );
    }
  }
  const lessonRows = (items: typeof lessons) => (
    <ul className="lesson-list">
      {items.map((l) => (
        <li key={l.id}>
          <button
            aria-label={`Lektion öffnen: ${l.title}`}
            aria-current={l.id === selectedLesson.id ? 'step' : undefined}
            onClick={() => select(l.id)}
          >
            <span className="lesson-state" aria-hidden="true">
              {progress.lessons[l.id]?.passed ? '✓' : '○'}
            </span>
            <span>
              <strong>{l.title}</strong>
              <small>
                {l.minutes} Min · {getStatus(progress.lessons[l.id])}
              </small>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className={`app-shell ${page === 'Lernraum' || project ? 'exercise-view' : 'catalog-view'}`}
    >
      <a className="skip-link" href="#workspace">
        Zum Lernraum
      </a>
      <header className="course-header">
        <div className="brand">
          <InterfaceIcon name="pitch" className="brand-symbol" />
          <div>
            Matchplan<span>Fußballdaten · Python · SQL</span>
          </div>
        </div>
        <div className="course-progress">
          <span>
            <strong>{page === 'Projektweg' ? journeyCount : completion.passedLessons}</strong> /{' '}
            {page === 'Projektweg' ? kickbaseSteps.length : completion.totalLessons}{' '}
            {page === 'Projektweg' ? 'Schritte selbst geprüft' : 'Lektionen'}
          </span>
          <progress
            value={page === 'Projektweg' ? journeyCount : completion.passedLessons}
            max={page === 'Projektweg' ? kickbaseSteps.length : completion.totalLessons}
            aria-label={
              page === 'Projektweg' ? 'Selbst geprüfte Projektschritte' : 'Bestandene Lektionen'
            }
          />
        </div>
        <div className="backup-actions" aria-label="Lernstand sichern">
          <button
            onClick={() =>
              downloadText(
                exportProgress(progress),
                storageIssue
                  ? 'matchplan-nicht-gespeicherter-lernstand.json'
                  : 'matchplan-fortschritt.json',
              )
            }
          >
            Exportieren
          </button>
          <button onClick={() => fileInput.current?.click()}>Importieren</button>
        </div>
        <input
          hidden
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          aria-label="Fortschritt importieren"
          onChange={(e) => {
            void importFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </header>
      <nav className="main-nav" aria-label="Hauptnavigation">
        {pages.map((name, index) => (
          <button
            key={name}
            aria-current={page === name ? 'page' : undefined}
            onClick={() => navigate(name)}
          >
            <InterfaceIcon
              name={
                (['pitch', 'learn', 'code', 'path', 'projects', 'review', 'finish'] as const)[index]
              }
            />
            {name}
          </button>
        ))}
      </nav>
      <main id="workspace" tabIndex={-1}>
        {storageError && (
          <div role="alert" className="warning">
            Dein Fortschritt konnte nicht lokal gespeichert werden. Exportiere ihn, bevor du die
            Seite schließt.
          </div>
        )}
        {storageIssue && (
          <div role="alert" className="warning">
            <p>{storageIssue}</p>
            <div className="actions">
              <button
                onClick={() => downloadText(getRawProgress() ?? '', 'matchplan-originaldaten.json')}
              >
                Originaldaten sichern
              </button>
              <button onClick={recoverProgress}>Diesen Lernstand stattdessen speichern</button>
            </div>
          </div>
        )}
        {notice && (
          <div role="status" className="notice">
            <span>{notice}</span>
            <button aria-label="Meldung schließen" onClick={() => setNotice('')}>
              Schließen
            </button>
          </div>
        )}
        {page !== 'Studium' && page !== 'Projektweg' && (
          <div className="workspace-header">
            <div>
              <div className="breadcrumb">
                Kurs / {page}
                {page === 'Lernraum'
                  ? ` / ${activeTrack?.title ?? 'Python'}`
                  : project
                    ? ` / ${project.title}`
                    : ''}
              </div>
              <h1 ref={pageHeading} tabIndex={-1}>
                {page === 'Lernraum'
                  ? 'Lernraum'
                  : page === 'Lernpfad'
                    ? 'Dein Lernpfad'
                    : page === 'Projekte'
                      ? 'Deine Scouting-Projekte'
                      : page === 'Wiederholen'
                        ? 'Wissen erneut anwenden'
                        : 'Deine Abschluss-Checkliste'}
              </h1>
            </div>
            <span className="data-note">Fiktive Übungsdaten · lokal im Browser</span>
          </div>
        )}
        {page === 'Projektweg' ? (
          <ProjectJourney
            key={selection}
            completed={progress.study?.completed ?? []}
            notes={progress.study?.notes ?? {}}
            onNote={saveStudyNote}
            onComplete={markStudy}
            onPractice={select}
            onRead={(id) => {
              setStudyChapterId(id);
              navigate('Studium');
            }}
          />
        ) : page === 'Studium' ? (
          <CourseReader
            key={studyChapterId}
            initialChapterId={studyChapterId}
            chapters={studyChapters}
            onPractice={select}
            onProject={openProject}
            practiceLabels={Object.fromEntries(lessons.map((item) => [item.id, item.title]))}
            notes={progress.study?.notes ?? {}}
            completed={progress.study?.completed ?? []}
            onNote={saveStudyNote}
            onComplete={markStudy}
          />
        ) : page === 'Lernraum' ? (
          <>
            <div className="workspace-controls">
              <button
                aria-expanded={chapters}
                aria-controls="chapter-tree"
                onClick={() => setChapters(!chapters)}
              >
                {chapters ? 'Kapitel ausblenden' : 'Kapitel einblenden'}
              </button>
              <span className="muted">
                {activeTrack?.title} / Lektion {lessons.indexOf(selectedLesson) + 1} von{' '}
                {lessons.length}
              </span>
            </div>
            <div className={`learning-layout ${chapters ? '' : 'without-chapters'}`}>
              {chapters && (
                <aside
                  id="chapter-tree"
                  className="chapter-tree"
                  aria-label="Kapitel und Lektionen"
                >
                  <h2>Kursinhalt</h2>
                  {tracks.map((track) => {
                    const items = lessons.filter((l) => (l.trackId ?? 'python') === track.id);
                    return (
                      <details
                        key={track.id}
                        open={track.id === (selectedLesson.trackId ?? 'python')}
                      >
                        <summary>
                          {track.title}
                          <span>
                            {items.filter((l) => progress.lessons[l.id]?.passed).length}/
                            {items.length}
                          </span>
                        </summary>
                        {lessonRows(items)}
                      </details>
                    );
                  })}
                </aside>
              )}
              <Workspace
                key={lesson.id}
                lesson={lesson}
                current={current}
                busy={busy}
                result={result}
                error={error}
                heading={heading}
                update={update}
                execute={() => void execute()}
                cancel={() => {
                  stop();
                  setError('Ausführung abgebrochen. Du kannst es erneut versuchen.');
                }}
                select={select}
                lessons={lessons}
                next={lessons[lessons.indexOf(selectedLesson) + 1]}
              />
            </div>
          </>
        ) : page === 'Lernpfad' ? (
          <section className="overview">
            <div className="course-intro">
              <div className="course-intro-copy">
                <h2>Datenscouting lernen</h2>
                <p>
                  In {tracks.length} Kursen übst du Python, Datenaufbereitung und Analyse. Die
                  Praxisaufgaben nutzen fiktive Sportdaten und bereiten die Projektarbeit vor.
                </p>
              </div>
              <InterfaceIcon name="pitch" className="course-intro-mark" />
            </div>
            <label htmlFor="lesson-search">Lektionen durchsuchen</label>
            <input
              id="lesson-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Titel oder Konzept suchen"
            />
            {!lessons.some(matching) && (
              <p role="status">Keine Lektion gefunden. Versuche einen anderen Begriff.</p>
            )}
            <div className="course-grid">
              {tracks.map((track) => {
                const all = lessons.filter((l) => (l.trackId ?? 'python') === track.id);
                const items = all.filter(matching);
                return (
                  items.length > 0 && (
                    <section className="track-section" key={track.id}>
                      <span className="course-card-tag">Kurs · {all.length} Lektionen</span>
                      <header>
                        <div>
                          <h2>{track.title}</h2>
                          <p>{track.description}</p>
                        </div>
                        <span className="count">
                          {all.filter((l) => progress.lessons[l.id]?.passed).length} / {all.length}{' '}
                          bestanden
                        </span>
                      </header>
                      <div className="course-card-footer">
                        <progress
                          value={all.filter((l) => progress.lessons[l.id]?.passed).length}
                          max={all.length}
                          aria-label={`Fortschritt: ${track.title}`}
                        />
                        <button
                          className="primary course-continue"
                          aria-label={`Weiterlernen: ${track.title}`}
                          onClick={() =>
                            select((all.find((l) => !progress.lessons[l.id]?.passed) ?? all[0]).id)
                          }
                        >
                          Weiterlernen
                        </button>
                      </div>
                      <details className="course-lessons" open={query ? true : undefined}>
                        <summary>{items.length} Lektionen ansehen</summary>
                        {lessonRows(items)}
                      </details>
                      <details className="course-resources">
                        <summary>Tutorials & Vertiefung</summary>
                        {(learningResources[track.id] ?? []).map((resource) => (
                          <div className="resource-entry" key={resource.url}>
                            <a href={resource.url} target="_blank" rel="noreferrer">
                              {resource.title} ↗
                            </a>
                            {resource.kind && (
                              <small className="resource-kind">{resource.kind}</small>
                            )}
                            <p>{resource.action}</p>
                            <small>{resource.environment}</small>
                          </div>
                        ))}
                      </details>
                      {track.projectId && projects.some((p) => p.id === track.projectId) && (
                        <button
                          className="text-button"
                          onClick={() => openProject(track.projectId!)}
                        >
                          Zugehöriges Projekt öffnen
                        </button>
                      )}
                    </section>
                  )
                );
              })}
            </div>
          </section>
        ) : page === 'Projekte' ? (
          project ? (
            <>
              <div className="project-toolbar">
                <button
                  onClick={() => {
                    clear();
                    setProjectId(null);
                    shouldFocus.current = true;
                    setSelection((n) => n + 1);
                  }}
                >
                  Alle Projekte
                </button>
                <span className="project-status" role="status">
                  {isProjectComplete(project, progress)
                    ? 'Projekt abgeschlossen · selbst geprüft'
                    : 'Projekt in Arbeit · Code, Bericht und Selbstprüfung erforderlich'}
                </span>
                <button onClick={() => downloadArchive('project')}>
                  Projekt als ZIP exportieren
                </button>
              </div>
              <Workspace
                key={project.id}
                lesson={project.lesson}
                current={current}
                busy={busy}
                result={result}
                error={error}
                heading={heading}
                update={update}
                execute={() => void execute()}
                cancel={() => {
                  stop();
                  setError('Ausführung abgebrochen. Du kannst es erneut versuchen.');
                }}
                select={select}
                lessons={lessons}
                project={project}
                projectProgress={getProjectProgress(progress, project.id)}
                updateProject={updateProject}
              />
            </>
          ) : (
            <section className="overview">
              <p>
                Eine Fußballfrage bearbeiten, Ergebnisse reproduzierbar sichern und die eigene
                Entscheidung prüfen. Du kannst Projekte jederzeit beginnen und exportieren.
              </p>
              {projects.map((p) => (
                <article className="project-row" key={p.id}>
                  <div>
                    <span className="eyebrow">
                      {isProjectComplete(p, progress)
                        ? 'ABGESCHLOSSEN · SELBST GEPRÜFT'
                        : 'PORTFOLIO'}
                    </span>
                    <h2>{p.title}</h2>
                    <p>{p.subtitle}</p>
                    <p>{p.question}</p>
                  </div>
                  <button className="primary" onClick={() => openProject(p.id)}>
                    Projekt öffnen: {p.title}
                  </button>
                </article>
              ))}
            </section>
          )
        ) : page === 'Wiederholen' ? (
          <section className="overview">
            <p>
              Diese Aufgaben greifen frühere Konzepte in einem neuen Kontext auf. Löse sie möglichst
              ohne Hilfe und vergleiche deinen Befund.
            </p>
            {lessons.some((l) => l.reviewOf) ? (
              lessons
                .filter((l) => l.reviewOf)
                .map((l) => (
                  <article className="review-row" key={l.id}>
                    <h2>{l.title}</h2>
                    <p>{l.concept}</p>
                    <p className="muted">{getStatus(progress.lessons[l.id])}</p>
                    <div className="actions">
                      <button className="primary" onClick={() => select(l.id)}>
                        Wiederholung öffnen: {l.title}
                      </button>
                      <button onClick={() => select(l.reviewOf!)}>
                        Grundlage: {lessons.find((v) => v.id === l.reviewOf)?.title ?? l.reviewOf}
                      </button>
                    </div>
                  </article>
                ))
            ) : (
              <>
                <p>
                  Wähle eine bereits bearbeitete Lektion und löse sie noch einmal mit einem eigenen
                  Ansatz.
                </p>
                {lessonRows(lessons.filter((l) => progress.lessons[l.id]))}
              </>
            )}
          </section>
        ) : (
          <section className="overview completion">
            <p>
              Dies ist deine persönliche Kurs-Checkliste. Bestandene Codeprüfungen und selbst
              geprüfte Projekte sind kein Nachweis von Expertenwissen und keine Zertifizierung.
            </p>
            <div className="completion-counts">
              <p>
                <strong>
                  {completion.passedLessons} / {completion.totalLessons}
                </strong>{' '}
                Lektionen bestanden
              </p>
              <p>
                <strong>
                  {completion.completedProjects} / {completion.totalProjects}
                </strong>{' '}
                Projekte abgeschlossen und selbst geprüft
              </p>
            </div>
            <p className="completion-state" role="status">
              {completion.ready
                ? 'Deine persönliche Checkliste ist vollständig. Prüfe deine Ergebnisse weiterhin kritisch.'
                : 'Noch offen: Bearbeite die folgenden Aufgaben und prüfe deine Projektberichte.'}
            </p>
            <button className="primary" onClick={() => downloadArchive('portfolio')}>
              Portfolio als ZIP exportieren
            </button>
            <p className="muted">
              Export jederzeit möglich, auch mit unfertigen Projekten. Enthalten sind dein aktueller
              Code, Berichte, Daten und Vorlagen.
            </p>
            <h2>Offene Lektionen</h2>
            {lessons.some((l) => !progress.lessons[l.id]?.passed) ? (
              lessonRows(lessons.filter((l) => !progress.lessons[l.id]?.passed))
            ) : (
              <p>Alle Codeprüfungen bestanden.</p>
            )}
            <h2>Projekt-Checkliste</h2>
            {projects.map((p) => (
              <div className="completion-project" key={p.id}>
                <strong>
                  {isProjectComplete(p, progress) ? '✓ Selbst geprüft' : '○ Offen'} · {p.title}
                </strong>
                <button onClick={() => openProject(p.id)}>Projekt bearbeiten: {p.title}</button>
              </div>
            ))}
          </section>
        )}
      </main>
      <footer>
        Matchplan <span>Fußballdaten auswerten und Entscheidungen begründen</span>
      </footer>
    </div>
  );
}
