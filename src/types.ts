export interface Check {
  label: string;
  expression: string;
  expected: unknown;
  source?: 'stdout';
  raises?: string;
}
export interface Lesson {
  level?: 'Einstieg' | 'Aufbau' | 'Praxis';
  dataPreview?: string;
  id: string;
  title: string;
  minutes: number;
  concept: string;
  explanation: string[];
  example: string;
  task: string;
  starter: string;
  solution: string;
  hints: string[];
  checks: Check[];
  reflection: string;
  rubric: string[];
  transfer?: boolean;
  setup?: string;
  variants?: { label: string; setup: string; checks: Check[] }[];
  objective?: string;
  prerequisites?: string[];
  sources?: { title: string; url: string }[];
  trackId?: string;
  language?: 'python' | 'sql';
  packages?: string[];
  reviewOf?: string;
  exampleNote?: string;
}
export interface LessonProgress {
  code: string;
  hintLevel: number;
  solutionViewed: boolean;
  passed: boolean;
  reflection: string;
}
export interface ProjectProgress {
  report: string;
  notes: string;
  milestones: string[];
  reviewed: boolean;
  completedAt?: string;
}
export interface Progress {
  study?: { notes: Record<string, string>; completed: string[] };
  version: 1;
  selectedLesson: string;
  lessons: Record<string, LessonProgress>;
  projects?: Record<string, ProjectProgress>;
}
export interface CheckResult {
  label: string;
  passed: boolean;
  actual: string;
  expected: string;
}
export interface RunResult {
  output: string;
  checks: CheckResult[];
  error?: string;
  figures?: string[];
}
export interface Runner {
  run(code: string, lesson: Lesson): Promise<RunResult>;
  cancel(): void;
  dispose(): void;
}
export interface Track {
  id: string;
  title: string;
  description: string;
  available: boolean;
  outcome: string;
  projectId?: string;
}
export interface ProjectDefinition {
  id: string;
  title: string;
  subtitle: string;
  question: string;
  brief: string[];
  prerequisites: string[];
  milestones: {
    id: string;
    title: string;
    description: string;
    deliverable: string;
    criteria: string[];
  }[];
  rubric: string[];
  lesson: Lesson;
  files: { name: string; content: string }[];
  reportTemplate: string;
  limitations: string[];
}
