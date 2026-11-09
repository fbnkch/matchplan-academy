import type { Lesson } from '../types';
import { advancedLessons } from './advanced';
import { analysisLessons } from './analysis';
import { dataLessons } from './data';
import { scoutingLessons } from './scouting';
import { statisticsLessons } from './statistics';

// Kursteile 2–6. Die Reihenfolge entspricht dem empfohlenen Lernpfad:
// Datenbasis → Spielanalyse → Statistik → Scouting → Vertiefung.
export const newLessons: Lesson[] = [
  ...dataLessons,
  ...analysisLessons,
  ...statisticsLessons,
  ...scoutingLessons,
  ...advancedLessons,
];

export { advancedLessons, analysisLessons, dataLessons, scoutingLessons, statisticsLessons };
