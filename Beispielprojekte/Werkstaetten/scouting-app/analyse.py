from pathlib import Path
import pandas as pd
players = pd.read_csv(Path(__file__).parent / "data/players.csv")

peers = players.copy()
shortlist_names = []
alternative_names = []
# Rolle und Spielzeit filtern, Raten bilden, standardisieren und gewichten.

# Grafiken als Dateien sichern.
import sys as _sys
if "matplotlib.pyplot" in _sys.modules:
    _plt = _sys.modules["matplotlib.pyplot"]
    for _number in _plt.get_fignums():
        _plt.figure(_number).savefig(Path(__file__).parent / f"grafik-{_number}.png", dpi=160, bbox_inches="tight")
