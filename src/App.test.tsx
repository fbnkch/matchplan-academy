import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { beforeEach, afterEach, vi, test, expect } from 'vitest';
import App from './App';
import { lessons, tracks } from './content';
import { projects } from './projects';
import { kickbaseSteps } from './kickbase/course';
import { emptyProgress, exportProgress } from './progress';

const runtime = vi.hoisted(() => ({
  run: vi.fn(),
  cancel: vi.fn(),
  dispose: vi.fn(),
}));
vi.mock('./runtime', () => ({ createRunner: () => runtime }));
beforeEach(() => {
  runtime.run.mockReset();
  runtime.cancel.mockClear();
  runtime.dispose.mockClear();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function lessonButton(title: string) {
  if (!screen.queryByRole('button', { name: `Lektion öffnen: ${title}`, hidden: true })) {
    fireEvent.click(screen.getByRole('button', { name: 'Kapitel einblenden' }));
  }
  const button = screen.getByRole('button', { name: `Lektion öffnen: ${title}`, hidden: true });
  const disclosure = button.closest('details');
  if (disclosure && !disclosure.open) fireEvent.click(disclosure.querySelector('summary')!);
  return screen.getByRole('button', { name: `Lektion öffnen: ${title}` });
}

test('the theory library is the default and the IDE project path remains accessible', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Mit dem ersten Kapitel beginnen/ })).toBeVisible();
  fireEvent.click(
    within(screen.getByRole('navigation', { name: 'Hauptnavigation' })).getByRole('button', {
      name: 'Projektweg',
    }),
  );
  expect(
    screen.getByRole('heading', { level: 1, name: 'Fußballdaten auswerten lernen' }),
  ).toBeVisible();
  expect(screen.getByRole('main')).toHaveFocus();
});

test('a project backup resumes the next step and preserves notes without passing code', async () => {
  render(<App />);
  const backup = emptyProgress();
  backup.study = {
    notes: { [kickbaseSteps[0].id]: 'Marktwert und Kaufpreis unterscheiden.' },
    completed: [kickbaseSteps[0].id],
  };
  const file = new File([], 'projektweg.json', { type: 'application/json' });
  Object.defineProperty(file, 'text', { value: async () => exportProgress(backup) });
  fireEvent.change(screen.getByLabelText('Fortschritt importieren'), { target: { files: [file] } });
  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 2, name: kickbaseSteps[1].title })).toBeVisible(),
  );
  const index = screen.getByRole('navigation', { name: 'Projektablauf' });
  fireEvent.click(within(index).getByRole('button', { name: new RegExp(kickbaseSteps[0].title) }));
  expect(screen.getByLabelText('Deine Arbeitsnotizen')).toHaveValue(
    'Marktwert und Kaufpreis unterscheiden.',
  );
  expect(screen.getByRole('checkbox', { name: 'Selbst geprüft' })).toBeChecked();
  expect(JSON.parse(localStorage.getItem('matchplan-academy-v1')!).lessons).toEqual({});
});

test('the theory course preserves notes and self-reported study without passing exercises', () => {
  const app = render(<App initialPage="Studium" />);
  fireEvent.click(screen.getByRole('button', { name: /Mit dem ersten Kapitel beginnen/ }));
  fireEvent.change(screen.getByLabelText('Deine Notizen'), {
    target: { value: 'Meine Frage: progressive Pässe unter Druck.' },
  });
  fireEvent.click(screen.getByRole('checkbox', { name: 'Als studiert markieren' }));
  app.unmount();
  render(<App initialPage="Studium" />);
  fireEvent.click(screen.getByRole('button', { name: /Mit dem ersten Kapitel beginnen/ }));
  expect(screen.getByLabelText('Deine Notizen')).toHaveValue(
    'Meine Frage: progressive Pässe unter Druck.',
  );
  expect(screen.getByRole('checkbox', { name: 'Als studiert markieren' })).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: `Übung öffnen: ${lessons[0].title}` }));
  expect(screen.getByLabelText('Python-Code')).toBeVisible();
  expect(screen.queryByText('Selbstständig gelöst')).not.toBeInTheDocument();
});

