import type { Progress, ProjectDefinition, ProjectProgress } from '../types';
import { lessons } from '../content';
import { projects } from './catalog';

export function getProjectProgress(progress: Progress, projectId: string): ProjectProgress {
  return (
    progress.projects?.[projectId] ?? {
      report: projects.find((project) => project.id === projectId)?.reportTemplate ?? '',
      notes: '',
      milestones: [],
      reviewed: false,
    }
  );
}

export function isProjectComplete(project: ProjectDefinition, progress: Progress): boolean {
  const projectProgress = getProjectProgress(progress, project.id);
  return (
    !!progress.lessons[project.lesson.id]?.passed &&
    projectProgress.reviewed &&
    projectProgress.report.trim().length >= 80 &&
    projectProgress.report.trim() !== project.reportTemplate.trim() &&
    project.milestones.every((milestone) => projectProgress.milestones.includes(milestone.id))
  );
}

export interface Completion {
  passedLessons: number;
  totalLessons: number;
  completedProjects: number;
  totalProjects: number;
  ready: boolean;
}

export function getCompletion(progress: Progress): Completion {
  const passedLessons = lessons.filter((lesson) => progress.lessons[lesson.id]?.passed).length;
  const completedProjects = projects.filter((project) =>
    isProjectComplete(project, progress),
  ).length;
  return {
    passedLessons,
    totalLessons: lessons.length,
    completedProjects,
    totalProjects: projects.length,
    ready: passedLessons === lessons.length && completedProjects === projects.length,
  };
}
