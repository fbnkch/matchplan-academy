import { zipSync, strToU8 } from 'fflate';
import type { StudyChapter } from '../course-study';

/** Original course examples and learner notes, not a copy of upstream repositories. */
export function exportStudyWorkbook(chapter: StudyChapter, notes = '') {
  const referenceExamples = chapter.sections.flatMap((section) =>
    section.example ? [{ title: section.title, ...section.example }] : [],
  );
  const workbookMarkdown = [
    `# ${chapter.title}`,
    chapter.lead,
    ...chapter.sections.flatMap((section) => [
      `## ${section.title}`,
      ...section.paragraphs,
      ...(section.commands ?? []).map((entry) => `- \`${entry.command}\`: ${entry.purpose}`),
      ...(section.example
        ? [
            `### Referenzbeispiel\n\n\`\`\`text\n${section.example.code}\n\`\`\``,
            `Erwartetes Ergebnis:\n\n${section.example.expected}`,
            section.example.explanation,
          ]
        : []),
      ...(section.diagram
        ? [
            `### ${section.diagram.title}`,
            section.diagram.summary,
            ...section.diagram.steps.map((step, index) => `${index + 1}. ${step}`),
            `Interaktive Fassung auf der Website: ${section.diagram.url}. Der Textablauf oben bleibt offline verfügbar.`,
          ]
        : []),
      ...(section.selfCheck
        ? [`### Selbst prüfen: ${section.selfCheck.question}`, section.selfCheck.answer]
        : []),
    ]),
    `## Dein Arbeitsauftrag\n\n${chapter.build.brief}`,
    ...chapter.build.acceptance.map((line) => `- ${line}`),
    '## Verständnisfragen',
    ...chapter.questions.map((line, i) => `${i + 1}. ${line}`),
    '## Lokale Beispielprojekte',
    ...(chapter.localProjects ?? []).map(
      (project) => `- ${project.title} (${project.kind}): ${project.path}`,
    ),
    '## Quellen',
    `- Arbeitsgrundlage: ${chapter.build.title}: ${chapter.build.url}`,
    ...chapter.media.map((medium) => `- ${medium.title}: ${medium.url}\n  ${medium.action}`),
    ...(chapter.references ?? []).map(
      (source) =>
        `- ${source.title}: ${source.url}\n  ${source.focus}\n  Lizenz: ${source.license}`,
    ),
    '## Arbeitsumgebung',
    'Die Beispiele sind Referenzcode. Python-Beispiele lassen sich lokal mit Python ausführen; SQL-Beispiele gehören in SQLite. Git-Aufgaben gehören ausschließlich in dein separates Übungsrepository. Befehle und Ausgaben sind beschrieben, werden hier aber nicht ausgeführt. Weitere Pakete oder externe Daten sind nur nötig, wenn der Kapiteltext sie nennt. Die Aufgaben werden nicht automatisch mit dem Kapitelstatus bewertet.',
  ].join('\n\n');
  const files: Record<string, Uint8Array> = {
    'LEITFADEN.md': strToU8(workbookMarkdown),
    'NOTIZEN.md': strToU8(notes),
  };
  referenceExamples.forEach((example, i) => {
    files[`beispiel-${String(i + 1).padStart(2, '0')}.txt`] = strToU8(
      `${example.title}\n\n${example.code}\n\nErwartet:\n${example.expected}\n\n${example.explanation}`,
    );
  });
  return { name: `matchplan-${chapter.id}.zip`, data: zipSync(files) };
}

export function downloadStudyWorkbook(chapter: StudyChapter, notes: string) {
  const archive = exportStudyWorkbook(chapter, notes);
  const downloadUrl = URL.createObjectURL(
    new Blob([new Uint8Array(archive.data).buffer], { type: 'application/zip' }),
  );
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = archive.name;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}
