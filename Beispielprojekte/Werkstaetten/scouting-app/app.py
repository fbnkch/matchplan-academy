from pathlib import Path
import pandas as pd
import streamlit as st

st.set_page_config(page_title="Matchplan – Scouting", layout="wide")
st.title("Rollenprofil: verbindendes Mittelfeld")
st.caption("Synthetische Übungsdaten. Diese Rangliste ersetzt keine Video- oder Liveprüfung.")
players = pd.read_csv(Path(__file__).parent / "data" / "players.csv")
minutes = st.sidebar.slider("Mindestspielzeit", 0, 1800, 900, 90)
positions = sorted(players["position"].dropna().unique().tolist())
if not positions:
    st.info("Keine Positionsdaten vorhanden. Prüfe die CSV-Datei.")
    st.stop()
position = st.sidebar.selectbox("Position", positions, index=positions.index("MF") if "MF" in positions else 0)
passing = st.sidebar.slider("Gewicht progressive Pässe", 0.0, 1.0, 0.5, 0.1)
pressure = st.sidebar.slider("Gewicht Druckaktionen", 0.0, 1.0, 0.3, 0.1)
losses = st.sidebar.slider("Abzug Ballverluste", 0.0, 1.0, 0.2, 0.1)
peers = players.loc[(players.position == position) & (players.minutes >= minutes)].copy()
if len(peers) < 2:
    st.info("Für einen Vergleich werden mindestens zwei Profile benötigt. Senke die Mindestspielzeit.")
    st.stop()
for metric in ["progressive_passes", "pressures", "turnovers"]:
    rate = peers[metric] / peers.minutes.replace(0, float("nan")) * 90
    spread = rate.std(ddof=0)
    peers[metric + "_p90"] = rate
    peers[metric + "_z"] = (rate - rate.mean()) / spread if spread > 0 else 0.0
peers["score"] = passing * peers.progressive_passes_z + pressure * peers.pressures_z - losses * peers.turnovers_z
ranked = peers.sort_values(["score", "name"], ascending=[False, True])
st.dataframe(ranked, hide_index=True)
selected = st.selectbox("Profil ansehen", ranked.name.tolist())
profile = ranked.loc[ranked.name == selected].iloc[0]
st.subheader(selected)
st.write("Spielzeit:", int(profile.minutes), "Minuten")
st.bar_chart(pd.Series({metric: profile[metric + "_p90"] for metric in ["progressive_passes", "pressures", "turnovers"]}, name="pro 90"))
st.download_button("Shortlist als CSV", ranked.to_csv(index=False), "shortlist.csv", "text/csv")
st.markdown("### Vor einer Empfehlung prüfen")
st.write("Rolle und Spielstil, Datenabdeckung, Ballbesitzkontext, Video, Verletzungskontext und Gründe gegen die Auswahl.")
