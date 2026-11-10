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
  const {
    busy: isCodeRunning,
    result: executionResult,
    error: executionError,
    setError: setExecutionError,
    run: executeCode,
    stop: cancelExecution,
    clear: clearExecution,
  } = useCodeExecution();
  const [page, setPage] = useState<Page>(initialPage);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [areChaptersVisible, setChaptersVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [studyChapterId, setStudyChapterId] = useState<string>();
  const importGeneration = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pageHeading = useRef<HTMLHeadingElement>(null);
  const [navigationVersion, setNavigationVersion] = useState(0);
  const shouldFocus = useRef(false);
  const selectedLesson =
    lessons.find((candidateLesson) => candidateLesson.id === progress.selectedLesson) ?? lessons[0];
  const project =
    page === 'Projekte'
      ? projects.find((candidateProject) => candidateProject.id === projectId)
      : undefined;
  const lesson = project?.lesson ?? selectedLesson;
  const currentLessonProgress = getLessonProgress(progress, lesson);
  const completion = getCompletion(progress);
  const journeyCount = kickbaseSteps.filter((step) =>
    progress.study?.completed.includes(step.id),
  ).length;
  function saveStudyNote(id: string, text: string) {
    setProgress((previousProgress) => ({
      ...previousProgress,
      study: {
        notes: { ...previousProgress.study?.notes, [id]: text },
        completed: previousProgress.study?.completed ?? [],
      },
    }));
  }
  function setStudyCompletion(id: string, complete: boolean) {
    setProgress((previousProgress) => ({
      ...previousProgress,
      study: {
        notes: previousProgress.study?.notes ?? {},
        completed: complete
          ? [...new Set([...(previousProgress.study?.completed ?? []), id])]
          : (previousProgress.study?.completed ?? []).filter((value) => value !== id),
      },
    }));
  }
  const activeTrack = tracks.find(
    (candidateTrack) => candidateTrack.id === (selectedLesson.trackId ?? 'python'),
  );
  const searchQuery = search.trim().toLocaleLowerCase('de');
  const matchesLessonSearch = (candidateLesson: typeof lesson) =>
    !searchQuery ||
    `${candidateLesson.title} ${candidateLesson.concept}`
      .toLocaleLowerCase('de')
      .includes(searchQuery);

  useEffect(
    () => () => {
      importGeneration.current++;
    },
    [],
  );
  useEffect(() => {
    if (shouldFocus.current) {
      const focusTarget =
        page === 'Projektweg'
          ? document.getElementById('workspace')
          : (page === 'Lernraum' || project ? heading : pageHeading).current;
      focusTarget?.focus();
      shouldFocus.current = false;
    }
  }, [navigationVersion, page, project]);
  function navigateToPage(next: Page) {
    clearExecution();
    setPage(next);
    shouldFocus.current = true;
    setNavigationVersion((previousVersion) => previousVersion + 1);
  }
  function selectLesson(id: string) {
    if (!lessons.some((candidateLesson) => candidateLesson.id === id)) return;
    clearExecution();
    setProgress((previousProgress) => ({ ...previousProgress, selectedLesson: id }));
    setChaptersVisible(false);
    setPage('Lernraum');
    shouldFocus.current = true;
    setNavigationVersion((previousVersion) => previousVersion + 1);
  }
  function openProject(id: string) {
    clearExecution();
    setProjectId(id);
    setPage('Projekte');
    shouldFocus.current = true;
    setNavigationVersion((previousVersion) => previousVersion + 1);
  }
  function updateLessonProgress(patch: Partial<LessonProgress>) {
    if (patch.code !== undefined) clearExecution();
    setProgress((previousProgress) => ({
      ...previousProgress,
      lessons: {
        ...previousProgress.lessons,
        [lesson.id]: {
          ...getLessonProgress(previousProgress, lesson),
          ...patch,
          ...(patch.code !== undefined ? { passed: false } : {}),
        },
      },
      ...(project && patch.code !== undefined
        ? {
            projects: {
              ...previousProgress.projects,
              [project.id]: {
                ...getProjectProgress(previousProgress, project.id),
                reviewed: false,
              },
            },
          }
        : {}),
    }));
  }
  function updateProjectProgress(patch: Partial<ProjectProgress>) {
    if (!project) return;
    setProgress((previousProgress) => ({
      ...previousProgress,
      projects: {
        ...previousProgress.projects,
        [project.id]: { ...getProjectProgress(previousProgress, project.id), ...patch },
      },
    }));
  }
  async function executeLessonCode() {
    const targetLesson = lesson;
    const executionResponse = await executeCode(currentLessonProgress.code, targetLesson);
    if (!executionResponse) return;
    const passed =
      !executionResponse.error &&
      executionResponse.checks.length > 0 &&
      executionResponse.checks.every((check) => check.passed);
    setProgress((progress) => ({
      ...progress,
      lessons: {
        ...progress.lessons,
        [targetLesson.id]: { ...getLessonProgress(progress, targetLesson), passed },
      },
    }));
  }
  async function importFile(file: File | undefined) {
    if (!file) return;
    const ticket = ++importGeneration.current;
    try {
      const imported = importProgress(await file.text());
      if (ticket !== importGeneration.current) return;
      clearExecution();
      replaceProgress(imported);
      setNotice('Fortschritt importiert. Du kannst weiterlernen.');
      const hasJourney = kickbaseSteps.some(
        (step) =>
          imported.study?.completed.includes(step.id) ||
          imported.study?.notes[step.id] !== undefined,
      );
      setPage(hasJourney ? 'Projektweg' : 'Lernraum');
      shouldFocus.current = true;
      setNavigationVersion((previousVersion) => previousVersion + 1);
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
  const renderLessonRows = (visibleLessons: typeof lessons) => (
    <ul className="lesson-list">
      {visibleLessons.map((candidateLesson) => (
        <li key={candidateLesson.id}>
          <button
            aria-label={`Lektion öffnen: ${candidateLesson.title}`}
            aria-current={candidateLesson.id === selectedLesson.id ? 'step' : undefined}
            onClick={() => selectLesson(candidateLesson.id)}
          >
            <span className="lesson-state" aria-hidden="true">
              {progress.lessons[candidateLesson.id]?.passed ? '✓' : '○'}
            </span>
            <span>
              <strong>{candidateLesson.title}</strong>
              <small>
                {candidateLesson.minutes} Min · {getStatus(progress.lessons[candidateLesson.id])}
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
          onChange={(event) => {
            void importFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </header>
      <nav className="main-nav" aria-label="Hauptnavigation">
        {pages.map((name, index) => (
          <button
            key={name}
            aria-current={page === name ? 'page' : undefined}
            onClick={() => navigateToPage(name)}
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
            key={navigationVersion}
            completed={progress.study?.completed ?? []}
            notes={progress.study?.notes ?? {}}
            onNote={saveStudyNote}
            onComplete={setStudyCompletion}
            onPractice={selectLesson}
            onRead={(id) => {
              setStudyChapterId(id);
              navigateToPage('Studium');
            }}
          />
        ) : page === 'Studium' ? (
          <CourseReader
            key={studyChapterId}
            initialChapterId={studyChapterId}
            chapters={studyChapters}
            onPractice={selectLesson}
            onProject={openProject}
            practiceLabels={Object.fromEntries(lessons.map((item) => [item.id, item.title]))}
            notes={progress.study?.notes ?? {}}
            completed={progress.study?.completed ?? []}
            onNote={saveStudyNote}
            onComplete={setStudyCompletion}
          />
        ) : page === 'Lernraum' ? (
          <>
            <div className="workspace-controls">
              <button
                aria-expanded={areChaptersVisible}
                aria-controls="chapter-tree"
                onClick={() => setChaptersVisible(!areChaptersVisible)}
              >
                {areChaptersVisible ? 'Kapitel ausblenden' : 'Kapitel einblenden'}
              </button>
              <span className="muted">
                {activeTrack?.title} / Lektion {lessons.indexOf(selectedLesson) + 1} von{' '}
                {lessons.length}
              </span>
            </div>
            <div className={`learning-layout ${areChaptersVisible ? '' : 'without-chapters'}`}>
              {areChaptersVisible && (
                <aside
                  id="chapter-tree"
                  className="chapter-tree"
                  aria-label="Kapitel und Lektionen"
                >
                  <h2>Kursinhalt</h2>
                  {tracks.map((track) => {
                    const visibleLessons = lessons.filter(
                      (candidateLesson) => (candidateLesson.trackId ?? 'python') === track.id,
                    );
                    return (
                      <details
                        key={track.id}
                        open={track.id === (selectedLesson.trackId ?? 'python')}
                      >
                        <summary>
                          {track.title}
                          <span>
                            {
                              visibleLessons.filter(
                                (candidateLesson) => progress.lessons[candidateLesson.id]?.passed,
                              ).length
                            }
                            /{visibleLessons.length}
                          </span>
                        </summary>
                        {renderLessonRows(visibleLessons)}
                      </details>
                    );
                  })}
                </aside>
              )}
              <Workspace
                key={lesson.id}
                lesson={lesson}
                current={currentLessonProgress}
                busy={isCodeRunning}
                result={executionResult}
                error={executionError}
                heading={heading}
                update={updateLessonProgress}
                execute={() => void executeLessonCode()}
                cancel={() => {
                  cancelExecution();
                  setExecutionError('Ausführung abgebrochen. Du kannst es erneut versuchen.');
                }}
                select={selectLesson}
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Titel oder Konzept suchen"
            />
            {!lessons.some(matchesLessonSearch) && (
              <p role="status">Keine Lektion gefunden. Versuche einen anderen Begriff.</p>
            )}
            <div className="course-grid">
              {tracks.map((track) => {
                const trackLessons = lessons.filter(
                  (candidateLesson) => (candidateLesson.trackId ?? 'python') === track.id,
                );
                const visibleLessons = trackLessons.filter(matchesLessonSearch);
                return (
                  visibleLessons.length > 0 && (
                    <section className="track-section" key={track.id}>
                      <span className="course-card-tag">
                        Kurs · {trackLessons.length} Lektionen
                      </span>
                      <header>
                        <div>
                          <h2>{track.title}</h2>
                          <p>{track.description}</p>
                        </div>
                        <span className="count">
                          {
                            trackLessons.filter(
                              (candidateLesson) => progress.lessons[candidateLesson.id]?.passed,
                            ).length
                          }{' '}
                          / {trackLessons.length} bestanden
                        </span>
                      </header>
                      <div className="course-card-footer">
                        <progress
                          value={
                            trackLessons.filter(
                              (candidateLesson) => progress.lessons[candidateLesson.id]?.passed,
                            ).length
                          }
                          max={trackLessons.length}
                          aria-label={`Fortschritt: ${track.title}`}
                        />
                        <button
                          className="primary course-continue"
                          aria-label={`Weiterlernen: ${track.title}`}
                          onClick={() =>
                            selectLesson(
                              (
                                trackLessons.find(
                                  (candidateLesson) =>
                                    !progress.lessons[candidateLesson.id]?.passed,
                                ) ?? trackLessons[0]
                              ).id,
                            )
                          }
                        >
                          Weiterlernen
                        </button>
                      </div>
                      <details className="course-lessons" open={searchQuery ? true : undefined}>
                        <summary>{visibleLessons.length} Lektionen ansehen</summary>
                        {renderLessonRows(visibleLessons)}
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
                      {track.projectId &&
                        projects.some(
                          (candidateProject) => candidateProject.id === track.projectId,
                        ) && (
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
                    clearExecution();
                    setProjectId(null);
                    shouldFocus.current = true;
                    setNavigationVersion((previousVersion) => previousVersion + 1);
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
                current={currentLessonProgress}
                busy={isCodeRunning}
                result={executionResult}
                error={executionError}
                heading={heading}
                update={updateLessonProgress}
                execute={() => void executeLessonCode()}
                cancel={() => {
                  cancelExecution();
                  setExecutionError('Ausführung abgebrochen. Du kannst es erneut versuchen.');
                }}
                select={selectLesson}
                lessons={lessons}
                project={project}
                projectProgress={getProjectProgress(progress, project.id)}
                updateProject={updateProjectProgress}
              />
            </>
          ) : (
            <section className="overview">
              <p>
                Eine Fußballfrage bearbeiten, Ergebnisse reproduzierbar sichern und die eigene
                Entscheidung prüfen. Du kannst Projekte jederzeit beginnen und exportieren.
              </p>
              {projects.map((candidateProject) => (
                <article className="project-row" key={candidateProject.id}>
                  <div>
                    <span className="eyebrow">
                      {isProjectComplete(candidateProject, progress)
                        ? 'ABGESCHLOSSEN · SELBST GEPRÜFT'
                        : 'PORTFOLIO'}
                    </span>
                    <h2>{candidateProject.title}</h2>
                    <p>{candidateProject.subtitle}</p>
                    <p>{candidateProject.question}</p>
                  </div>
                  <button className="primary" onClick={() => openProject(candidateProject.id)}>
                    Projekt öffnen: {candidateProject.title}
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
            {lessons.some((candidateLesson) => candidateLesson.reviewOf) ? (
              lessons
                .filter((candidateLesson) => candidateLesson.reviewOf)
                .map((candidateLesson) => (
                  <article className="review-row" key={candidateLesson.id}>
                    <h2>{candidateLesson.title}</h2>
                    <p>{candidateLesson.concept}</p>
                    <p className="muted">{getStatus(progress.lessons[candidateLesson.id])}</p>
                    <div className="actions">
                      <button className="primary" onClick={() => selectLesson(candidateLesson.id)}>
                        Wiederholung öffnen: {candidateLesson.title}
                      </button>
                      <button onClick={() => selectLesson(candidateLesson.reviewOf!)}>
                        Grundlage:{' '}
                        {lessons.find(
                          (prerequisiteLesson) =>
                            prerequisiteLesson.id === candidateLesson.reviewOf,
                        )?.title ?? candidateLesson.reviewOf}
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
                {renderLessonRows(
                  lessons.filter((candidateLesson) => progress.lessons[candidateLesson.id]),
                )}
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
            {lessons.some((candidateLesson) => !progress.lessons[candidateLesson.id]?.passed) ? (
              renderLessonRows(
                lessons.filter((candidateLesson) => !progress.lessons[candidateLesson.id]?.passed),
              )
            ) : (
              <p>Alle Codeprüfungen bestanden.</p>
            )}
            <h2>Projekt-Checkliste</h2>
            {projects.map((candidateProject) => (
              <div className="completion-project" key={candidateProject.id}>
                <strong>
                  {isProjectComplete(candidateProject, progress) ? '✓ Selbst geprüft' : '○ Offen'} ·{' '}
                  {candidateProject.title}
                </strong>
                <button onClick={() => openProject(candidateProject.id)}>
                  Projekt bearbeiten: {candidateProject.title}
                </button>
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
