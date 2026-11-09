import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { CourseReader } from './CourseReader';
import type { StudyChapter } from '../course-study';

const first: StudyChapter = {
  id: 'foundations',
  trackId: 'data',
  title: 'Daten verstehen',
  lead: 'Vom Spiel zur guten Frage.',
  sections: [
    {
      title: 'Beobachtung und Aussage',
      paragraphs: ['Ein Messwert braucht Kontext.', 'Eine Frage bestimmt die Analyse.'],
    },
  ],
  questions: ['Was kann diese Zahl erklären?'],
  build: {
    title: 'Analyse im Repository',
    url: 'https://example.org/repo',
    brief: 'Untersuche die vorhandene Datenpipeline.',
    acceptance: ['Beschreibe die Eingabedaten.'],
  },
  media: [
    {
      title: 'Grundlagen als Playlist',
      url: 'https://www.youtube.com/playlist?list=PLfootball',
      action: 'Ansehen',
      environment: 'YouTube',
      kind: 'Tutorial',
    },
    {
      title: 'Begleitbuch',
      url: 'https://example.org/book.pdf',
      action: 'Lesen',
      environment: 'Browser',
      kind: 'Optionale Vertiefung',
    },
  ],
  practiceIds: ['data-01'],
  projectId: 'analysis-project',
};
const second = { ...first, id: 'models', title: 'Modelle verstehen', lead: 'Eine Annahme prüfen.' };
function props() {
  return {
    chapters: [first, second],
    notes: {},
    completed: [],
    onPractice: vi.fn(),
    onProject: vi.fn(),
    onNote: vi.fn(),
    onComplete: vi.fn(),
  };
}

test('notes and studied status belong to the current chapter and require explicit input', () => {
  const callbacks = props();
  const { rerender } = render(
    <CourseReader
      {...callbacks}
      initialChapterId={first.id}
      notes={{ foundations: 'Meine Frage' }}
    />,
  );
  expect(callbacks.onComplete).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Deine Notizen')).toHaveValue('Meine Frage');
  fireEvent.change(screen.getByLabelText('Deine Notizen'), {
    target: { value: 'Eine neue Beobachtung' },
  });
  expect(callbacks.onNote).toHaveBeenLastCalledWith('foundations', 'Eine neue Beobachtung');
  expect(screen.getByLabelText('Deine Notizen')).toHaveAttribute('maxlength', '20000');
  fireEvent.click(screen.getByRole('checkbox', { name: 'Als studiert markieren' }));
  expect(callbacks.onComplete).toHaveBeenLastCalledWith('foundations', true);
  rerender(<CourseReader {...callbacks} initialChapterId={first.id} completed={['foundations']} />);
  expect(screen.getByRole('checkbox', { name: 'Als studiert markieren' })).toBeChecked();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Als studiert markieren' }));
  expect(callbacks.onComplete).toHaveBeenLastCalledWith('foundations', false);
  fireEvent.click(screen.getByRole('button', { name: /Nächstes Kapitel/ }));
  fireEvent.change(screen.getByLabelText('Deine Notizen'), { target: { value: 'Modellnotiz' } });
  expect(callbacks.onNote).toHaveBeenLastCalledWith('models', 'Modellnotiz');
});

test('opens with an ordered overview and navigation never marks chapters studied', () => {
  const callbacks = props();
  render(<CourseReader {...callbacks} completed={['models']} />);
  expect(screen.queryByLabelText('Deine Notizen')).not.toBeInTheDocument();
  expect(screen.getByText('1 von 2 selbst als studiert markiert')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: /Daten verstehen/ }));
  expect(screen.getByRole('heading', { level: 1, name: 'Daten verstehen' })).toHaveFocus();
  fireEvent.change(screen.getByLabelText('Kapitel wechseln'), { target: { value: 'models' } });
  expect(screen.getByRole('heading', { level: 1, name: 'Modelle verstehen' })).toHaveFocus();
  fireEvent.change(screen.getByLabelText('Kapitel wechseln'), { target: { value: 'foundations' } });
  expect(screen.getByText('Ein Messwert braucht Kontext.')).toBeVisible();
  expect(screen.getByText('Eine Frage bestimmt die Analyse.')).toBeVisible();
  expect(screen.getByRole('navigation', { name: 'In diesem Kapitel' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: /Nächstes Kapitel/ }));
  expect(screen.getByRole('heading', { level: 1, name: 'Modelle verstehen' })).toBeVisible();
  expect(screen.getByRole('checkbox', { name: 'Als studiert markieren' })).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: /Vorheriges Kapitel/ }));
  expect(screen.getByRole('heading', { level: 1, name: 'Daten verstehen' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: /Kursübersicht/ }));
  expect(screen.queryByLabelText('Deine Notizen')).not.toBeInTheDocument();
  expect(callbacks.onComplete).not.toHaveBeenCalled();
});

