from pathlib import Path
import pandas as pd
events = pd.read_csv(Path(__file__).parent / "data/events.csv")

shots = events.copy()
summary_rows = []
# Filtern, pro Team zählen und drei Grafiken erstellen.
print(summary_rows)

# Grafiken als Dateien sichern.
import sys as _sys
if "matplotlib.pyplot" in _sys.modules:
    _plt = _sys.modules["matplotlib.pyplot"]
    for _number in _plt.get_fignums():
        _plt.figure(_number).savefig(Path(__file__).parent / f"grafik-{_number}.png", dpi=160, bbox_inches="tight")