test('compact screens start with the task and can reveal the complete chapter tree', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  render(<App initialPage="Lernraum" />);
  expect(
    screen.queryByRole('complementary', { name: 'Kapitel und Lektionen' }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Kapitel einblenden' }));
  expect(screen.getByRole('complementary', { name: 'Kapitel und Lektionen' })).toBeVisible();
});

test('a learner uses a hint, passes the code checks and continues to the next lesson', async () => {
  runtime.run.mockResolvedValue({
    output: '2',
    checks: [{ label: 'Ergebnis stimmt', passed: true, actual: '2', expected: '2' }],
  });
  render(<App initialPage="Lernraum" />);
  const editor = screen.getByLabelText('Python-Code');
  expect(editor).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Nächsten Hinweis zeigen' }));
  expect(screen.getByText('Hinweis 1')).toBeVisible();
  fireEvent.change(editor, { target: { value: 'print(2)' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ausführen & prüfen' }));
  expect(
    await within(screen.getByRole('region', { name: 'Ausgabe und Prüfungen' })).findByText(
      'Mit Hilfe geübt',
    ),
  ).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: /Nächste Lektion/ }));
  await waitFor(() => expect(screen.getByLabelText('Python-Code')).not.toHaveValue('print(2)'));
  expect(screen.getByRole('heading', { level: 2, name: lessons[1].title })).toHaveFocus();
});

test('navigation cancels a pending run and a late result cannot pass another lesson', async () => {
  let finish!: (value: unknown) => void;
  runtime.run.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  render(<App initialPage="Lernraum" />);
  fireEvent.click(screen.getByRole('button', { name: 'Ausführen & prüfen' }));
  expect(screen.getByRole('button', { name: /Python lädt/ })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: /Lernpfad/ }));
  expect(runtime.cancel).toHaveBeenCalled();
  finish({
    output: 'late',
    checks: [{ label: 'Stimmt', passed: true, actual: '2', expected: '2' }],
  });
  fireEvent.click(screen.getByRole('button', { name: 'Lernraum' }));
  await waitFor(() => expect(screen.queryByText('late')).not.toBeInTheDocument());
  expect(screen.queryByText('Selbstständig gelöst')).not.toBeInTheDocument();
});

test('the entire chapter can be completed, with transfer tasks and unique lesson totals', async () => {
  runtime.run.mockImplementation(async (_code, lesson) => ({
    output: 'Ausgabe',
    checks: lesson.checks.map((check: { label: string }) => ({
      label: check.label,
      passed: true,
      actual: 'ok',
      expected: 'ok',
    })),
  }));
  render(<App initialPage="Lernraum" />);
  for (const [index, lesson] of lessons.entries()) {
    expect(screen.getByRole('heading', { level: 2, name: lesson.title })).toBeVisible();
    if (lesson.transfer)
      expect(screen.getAllByText('Transferaufgabe', { exact: true })[0]).toBeVisible();
    fireEvent.change(
      screen.getByLabelText(lesson.language === 'sql' ? 'SQL-Code' : 'Python-Code'),
      { target: { value: lesson.solution } },
    );
    fireEvent.change(screen.getByLabelText('Deine Reflexion'), {
      target: { value: 'Der Befund braucht einen Vergleich und mehr Kontext.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Ausführen & prüfen' }));
    expect(
      await within(screen.getByRole('region', { name: 'Ausgabe und Prüfungen' })).findByText(
        'Selbstständig gelöst',
      ),
    ).toBeVisible();
    expect(screen.getByRole('progressbar', { name: 'Bestandene Lektionen' })).toHaveAttribute(
      'value',
      String(index + 1),
    );
    if (index < lessons.length - 1)
      fireEvent.click(screen.getByRole('button', { name: /Nächste Lektion/ }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Ausführen & prüfen' }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Ausführen & prüfen' })).toBeEnabled(),
  );
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', String(lessons.length));
  expect(screen.getByText(/Codeprüfung bewertet die Reflexion nicht/)).toBeVisible();
}, 30000);

