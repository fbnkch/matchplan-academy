import { zipSync, strToU8 } from 'fflate';
import type { Progress, ProjectDefinition } from '../types';
import { getLessonProgress, exportProgress } from '../progress';
import { projects } from './catalog';
import { getProjectProgress, isProjectComplete, getCompletion } from './completion';
import { projectReadme } from './readme';

function buildProjectFiles(
  project: ProjectDefinition,
  progress: Progress,
): Record<string, Uint8Array> {
  const projectProgress = getProjectProgress(progress, project.id),
    lessonProgress = getLessonProgress(progress, project.lesson);
  const files: Record<string, Uint8Array> = {};
  for (const file of project.files) files[file.name] = strToU8(file.content);
  const dataFile = project.files.find((file) => file.name.endsWith('.csv'))!;
  const dataVariableByProject: Record<string, string> = {
    spielbericht: 'events',
    'xg-modell': 'shots',
    'scouting-app': 'players',
    aktionswerte: 'actions',
  };
  const dataLoadingCode = `from pathlib import Path\nimport pandas as pd\n${dataVariableByProject[project.id]} = pd.read_csv(Path(__file__).parent / ${JSON.stringify(dataFile.name)})\n`;
  const saveFiguresCode =
    '\n# Grafiken als Dateien sichern.\nimport sys as _sys\nif "matplotlib.pyplot" in _sys.modules:\n    _plt = _sys.modules["matplotlib.pyplot"]\n    for _number in _plt.get_fignums():\n        _plt.figure(_number).savefig(Path(__file__).parent / f"grafik-{_number}.png", dpi=160, bbox_inches="tight")\n';
  files['analyse.py'] = strToU8(
    dataLoadingCode + '\n' + lessonProgress.code + '\n' + saveFiguresCode,
  );
  files['reference_solution.py'] = strToU8(
    dataLoadingCode + '\n' + project.lesson.solution + '\n' + saveFiguresCode,
  );
  files['BERICHT.md'] = strToU8(projectProgress.report);
  files['NOTIZEN.md'] = strToU8(projectProgress.notes);
  files['README.md'] = strToU8(projectReadme(project));
  files['ANNAHMEN.md'] = strToU8(
    '# Annahmen und Entscheidungen\n\n| Entscheidung | Begründung | Alternative | Auswirkung |\n|---|---|---|---|\n| [z. B. Minutenfilter] | [warum] | [was sonst] | [wie prüfen] |\n\n## KI-Nutzung und eigene Prüfung\n[Welche Hilfe wurde genutzt? Was wurde danach ohne Vorlage geprüft?]\n',
  );
  files['checkliste.json'] = strToU8(
    JSON.stringify(
      {
        milestones: projectProgress.milestones,
        reviewed: projectProgress.reviewed,
        codeChecksPassed: lessonProgress.passed,
        completed: isProjectComplete(project, progress),
        note: 'Selbstprüfung; keine externe Zertifizierung.',
      },
      null,
      2,
    ),
  );
  files['requirements.txt'] ??= strToU8(
    'pandas==3.0.2\nnumpy==2.4.6\nmatplotlib==3.10.8\nscikit-learn==1.8.0\n',
  );
  files['analyse.ipynb'] = strToU8(
    JSON.stringify(
      {
        nbformat: 4,
        nbformat_minor: 5,
        metadata: {
          kernelspec: {
            display_name: 'Python 3',
            language: 'python',
            name: 'python3',
          },
        },
        cells: [
          {
            id: 'bericht',
            cell_type: 'markdown',
            metadata: {},
            source: projectProgress.report,
          },
          {
            id: 'analyse',
            cell_type: 'code',
            metadata: {},
            execution_count: null,
            outputs: [],
            source: (project.lesson.setup ?? '') + '\n\n' + lessonProgress.code,
          },
        ],
      },
      null,
      2,
    ),
  );
  return files;
}

export interface ProjectArchive {
  name: string;
  data: Uint8Array;
}

export function exportProject(project: ProjectDefinition, progress: Progress): ProjectArchive {
  return {
    name: `matchplan-${project.id}.zip`,
    data: zipSync(buildProjectFiles(project, progress)),
  };
}

export function exportPortfolio(progress: Progress): ProjectArchive {
  const files: Record<string, Uint8Array> = {};
  for (const project of projects)
    for (const [relativePath, fileBytes] of Object.entries(buildProjectFiles(project, progress)))
      files[`${project.id}/${relativePath}`] = fileBytes;
  const completion = getCompletion(progress);
  files['INDEX.md'] = strToU8(
    `# Matchplan-Portfolio\n\n${completion.passedLessons}/${completion.totalLessons} Lektionen geprüft, ${completion.completedProjects}/${completion.totalProjects} Projekte nach persönlicher Checkliste abgeschlossen.\n\n${projects.map((project) => `- [${project.title}](${project.id}/README.md): ${isProjectComplete(project, progress) ? 'Checkliste abgeschlossen' : 'in Arbeit'}`).join('\n')}\n\nDieser Export enthält Übungsdaten, Code und eigene Berichte. Er ist keine fachliche Zertifizierung und kein Beleg für Berufserfahrung. Die Projekt-READMEs erklären die Übertragung auf reale Daten.\n`,
  );
  files['lernfortschritt.json'] = strToU8(exportProgress(progress));
  return { name: 'matchplan-portfolio.zip', data: zipSync(files) };
}
