import { useId, useState } from 'react';
import './PointsPerMillion.css';

export interface PreviewPlayer {
  name: string;
  role: string;
  points: number;
  marketValue: number;
}

const X_MAX = 10; // Mio. €
const Y_MAX = 120; // Ø Punkte
const RATIOS = [10, 15, 20];

const de = (value: number) =>
  value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Python float repr for the small values in the fictional data set. */
const py = (value: number) => (Number.isInteger(value) ? `${value}.0` : String(value));

const pyInt = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '_');

/** End point of the ray y = ratio · x inside the plot frame. */
function rayEnd(ratio: number) {
  const x = Math.min(X_MAX, Y_MAX / ratio);
  return { x, y: ratio * x };
}

const left = (millions: number) => `${(millions / X_MAX) * 100}%`;
const top = (points: number) => `${100 - (points / Y_MAX) * 100}%`;

export function PointsPerMillion({ players }: { players: PreviewPlayer[] }) {
  const [selected, setSelected] = useState(0);
  const groupName = useId();
  const player = players[selected];
  const millions = player.marketValue / 1_000_000;
  const ratio = player.points / millions;
  const end = rayEnd(ratio);
  const sameRatio = players.filter(
    (other) => other !== player && other.points / (other.marketValue / 1_000_000) === ratio,
  );

  return (
    <div className="ppm">
      <figure className="ppm-figure">
        <div className="ppm-plot" aria-hidden="true">
          <span className="ppm-axis-y">Ø Punkte je Einsatz</span>
          <div className="ppm-frame">
            {[0, 40, 80, 120].map((tick) => (
              <span className="ppm-tick-y" key={tick} style={{ top: top(tick) }}>
                {tick}
              </span>
            ))}
            {[0, 2, 4, 6, 8, 10].map((tick) => (
              <span className="ppm-tick-x" key={tick} style={{ left: left(tick) }}>
                {tick}
              </span>
            ))}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="ppm-lines">
              {[40, 80].map((tick) => (
                <line
                  key={tick}
                  className="ppm-grid"
                  x1="0"
                  x2="100"
                  y1={100 - (tick / Y_MAX) * 100}
                  y2={100 - (tick / Y_MAX) * 100}
                />
              ))}
              {RATIOS.map((value) => {
                const ray = rayEnd(value);
                return (
                  <line
                    key={value}
                    className="ppm-ray"
                    x1="0"
                    y1="100"
                    x2={(ray.x / X_MAX) * 100}
                    y2={100 - (ray.y / Y_MAX) * 100}
                  />
                );
              })}
              <line
                className="ppm-guide"
                x1={(millions / X_MAX) * 100}
                x2={(millions / X_MAX) * 100}
                y1={100 - (player.points / Y_MAX) * 100}
                y2="100"
              />
              <line
                className="ppm-guide"
                x1="0"
                x2={(millions / X_MAX) * 100}
                y1={100 - (player.points / Y_MAX) * 100}
                y2={100 - (player.points / Y_MAX) * 100}
              />
              <line
                className="ppm-ray ppm-ray-active"
                x1="0"
                y1="100"
                x2={(end.x / X_MAX) * 100}
                y2={100 - (end.y / Y_MAX) * 100}
              />
            </svg>
            {RATIOS.map((value) => {
              const ray = rayEnd(value);
              return (
                <span
                  key={value}
                  className="ppm-ray-label"
                  data-edge={ray.y < Y_MAX ? 'right' : 'top'}
                  style={{ left: left(ray.x), top: top(ray.y) }}
                >
                  {value}
                  <span className="ppm-ray-unit"> je Mio.</span>
                </span>
              );
            })}
            {players.map((item, index) => (
              <span
                key={item.name}
                className="ppm-dot"
                data-active={index === selected || undefined}
                data-flip={item.marketValue / 1_000_000 >= 7 || undefined}
                style={{ left: left(item.marketValue / 1_000_000), top: top(item.points) }}
              >
                <span className="ppm-dot-label">{item.name}</span>
              </span>
            ))}
          </div>
          <span className="ppm-axis-x">Marktwert in Mio. €</span>
        </div>
        <figcaption>
          Jeder Strahl aus dem Nullpunkt steht für ein festes Verhältnis. Wer auf demselben Strahl
          liegt, holt gleich viele Punkte je Million, auch bei anderem Marktwert.
        </figcaption>
      </figure>

      <div className="ppm-calc">
        <fieldset>
          <legend>Spieler für den Rechenweg</legend>
          {players.map((item, index) => (
            <label key={item.name}>
              <input
                type="radio"
                name={groupName}
                checked={index === selected}
                onChange={() => setSelected(index)}
              />
              {item.name}
            </label>
          ))}
        </fieldset>
        <div className="ppm-result" aria-live="polite">
          <span className="ppm-formula">
            {player.points} Punkte ÷ {de(millions)} Mio. € = <strong>{de(ratio)}</strong> Punkte je
            Mio. €
          </span>
          <span className="ppm-code-label">Derselbe Schritt als Aufruf aus metrics.py</span>
          <code className="ppm-code">
            <span>
              points_per_million({player.points}, {pyInt(player.marketValue)})
            </span>
            <span className="ppm-code-out">{py(ratio)}</span>
          </code>
          <span className="ppm-note">
            {sameRatio.length > 0
              ? `Gleiches Verhältnis wie ${sameRatio.map((other) => other.name).join(', ')}. `
              : ''}
            Ob sich ein Kauf lohnt, lässt sich daraus noch nicht ablesen.
          </span>
        </div>
      </div>
    </div>
  );
}

export default PointsPerMillion;