test('code, hint, solution, reflection and selection survive a remount; invalid imports preserve them', async () => {
  const first = render(<App initialPage="Lernraum" />);
  const secondLesson = lessons[1];
  fireEvent.click(lessonButton(secondLesson.title));
  fireEvent.change(screen.getByLabelText('Python-Code'), {
    target: { value: '# Mein eigener Code' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Nächsten Hinweis zeigen' }));
  fireEvent.click(screen.getByRole('button', { name: 'Musterlösung aufdecken' }));
  fireEvent.change(screen.getByLabelText('Deine Reflexion'), {
    target: { value: 'Spielzeit allein erklärt nicht die Rolle.' },
  });
  first.unmount();
  render(<App initialPage="Lernraum" />);
  expect(screen.getByRole('heading', { name: secondLesson.title })).toBeVisible();
  expect(screen.getByLabelText('Python-Code')).toHaveValue('# Mein eigener Code');
  expect(screen.getByLabelText('Deine Reflexion')).toHaveValue(
    'Spielzeit allein erklärt nicht die Rolle.',
  );
  expect(screen.getByText('Hinweis 1')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Musterlösung aufdecken' })).toBeDisabled();
  const file = new File(['broken'], 'backup.json', {
    type: 'application/json',
  });
  Object.defineProperty(file, 'text', { value: async () => 'broken' });
  fireEvent.change(screen.getByLabelText('Fortschritt importieren'), {
    target: { files: [file] },
  });
  expect(await screen.findByRole('status')).toHaveTextContent(/Ungültiges Backup/);
  expect(screen.getByLabelText('Python-Code')).toHaveValue('# Mein eigener Code');
  expect(screen.getByLabelText('Deine Reflexion')).toHaveValue(
    'Spielzeit allein erklärt nicht die Rolle.',
  );
});

test('a storage failure is visible and progress can still be edited', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Storage full');
  });
  render(<App initialPage="Lernraum" />);
  expect(screen.getByRole('alert')).toHaveTextContent(/nicht lokal gespeichert/);
  fireEvent.change(screen.getByLabelText('Python-Code'), {
    target: { value: 'print("weiterlernen")' },
  });
  expect(screen.getByLabelText('Python-Code')).toHaveValue('print("weiterlernen")');
  expect(screen.getByRole('button', { name: 'Exportieren' })).toBeEnabled();
});

test('a valid backup restores its lesson and can be exported again', async () => {
  const createURL = vi.fn(() => 'blob:backup');
  const originalCreateURL = URL.createObjectURL;
  const originalRevokeURL = URL.revokeObjectURL;
  URL.createObjectURL = createURL;
  URL.revokeObjectURL = vi.fn();
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  try {
    render(<App initialPage="Lernraum" />);
    const targetLesson = lessons[2];
    const backup = {
      version: 1,
      selectedLesson: targetLesson.id,
      lessons: {
        [targetLesson.id]: {
          code: '# importierter Code',
          hintLevel: 1,
          solutionViewed: false,
          passed: false,
          reflection: 'Noch prüfen.',
        },
      },
    };
    const file = new File([], 'matchplan.json', { type: 'application/json' });
    Object.defineProperty(file, 'text', {
      value: async () => JSON.stringify(backup),
    });
    fireEvent.change(screen.getByLabelText('Fortschritt importieren'), {
      target: { files: [file] },
    });
    expect(await screen.findByRole('status')).toHaveTextContent('Fortschritt importiert');
    expect(screen.getByRole('heading', { name: targetLesson.title })).toBeVisible();
    expect(screen.getByLabelText('Python-Code')).toHaveValue('# importierter Code');
    expect(screen.getByLabelText('Deine Reflexion')).toHaveValue('Noch prüfen.');
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole('button', { name: 'Exportieren' }));
    expect(createURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledOnce();
    expect(click.mock.instances[0]).toHaveAttribute('download', 'matchplan-fortschritt.json');
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:backup');
  } finally {
    vi.useRealTimers();
    URL.createObjectURL = originalCreateURL;
    URL.revokeObjectURL = originalRevokeURL;
  }
});

test('runtime errors permit retry and cancellation keeps the editor usable', async () => {
  runtime.run.mockRejectedValueOnce(new Error('Python konnte nicht geladen werden.'));
  render(<App initialPage="Lernraum" />);
  fireEvent.click(screen.getByRole('button', { name: 'Ausführen & prüfen' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Python konnte nicht geladen werden.');
  runtime.run.mockImplementation(() => new Promise(() => {}));
  fireEvent.click(screen.getByRole('button', { name: 'Ausführen & prüfen' }));
  fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Ausführung abgebrochen');
  expect(screen.getByLabelText('Python-Code')).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Ausführen & prüfen' })).toBeEnabled();
});

test(
  'learners can inspect the fictional data already loaded for every data-based task',
  { timeout: 20000 },
  () => {
    render(<App initialPage="Lernraum" />);
    for (const lesson of lessons.filter((item) => item.setup)) {
      fireEvent.click(screen.getByRole('button', { name: 'Lernpfad' }));
      fireEvent.click(lessonButton(lesson.title));
      const data = screen.getByRole('region', { name: 'Geladene Übungsdaten' });
      fireEvent.click(within(data).getByText('Geladene Übungsdaten'));
      expect(
        within(data).getByText(lesson.dataPreview ?? lesson.setup!, { normalizer: (text) => text }),
      ).toBeVisible();
      expect(within(data).getByText(/stehen deinem Code bereits zur Verfügung/)).toBeVisible();
    }
  },
);
test('unreadable stored progress is preserved until an explicit recovery choice', () => {
  const raw = '{"version":1,"lessons":';
  localStorage.setItem('matchplan-academy-v1', raw);
  render(<App initialPage="Lernraum" />);
  expect(screen.getByRole('alert')).toHaveTextContent('unlesbar');
  fireEvent.change(screen.getByLabelText('Python-Code'), {
    target: { value: '# neuer Versuch' },
  });
  expect(localStorage.getItem('matchplan-academy-v1')).toBe(raw);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Diesen Lernstand stattdessen speichern',
    }),
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('matchplan-academy-v1')!).lessons.anpfiff.code).toBe(
    '# neuer Versuch',
  );
});

