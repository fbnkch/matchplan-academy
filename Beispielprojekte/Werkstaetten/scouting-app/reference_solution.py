from pathlib import Path
import pandas as pd
players = pd.read_csv(Path(__file__).parent / "data/players.csv")

import matplotlib.pyplot as plt
peers = players.loc[players["position"].eq("MF") & players["minutes"].ge(900)].copy()
for metric in ["progressive_passes", "pressures", "turnovers"]:
    peers[metric + "_p90"] = peers[metric] / peers["minutes"] * 90
    values = peers[metric + "_p90"]
    spread = values.std(ddof=0)
    peers[metric + "_z"] = (values - values.mean()) / spread if spread > 0 else 0.0
peers["score"] = .5 * peers["progressive_passes_z"] + .3 * peers["pressures_z"] - .2 * peers["turnovers_z"]
shortlist = peers.sort_values(["score", "name"], ascending=[False, True]).head(3)
shortlist_names = shortlist["name"].tolist()
print(shortlist[["name", "minutes", "score"]].to_string(index=False))
peers["alternative"] = .1 * peers["progressive_passes_z"] + .1 * peers["pressures_z"] - .8 * peers["turnovers_z"]
alternative_names = peers.sort_values(["alternative", "name"], ascending=[False, True]).head(3)["name"].tolist()
print("Andere Gewichtung:", alternative_names)
shortlist.set_index("name")[["progressive_passes_p90", "pressures_p90", "turnovers_p90"]].plot.bar(title="Shortlist – beschreibende Raten, synthetische Daten")


# Grafiken als Dateien sichern.
import sys as _sys
if "matplotlib.pyplot" in _sys.modules:
    _plt = _sys.modules["matplotlib.pyplot"]
    for _number in _plt.get_fignums():
        _plt.figure(_number).savefig(Path(__file__).parent / f"grafik-{_number}.png", dpi=160, bbox_inches="tight")