test('loads a privacy-enhanced playlist only after opt-in and keeps external resources available', () => {
  render(<CourseReader {...props()} initialChapterId={first.id} />);
  expect(screen.queryByTitle('YouTube-Playlist: Grundlagen als Playlist')).not.toBeInTheDocument();
  const playlist = screen.getByRole('link', { name: /Grundlagen als Playlist/ });
  expect(playlist).toHaveAttribute('href', first.media[0].url);
  expect(playlist).toHaveAttribute('target', '_blank');
  expect(screen.getByRole('link', { name: /Begleitbuch/ })).toHaveAttribute(
    'href',
    first.media[1].url,
  );
  expect(screen.getByText('Optionale Vertiefung · Browser')).toBeVisible();
  expect(screen.getByText('Lesen')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Video hier ansehen' }));
  const video = screen.getByTitle('YouTube-Playlist: Grundlagen als Playlist');
  expect(video).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/videoseries?list=PLfootball',
  );
  expect(video).toHaveAttribute('allowfullscreen');
  fireEvent.click(screen.getByRole('button', { name: /Nächstes Kapitel/ }));
  expect(screen.queryByTitle('YouTube-Playlist: Grundlagen als Playlist')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Video hier ansehen' })).toBeVisible();
});

test('hands optional practice and project actions back to the host without changing completion', () => {
  const callbacks = props();
  render(<CourseReader {...callbacks} initialChapterId={first.id} />);
  expect(screen.getByRole('link', { name: /Codebasis öffnen/ })).toHaveAttribute(
    'href',
    first.build.url,
  );
  expect(screen.getByText('Beschreibe die Eingabedaten.')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Übung öffnen: data-01' }));
  expect(callbacks.onPractice).toHaveBeenCalledExactlyOnceWith('data-01');
  fireEvent.click(screen.getByRole('button', { name: 'Projekt öffnen' }));
  expect(callbacks.onProject).toHaveBeenCalledExactlyOnceWith('analysis-project');
  expect(callbacks.onComplete).not.toHaveBeenCalled();
});

test('caps persisted notes at 20,000 characters and follows host-provided note updates', () => {
  const callbacks = props();
  const { rerender } = render(<CourseReader {...callbacks} initialChapterId={first.id} />);
  fireEvent.change(screen.getByLabelText('Deine Notizen'), {
    target: { value: 'a'.repeat(20001) },
  });
  expect(callbacks.onNote).toHaveBeenLastCalledWith('foundations', 'a'.repeat(20000));
  rerender(
    <CourseReader
      {...callbacks}
      initialChapterId={first.id}
      notes={{ foundations: 'Gespeichert' }}
    />,
  );
  expect(screen.getByLabelText('Deine Notizen')).toHaveValue('Gespeichert');
});

test('invalid initial chapters fall back to overview and empty courses remain usable', () => {
  const callbacks = props();
  const { rerender } = render(<CourseReader {...callbacks} initialChapterId="unknown" />);
  expect(screen.getByRole('heading', { name: 'Der Lernpfad' })).toBeVisible();
  rerender(<CourseReader {...callbacks} chapters={[]} />);
  expect(
    screen.getByText('Die Kapitel werden hier angezeigt, sobald sie verfügbar sind.'),
  ).toBeVisible();
  expect(screen.queryByRole('button', { name: /Mit dem ersten Kapitel/ })).not.toBeInTheDocument();
});

test('search finds a chapter by its explanation and keeps the original chapter number', () => {
  const callbacks = props();
  const enriched = {
    ...second,
    sections: [
      {
        title: 'Datenvertrag',
        paragraphs: ['Eine Quarantänetabelle enthält abgewiesene Events.'],
        example: {
          code: 'print(2 + 3)',
          expected: '5',
          explanation: 'Beide Werte werden addiert.',
        },
      },
    ],
  };
  render(<CourseReader {...callbacks} chapters={[first, enriched]} />);
  fireEvent.change(screen.getByRole('searchbox', { name: 'Im Lernstoff suchen' }), {
    target: { value: 'Quarantänetabelle' },
  });
  expect(screen.getByRole('status')).toHaveTextContent('1 passende Kapitel');
  expect(screen.queryByRole('button', { name: /Daten verstehen/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Modelle verstehen/ }));
  expect(screen.getByText('Kapitel 2 von 2')).toBeVisible();
  expect(screen.getByText('print(2 + 3)')).toBeVisible();
  expect(screen.getByText('5')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Kapitel als Arbeitsmappe laden' })).toBeVisible();
});
