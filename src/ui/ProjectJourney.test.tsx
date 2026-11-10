import { useState } from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { kickbaseSteps, previewPlayers } from '../kickbase/course';
import * as course from '../kickbase/course';
import { PROGRESS_LIMITS } from '../learning/progress-codec';
import { ProjectJourney } from './ProjectJourney';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function Harness({ initial = [] }: { initial?: string[] }) {
  const [completed, setCompleted] = useState(initial);
  const [notes, setNotes] = useState<Record<string, string>>({});
  return (
    <ProjectJourney
      completed={completed}
      notes={notes}
      onComplete={(id, checked) =>
        setCompleted((current) =>
          checked ? [...current, id] : current.filter((item) => item !== id),
        )
      }
      onNote={(id, text) => setNotes((current) => ({ ...current, [id]: text }))}
      onPractice={vi.fn()}
      onRead={vi.fn()}
    />
  );
}

test('walks every step, keeps notes and permits revisiting without locking', () => {
  render(<Harness />);
  for (const [index, step] of kickbaseSteps.entries()) {
    expect(screen.getByRole('heading', { name: step.title })).toBeVisible();
    fireEvent.change(screen.getByLabelText('Deine Arbeitsnotizen'), {
      target: { value: `Notiz ${index}` },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Selbst geprüft' }));
    if (index < kickbaseSteps.length - 1)
      fireEvent.click(screen.getByRole('button', { name: 'Nächster Schritt' }));
  }
  expect(screen.getByText('6 von 6 Schritten selbst geprüft')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: `Schritt 1: ${kickbaseSteps[0].title}` }));
  expect(screen.getByLabelText('Deine Arbeitsnotizen')).toHaveValue('Notiz 0');
  expect(screen.getByRole('checkbox', { name: 'Selbst geprüft' })).toBeChecked();
  expect(screen.getByRole('heading', { name: kickbaseSteps[0].title })).toHaveFocus();
});

test('resumes the first unfinished step and progressively reveals help', () => {
  render(<Harness initial={[kickbaseSteps[0].id]} />);
  const step = kickbaseSteps[1];
  expect(screen.getByRole('heading', { name: step.title })).toBeVisible();
  expect(screen.getByText(step.concepts[0].text)).not.toBeVisible();
  fireEvent.click(screen.getByText('Das brauchst du dafür'));
  expect(screen.getByText(step.concepts[0].text)).toBeVisible();
  expect(screen.queryByText(step.hint)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Hinweis anzeigen' }));
  expect(screen.getByText(step.hint)).toBeVisible();
  fireEvent.click(screen.getByText('Wo liegt die Musterlösung?'));
  expect(screen.getByText(/solutions\//)).toBeVisible();
});

test('uses the same numeric values as the fictional data and links relevant theory', () => {
  const onRead = vi.fn();
  const onPractice = vi.fn();
  render(
    <ProjectJourney
      completed={[]}
      notes={{}}
      onComplete={vi.fn()}
      onNote={vi.fn()}
      onPractice={onPractice}
      onRead={onRead}
    />,
  );
  const table = screen.getByRole('table', { name: 'Beispielauswertung: Kickbase' });
  expect(table).toBeVisible();
  expect(screen.getByText('Fiktive Übungsdaten · kein Live-Zugriff')).toBeVisible();
  const player = previewPlayers[0];
  expect(within(table).getByText(player.name)).toBeVisible();
  expect(
    screen.getAllByText(
      (player.points / (player.marketValue / 1_000_000)).toLocaleString('de-DE', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      }),
    ).length,
  ).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: 'Passende Theorie lesen' }));
  expect(onRead).toHaveBeenCalledWith(kickbaseSteps[0].studyChapterId);
  fireEvent.click(screen.getByRole('button', { name: 'Optional: Browserübung 1' }));
  expect(onPractice).toHaveBeenCalledWith(kickbaseSteps[0].practiceIds[0]);
});

test('explains points per million for the selected fictional player', () => {
  render(<Harness />);
  expect(screen.getByRole('radio', { name: 'Mira Nord' })).toBeChecked();
  expect(screen.getByText('points_per_million(80, 4_000_000)')).toBeVisible();
  expect(screen.getByText('Gleiches Verhältnis wie Nora Feld.', { exact: false })).toBeVisible();
  fireEvent.click(screen.getByRole('radio', { name: 'Leon West' }));
  expect(screen.getByRole('radio', { name: 'Mira Nord' })).not.toBeChecked();
  expect(screen.getByText('points_per_million(100, 8_000_000)')).toBeVisible();
  expect(screen.getByText('12.5')).toBeVisible();
  expect(screen.getByText('12,5', { selector: 'strong' })).toBeVisible();
  expect(screen.queryByText('Gleiches Verhältnis', { exact: false })).not.toBeInTheDocument();
});

test('reports clipboard failure and recovers on retry', async () => {
  const writeText = vi
    .fn()
    .mockRejectedValueOnce(new Error('denied'))
    .mockResolvedValueOnce(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Befehl kopieren' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Markiere den Befehl');
  fireEvent.click(screen.getByRole('button', { name: 'Befehl kopieren' }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Befehl kopiert'));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('keeps working notes within the saved progress codec boundary', () => {
  render(<Harness />);
  const notes = screen.getByLabelText('Deine Arbeitsnotizen');
  expect(notes).toHaveAttribute('maxlength', String(PROGRESS_LIMITS.studyNotes));
  fireEvent.change(notes, { target: { value: 'a'.repeat(PROGRESS_LIMITS.studyNotes + 1) } });
  expect(notes).toHaveValue('a'.repeat(PROGRESS_LIMITS.studyNotes));
});

test('downloads a ZIP and cleans up the object URL and temporary link after retry', () => {
  vi.useFakeTimers();
  vi.spyOn(course, 'exportKickbaseStarter').mockReturnValue({
    data: new Uint8Array([80, 75]),
    name: 'starter.zip',
  });
  const create = vi
    .fn()
    .mockImplementationOnce(() => {
      throw new Error('download unavailable');
    })
    .mockReturnValue('blob:starter');
  const revoke = vi.fn();
  vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke });
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Starterprojekt herunterladen' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Bitte versuche es erneut');
  fireEvent.click(screen.getByRole('button', { name: 'Starterprojekt herunterladen' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(create).toHaveBeenCalledWith(expect.any(Blob));
  expect(click).toHaveBeenCalledOnce();
  expect(document.querySelector('a[download]')).toBeNull();
  act(() => vi.advanceTimersByTime(1000));
  expect(revoke).toHaveBeenCalledWith('blob:starter');
});