test('all course sections are usable and the path searches across tracks', () => {
  render(<App initialPage="Lernraum" />);
  for (const name of ['Lernraum', 'Lernpfad', 'Projekte', 'Wiederholen', 'Abschluss'])
    expect(screen.getByRole('button', { name })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Lernpfad' }));
  fireEvent.change(screen.getByLabelText('Lektionen durchsuchen'), {
    target: { value: lessons[0].title },
  });
  expect(screen.getByRole('button', { name: new RegExp(lessons[0].title) })).toBeVisible();
});

test('resetting code requires confirmation and can be cancelled', () => {
  render(<App initialPage="Lernraum" />);
  fireEvent.change(screen.getByLabelText('Python-Code'), {
    target: { value: '# behalten' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Code neu starten' }));
  fireEvent.click(screen.getByRole('button', { name: 'Code behalten' }));
  expect(screen.getByLabelText('Python-Code')).toHaveValue('# behalten');
  fireEvent.click(screen.getByRole('button', { name: 'Code neu starten' }));
  fireEvent.click(screen.getByRole('button', { name: 'Startcode wiederherstellen' }));
  expect(screen.getByLabelText('Python-Code')).toHaveValue(lessons[0].starter);
});

test.runIf(
  lessons.some((l) => l.trackId && l.trackId !== 'python') && lessons.some((l) => l.reviewOf),
)('the course path reaches another track and review tasks link back to their foundation', () => {
  render(<App initialPage="Lernraum" />);
  const target = lessons.find((lesson) => lesson.trackId && lesson.trackId !== 'python')!;
  expect(target).toBeDefined();
  fireEvent.click(screen.getByRole('button', { name: 'Lernpfad' }));
  expect(
    screen.getByText(tracks.find((track) => track.id === target.trackId)!.description, {
      exact: false,
    }),
  ).toBeVisible();
  fireEvent.change(screen.getByLabelText('Lektionen durchsuchen'), {
    target: { value: target.title },
  });
  fireEvent.click(lessonButton(target.title));
  expect(screen.getByRole('heading', { level: 2, name: target.title })).toHaveFocus();
  expect(screen.getByLabelText(target.language === 'sql' ? 'SQL-Code' : 'Python-Code')).toHaveValue(
    target.starter,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Wiederholen' }));
  const review = lessons.find((lesson) => lesson.reviewOf)!;
  expect(review).toBeDefined();
  fireEvent.click(
    screen.getByRole('button', {
      name: `Wiederholung öffnen: ${review.title}`,
    }),
  );
  expect(screen.getByRole('heading', { level: 2, name: review.title })).toHaveFocus();
});

test('a project saves its report and notes, requires real work, and exports its current state', async () => {
  runtime.run.mockResolvedValue({
    output: 'Analyse fertig',
    checks: [{ label: 'Projektprüfung', passed: true, actual: 'ok', expected: 'ok' }],
  });
  const createURL = vi.fn(() => 'blob:portfolio');
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = createURL;
      static revokeObjectURL = vi.fn();
    },
  );
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const report =
    'Unsere konkrete Fußballfrage untersucht die Verteilung der Abschlüsse. Die ausgewerteten Daten liefern Hinweise für die nächste Videosichtung. Die Stichprobe ist klein; Einsatzzeit, Gegnerstärke und Rollen müssen wir vor einer Entscheidung gesondert prüfen.';
  const project = projects[0];
  const first = render(<App initialPage="Lernraum" />);
  fireEvent.click(screen.getByRole('button', { name: 'Projekte' }));
  fireEvent.click(screen.getByRole('button', { name: `Projekt öffnen: ${project.title}` }));
  expect(screen.getByLabelText('Dein Projektbericht')).toHaveValue(project.reportTemplate);
  expect(screen.getByText(/Projekt in Arbeit/)).toBeVisible();
  fireEvent.change(screen.getByLabelText('Dein Projektbericht'), {
    target: {
      value: report,
    },
  });
  fireEvent.change(screen.getByLabelText('Arbeitsnotizen'), {
    target: { value: 'Videoclips und Vergleichsgruppe ergänzen.' },
  });
  for (const milestone of project.milestones)
    fireEvent.click(screen.getByLabelText(milestone.title));
  fireEvent.click(
    screen.getByLabelText('Ich habe meinen Bericht anhand der Kriterien selbst geprüft.'),
  );
  expect(screen.getByText(/Projekt in Arbeit/)).toBeVisible();
  fireEvent.change(screen.getByLabelText('Python-Code'), {
    target: { value: project.lesson.solution },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Ausführen & prüfen' }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Ausführen & prüfen' })).toBeEnabled(),
  );
  fireEvent.click(
    screen.getByLabelText('Ich habe meinen Bericht anhand der Kriterien selbst geprüft.'),
  );
  expect(screen.getByText('Projekt abgeschlossen · selbst geprüft')).toBeVisible();
  vi.useFakeTimers();
  fireEvent.click(screen.getByRole('button', { name: 'Projekt als ZIP exportieren' }));
  expect(createURL).toHaveBeenCalledWith(expect.any(Blob));
  expect(click.mock.instances[0]).toHaveAttribute('download', expect.stringMatching(/\.zip$/));
  first.unmount();
  render(<App initialPage="Lernraum" />);
  fireEvent.click(screen.getByRole('button', { name: 'Projekte' }));
  fireEvent.click(screen.getByRole('button', { name: `Projekt öffnen: ${project.title}` }));
  expect(screen.getByLabelText('Arbeitsnotizen')).toHaveValue(
    'Videoclips und Vergleichsgruppe ergänzen.',
  );
  expect(screen.getByLabelText('Dein Projektbericht')).toHaveValue(report);
  expect(
    screen.getByLabelText('Ich habe meinen Bericht anhand der Kriterien selbst geprüft.'),
  ).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: 'Abschluss' }));
  expect(screen.getByText(/keine Zertifizierung/)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Portfolio als ZIP exportieren' }));
  expect(click).toHaveBeenCalledTimes(2);
  vi.runAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

test('selecting the current lesson focuses its heading and figures have accessible download links', async () => {
  runtime.run.mockResolvedValue({
    output: '',
    checks: [],
    figures: ['PHN2Zy8+'],
  });
  render(<App initialPage="Lernraum" />);
  fireEvent.click(lessonButton(lessons[0].title));
  expect(screen.getByRole('heading', { level: 2, name: lessons[0].title })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Ausführen & prüfen' }));
  expect(await screen.findByRole('img', { name: new RegExp('Analyse-Grafik 1') })).toHaveAttribute(
    'src',
    'data:image/svg+xml;base64,PHN2Zy8+',
  );
  expect(screen.getByRole('link', { name: 'Grafik 1 herunterladen (SVG)' })).toHaveAttribute(
    'download',
    `matchplan-${lessons[0].id}-1.svg`,
  );
});
