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

const formatGermanDecimal = (value: number) =>
  value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Python float repr for the small values in the fictional data set. */
const formatPythonFloat = (value: number) =>
  Number.isInteger(value) ? `${value}.0` : String(value);

const formatPythonInteger = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '_');

/** End point of the ray y = ratio · x inside the plot frame. */
function getRayEndpoint(pointsPerMillion: number) {
  const x = Math.min(X_MAX, Y_MAX / pointsPerMillion);
  return { x, y: pointsPerMillion * x };
}

const getHorizontalPosition = (marketValueInMillions: number) =>
  `${(marketValueInMillions / X_MAX) * 100}%`;
const getVerticalPosition = (points: number) => `${100 - (points / Y_MAX) * 100}%`;

export function PointsPerMillion({ players }: { players: PreviewPlayer[] }) {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const groupName = useId();
  const player = players[selectedPlayerIndex];
  const marketValueInMillions = player.marketValue / 1_000_000;
  const pointsPerMillion = player.points / marketValueInMillions;
  const activeRayEndpoint = getRayEndpoint(pointsPerMillion);
  const playersWithSameRatio = players.filter(
    (otherPlayer) =>
      otherPlayer !== player &&
      otherPlayer.points / (otherPlayer.marketValue / 1_000_000) === pointsPerMillion,
  );

  return (
    <div className="ppm">
      <figure className="ppm-figure">
        <div className="ppm-plot" aria-hidden="true">
          <span className="ppm-axis-y">Ø Punkte je Einsatz</span>
          <div className="ppm-frame">
            {[0, 40, 80, 120].map((tick) => (
              <span className="ppm-tick-y" key={tick} style={{ top: getVerticalPosition(tick) }}>
                {tick}
              </span>
            ))}
            {[0, 2, 4, 6, 8, 10].map((tick) => (
              <span className="ppm-tick-x" key={tick} style={{ left: getHorizontalPosition(tick) }}>
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
                const rayEndpoint = getRayEndpoint(value);
                return (
                  <line
                    key={value}
                    className="ppm-ray"
                    x1="0"
                    y1="100"
                    x2={(rayEndpoint.x / X_MAX) * 100}
                    y2={100 - (rayEndpoint.y / Y_MAX) * 100}
                  />
                );
              })}
              <line
                className="ppm-guide"
                x1={(marketValueInMillions / X_MAX) * 100}
                x2={(marketValueInMillions / X_MAX) * 100}
                y1={100 - (player.points / Y_MAX) * 100}
                y2="100"
              />
              <line
                className="ppm-guide"
                x1="0"
                x2={(marketValueInMillions / X_MAX) * 100}
                y1={100 - (player.points / Y_MAX) * 100}
                y2={100 - (player.points / Y_MAX) * 100}
              />
              <line
                className="ppm-ray ppm-ray-active"
                x1="0"
                y1="100"
                x2={(activeRayEndpoint.x / X_MAX) * 100}
                y2={100 - (activeRayEndpoint.y / Y_MAX) * 100}
              />
            </svg>
            {RATIOS.map((value) => {
              const rayEndpoint = getRayEndpoint(value);
              return (
                <span
                  key={value}
                  className="ppm-ray-label"
                  data-edge={rayEndpoint.y < Y_MAX ? 'right' : 'top'}
                  style={{
                    left: getHorizontalPosition(rayEndpoint.x),
                    top: getVerticalPosition(rayEndpoint.y),
                  }}
                >
                  {value}
                  <span className="ppm-ray-unit"> je Mio.</span>
                </span>
              );
            })}
            {players.map((candidatePlayer, index) => (
              <span
                key={candidatePlayer.name}
                className="ppm-dot"
                data-active={index === selectedPlayerIndex || undefined}
                data-flip={candidatePlayer.marketValue / 1_000_000 >= 7 || undefined}
                style={{
                  left: getHorizontalPosition(candidatePlayer.marketValue / 1_000_000),
                  top: getVerticalPosition(candidatePlayer.points),
                }}
              >
                <span className="ppm-dot-label">{candidatePlayer.name}</span>
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
          {players.map((candidatePlayer, index) => (
            <label key={candidatePlayer.name}>
              <input
                type="radio"
                name={groupName}
                checked={index === selectedPlayerIndex}
                onChange={() => setSelectedPlayerIndex(index)}
              />
              {candidatePlayer.name}
            </label>
          ))}
        </fieldset>
        <div className="ppm-result" aria-live="polite">
          <span className="ppm-formula">
            {player.points} Punkte ÷ {formatGermanDecimal(marketValueInMillions)} Mio. € ={' '}
            <strong>{formatGermanDecimal(pointsPerMillion)}</strong> Punkte je Mio. €
          </span>
          <span className="ppm-code-label">Derselbe Schritt als Aufruf aus metrics.py</span>
          <code className="ppm-code">
            <span>
              points_per_million({player.points}, {formatPythonInteger(player.marketValue)})
            </span>
            <span className="ppm-code-out">{formatPythonFloat(pointsPerMillion)}</span>
          </code>
          <span className="ppm-note">
            {playersWithSameRatio.length > 0
              ? `Gleiches Verhältnis wie ${playersWithSameRatio.map((otherPlayer) => otherPlayer.name).join(', ')}. `
              : ''}
            Ob sich ein Kauf lohnt, lässt sich daraus noch nicht ablesen.
          </span>
        </div>
      </div>
    </div>
  );
}

export default PointsPerMillion;
