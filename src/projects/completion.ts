import type { Progress, ProjectDefinition, ProjectProgress } from '../types';
import { lessons } from '../content';
import { projects } from './catalog';

export function getProjectProgress(p: Progress, id: string): ProjectProgress {
  return (
    p.projects?.[id] ?? {
      report: projects.find((project) => project.id === id)?.reportTemplate ?? '',
      notes: '',
      milestones: [],
      reviewed: false,
    }
  );
}

export function isProjectComplete(project: ProjectDefinition, p: Progress): boolean {
  const state = getProjectProgress(p, project.id);
  return (
    !!p.lessons[project.lesson.id]?.passed &&
    state.reviewed &&
    state.report.trim().length >= 80 &&
    state.report.trim() !== project.reportTemplate.trim() &&
    project.milestones.every((m) => state.milestones.includes(m.id))
  );
}

export interface Completion {
  passedLessons: number;
  totalLessons: number;
  completedProjects: number;
  totalProjects: number;
  ready: boolean;
}

export function getCompletion(p: Progress): Completion {
  const passedLessons = lessons.filter((lesson) => p.lessons[lesson.id]?.passed).length;
  const completedProjects = projects.filter((project) => isProjectComplete(project, p)).length;
  return {
    passedLessons,
    totalLessons: lessons.length,
    completedProjects,
    totalProjects: projects.length,
    ready: passedLessons === lessons.length && completedProjects === projects.length,
  };
}
