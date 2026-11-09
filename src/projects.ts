// Stable public entry point; implementation modules depend on each other directly.
export { projects } from './projects/catalog';
export { getProjectProgress, isProjectComplete, getCompletion } from './projects/completion';
export { exportProject, exportPortfolio } from './projects/archive';
