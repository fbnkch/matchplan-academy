from pathlib import Path
import pandas as pd
actions = pd.read_csv(Path(__file__).parent / "data/actions.csv")

grid = [[.01, .02, .04, .08], [.02, .04, .08, .16], [.01, .02, .04, .08]]
def zone_value(x, y):
    return 0
# Erfolgreiche Aktionen auswählen und bewerten.

# Grafiken als Dateien sichern.
import sys as _sys
if "matplotlib.pyplot" in _sys.modules:
    _plt = _sys.modules["matplotlib.pyplot"]
    for _number in _plt.get_fignums():
        _plt.figure(_number).savefig(Path(__file__).parent / f"grafik-{_number}.png", dpi=160, bbox_inches="tight")
