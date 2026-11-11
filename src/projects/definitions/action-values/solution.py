import matplotlib.pyplot as plt
grid = [[.01, .02, .04, .08], [.02, .04, .08, .16], [.01, .02, .04, .08]]
def zone_value(x, y):
    if not (0 <= x <= 120 and 0 <= y <= 80):
        raise ValueError("Koordinate außerhalb des Spielfelds")
    return grid[min(int(y / (80 / 3)), 2)][min(int(x / 30), 3)]
completed = actions.loc[actions["complete"].eq(1)].copy()
completed["delta"] = completed.apply(lambda r: zone_value(r["end_x"], r["end_y"]) - zone_value(r["start_x"], r["start_y"]), axis=1)
ranking = completed.groupby("player")["delta"].sum().sort_values(ascending=False)
print(ranking.to_string())
per_match = completed.groupby(["match_id", "player"])["delta"].sum().unstack(fill_value=0)
print("Spielweise getrennt:", per_match.to_dict())
ranking.plot.bar(title="Aktionswert unter einem vorgegebenen Spielzeugraster", ylabel="Summe Endwert − Startwert")
