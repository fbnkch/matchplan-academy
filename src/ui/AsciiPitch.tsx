// Decorative, deterministic character drawing. Course information stays in real text.
const pitch = Array.from({ length: 21 }, (_, row) =>
  Array.from({ length: 65 }, (_, col) => {
    const x = col - 32;
    const y = (row - 10) * 2.2;
    const boundary = (row === 1 || row === 19) && col > 2 && col < 62;
    const touchline = (col === 3 || col === 61) && row > 1 && row < 19;
    const halfway = col === 32 && row > 1 && row < 19;
    const circle = Math.abs(Math.hypot(x, y) - 7) < 0.8;
    const box =
      ((col === 14 || col === 50) && row >= 6 && row <= 14) ||
      ((row === 6 || row === 14) && ((col >= 3 && col <= 14) || (col >= 50 && col <= 61)));
    if (boundary) return '─';
    if (touchline || halfway) return '│';
    if (circle || box) return '+';
    const distance = Math.hypot((col - 46) * 0.7, (row - 8) * 1.7);
    if (distance < 3) return '█';
    if (distance < 5) return '▓';
    if (distance < 7) return '▒';
    if (distance < 9) return '░';
    return (row * 13 + col * 7) % 19 === 0 ? '·' : ' ';
  }).join(''),
).join('\n');

export function AsciiPitch() {
  return (
    <pre className="ascii-pitch" aria-hidden="true">
      {pitch}
    </pre>
  );
}
