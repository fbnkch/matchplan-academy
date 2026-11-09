from pathlib import Path
import pandas as pd
events = pd.read_csv(Path(__file__).parent / "data/events.csv")

shots = events.loc[events["type"].eq("Shot")].copy()
summary = shots.groupby("team").agg(shots=("type", "size"), goals=("goal", "sum")).reset_index().sort_values("team")
summary_rows = summary[["team", "shots", "goals"]].values.tolist()
print(summary.to_string(index=False))
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
fig, ax = plt.subplots(figsize=(8, 5))
ax.add_patch(Rectangle((0, 0), 120, 80, fill=False, edgecolor="#465c70"))
for team, group in shots.groupby("team"):
    ax.scatter(group["x"], group["y"], label=team, s=45, alpha=0.8)
ax.set(xlim=(0, 120), ylim=(0, 80), xlabel="x (0–120)", ylabel="y (0–80)", title="Synthetische Abschlüsse – Angriffsrichtung nach rechts")
ax.legend()
shots.assign(zone=pd.cut(shots["y"], [0, 26.67, 53.33, 80], labels=["links", "mitte", "rechts"])).groupby(["team", "zone"], observed=False).size().unstack(fill_value=0).plot.bar(title="Abschlusszonen (synthetisch)", ylabel="Schüsse")
shots.groupby(["match_id", "team"]).size().unstack(fill_value=0).plot.bar(title="Schüsse je Spiel (synthetisch)", ylabel="Schüsse")


# Grafiken als Dateien sichern.
import sys as _sys
if "matplotlib.pyplot" in _sys.modules:
    _plt = _sys.modules["matplotlib.pyplot"]
    for _number in _plt.get_fignums():
        _plt.figure(_number).savefig(Path(__file__).parent / f"grafik-{_number}.png", dpi=160, bbox_inches="tight")
