import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { lessons } from '../content';
import { Workspace } from './Workspace';

test('tasks stay visible while background and reference material are opt-in', () => {
  const lesson = {
    ...lessons[0],
    explanation: ['Erste Erklärung.', 'Zweite Erklärung.', 'Zusätzlicher Hintergrund.'],
    objective: 'Ein Ergebnis begründen.',
    task: 'Prüfe z. B. `print("Tor. Weiter")`. Begründe deinen Befund.',
    setup: 'tore = [1, 2]',
    example: 'print(42)',
  };
  const current = {
    code: lesson.starter,
    hintLevel: 0,
    solutionViewed: false,
    passed: false,
    reflection: 'Eigener Befund',
  };
  const props = {
    lesson,
    current,
    busy: false,
    result: null,
    error: '',
    heading: null,
    update: vi.fn(),
    execute: vi.fn(),
    cancel: vi.fn(),
    select: vi.fn(),
    lessons,
  };
  const { rerender } = render(<Workspace {...props} />);

  const tasks = screen.getByRole('region', { name: 'Aufgaben' });
  expect(within(tasks).getByRole('listitem')).toHaveTextContent(lesson.task);
  expect(within(tasks).getByText(lesson.task)).toBeVisible();
  expect(screen.getByText('Erste Erklärung.')).toBeVisible();
  expect(screen.getByText('Zweite Erklärung.')).not.toBeVisible();
  expect(screen.getByText('Zusätzlicher Hintergrund.')).not.toBeVisible();
  expect(screen.getByText('Ein Ergebnis begründen.', { exact: false })).not.toBeVisible();
  expect(screen.getByText(lesson.example, { normalizer: (text) => text })).not.toBeVisible();
  expect(screen.getByLabelText('Deine Reflexion')).not.toBeVisible();
  expect(screen.getByRole('region', { name: 'Geladene Übungsdaten' })).toBeVisible();

  fireEvent.click(screen.getByText('Nachschlagen', { exact: true }));
  fireEvent.click(screen.getByText('Hintergrund & Lernziel'));
  expect(screen.getByText('Zusätzlicher Hintergrund.')).toBeVisible();
  fireEvent.click(screen.getByText('Beispiel lesen'));
  expect(screen.getByText(lesson.example, { normalizer: (text) => text })).toBeVisible();
  rerender(<Workspace {...props} current={{ ...current, passed: true }} />);
  expect(screen.getByLabelText('Deine Reflexion')).toBeVisible();
  expect(screen.getByLabelText('Deine Reflexion')).toHaveValue('Eigener Befund');
});
