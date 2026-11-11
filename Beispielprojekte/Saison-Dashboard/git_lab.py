"""Git-Arbeitsaufträge anzeigen; ein separates lokales Labor nur auf Wunsch anlegen.

Ohne --init wird Git nicht verändert. Kein Netzwerk und keine Zugangsdaten nötig.
"""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys


ROUNDS = {
    "1": ("Arbeitsstand, Index und Commit", """
Im Ordner analyst:
1. Lies analysis_config.toml und führe git status aus.
2. Ändere window_matches von 5 auf 3. Vergleiche git diff und git diff --staged.
3. Stage nur diese Datei. Ändere danach window_matches auf 4, ohne erneut zu stagen.
4. Sage voraus, welche Fassung git show :analysis_config.toml zeigt. Prüfe es.
5. Committe die gestagte Fassung mit einer konkreten Nachricht. Prüfe git show HEAD.
Ergebnis: Du erklärst die gespeicherte 3 und die noch ungestagte 4.
Vor Runde 2: Stage und committe die 4 als zweiten bewussten Zwischenstand.
"""),
    "2": ("Ein kleiner Auftrag auf eigenem Branch", """
Im Ordner analyst, mit sauberem Arbeitsstand:
1. Lege feat/completed-matches mit git switch -c an.
2. Ergänze einen erklärenden Kommentar zur Regel completed_only in analysis_config.toml.
3. Prüfe den Diff, stage die konkrete Datei und committe die Änderung.
4. Push den Branch mit -u an origin. origin ist das lokale remote.git, kein Onlinedienst.
Ergebnis: git branch -vv zeigt deinen Branch und dessen Upstream.
Frage: Warum hat sich main durch den Feature-Commit nicht mitbewegt?
"""),
    "3": ("Eingehende Änderungen verstehen", """
In reviewer: git fetch origin, dann git switch main und git merge --ff-only origin/main.
1. Ergänze eine unabhängige Zeile im README.txt, committe sie und pushe main.
2. In analyst: Zeige git log --oneline --graph --decorate --all vor und nach git fetch origin.
3. Vergleiche main, origin/main und feat/completed-matches.
4. Integriere origin/main in deinen aktuellen Feature-Branch mit git merge origin/main.
5. Prüfe die Konfiguration und den neuen README-Inhalt gemeinsam.
Ergebnis: Der Graph erklärt, was vom Kollegen und was aus deinem Auftrag stammt.
Der Push veröffentlicht hier nur in einem lokalen Ordner; er beweist keinen GitHub-PR.
"""),
    "4": ("Einen echten Merge-Konflikt lösen", """
Voraussetzung: Runden 1 bis 3 abgeschlossen; analyst steht auf feat/completed-matches.
1. Stelle dort window_matches auf 6 und committe diese isolierte Änderung.
2. In reviewer/main: Stelle dieselbe Zeile auf 7, committe und pushe main.
3. In analyst: git fetch origin, dann git merge origin/main. Erwarte einen Konflikt.
4. Lies git status und beide Varianten. Fachlicher Auftrag: Das abgestimmte Fenster
   soll 5 sein, und der erklärende Kommentar aus Runde 2 muss erhalten bleiben.
5. Löse in der IDE, prüfe den gesamten Dateiinhalt, stage die Datei und schließe den Merge ab.
6. Zeichne den Graphen. Erkläre, warum die fachliche Lösung keine der beiden Zahlen übernimmt.
Optional: Vor dem Auflösen einmal git merge --abort ausführen, Status prüfen und erneut mergen.
"""),
    "5": ("Eine Fehländerung nachvollziehbar zurücknehmen", """
Im sauberen analyst-Feature-Branch:
1. Stelle completed_only auf false und committe genau diese Fehländerung.
2. Notiere deren echte Commit-ID; sie darf kein Merge-Commit sein.
3. Nimm sie mit git revert <deine-commit-id> zurück; prüfe Konfiguration und log.
4. Zeige, dass der ursprüngliche Commit und die Gegenänderung beide in der Historie stehen.
5. Lies git reflog. Wähle einen früheren Stand, prüfe ihn mit show und sichere einen
   zusätzlichen Branch rescue/previous-analysis auf dieser ID, ohne deinen Branch zurückzusetzen.
Ergebnis: Du unterscheidest Gegenänderung, zusätzlichen Verweis und History-Rewrite.
"""),
    "6": ("Review, Integration und Release vorbereiten", """
1. In analyst: git diff origin/main...HEAD. Lies jede geänderte Zeile selbst.
2. Schreibe einen lokalen PR-Entwurf in review-notes.txt: Problem, Verhalten, Prüfung,
   Datenannahmen und stärkstes Gegenbeispiel. Committe nur absichtlich öffentliche Inhalte.
3. Push deinen Feature-Branch. In reviewer: fetch und diesen Branch prüfen.
4. Führe als minimale Konfigurationsprüfung aus:
   python -c "import tomllib; c=tomllib.load(open('analysis_config.toml','rb')); assert c['window_matches']==5; assert c['completed_only'] is True"
5. In reviewer/main: Integriere den geprüften Branch nach deiner gewählten Merge-Strategie.
   Prüfe erneut, bevor du main zum lokalen origin pushst.
6. Lege erst danach im Labor ein annotiertes Tag lab-v0.1.0 an. Ein lokales Tag ist
   noch kein Deployment. Notiere Stand, Prüfergebnis und Rücknahmeplan.
Online-Transfer: Ein echter PR, geschützter Branch und CI brauchen ein eigenes Hostingprojekt.
Du kannst dort nicht die unabhängige Freigabe deiner eigenen Änderung simulieren.
"""),
    "7": ("Code-Stand und Datenrevision verbinden", """
1. Arbeite mit einer erlaubten kleinen lokalen Eingabe aus deinem Saisonprojekt.
2. Notiere deren SHA-256, Quelle, Saison, Abrufzeit und Schema in einem Laufmanifest.
3. Ergänze Code-Commit-ID, Arbeitsstatus, Parameter und Umgebung.
4. Private Eingabe und Manifest bleiben unter private_data/; prüfe die Ignore-Regel
   mit git check-ignore -v und die bereits versionierten Dateien mit git ls-files.
5. Rechne einen Kontrollwert zweimal aus derselben Eingabe. Ändere danach bewusst
   die Eingabe und erkläre, weshalb derselbe Code-Commit ein anderes Ergebnis liefert.
Optional: Vergleiche dieses Verfahren mit Git LFS und DVC, ohne sie sofort einzubauen.
"""),
    "8": ("Transfer in eine eigene Arbeitsprobe", """
1. Wähle eine neue kleine Funktion im echten Saisonprojekt und beschreibe ihre Abnahme.
2. Plane Branch, fachlichen Prüffall, Review und Auslieferung zunächst ohne fertigen KI-Code.
3. Arbeite in deinem eigenen Projekt und halte die dort geltenden Freigaben ein.
4. Zeige eine saubere README, einen nachvollziehbaren Änderungsauftrag und einen
   Datenlauf mit Manifest. Erkläre eine Fehlersuche und einen Rücknahmeweg.
5. Bitte eine andere Person, einen Wert nachzurechnen und dir eine Folgeänderung zu geben.
Ergebnis: Eine begrenzte Arbeitsprobe, die du erklären und verändern kannst.
Das ist ein Bewerbungsnachweis, keine automatische Einstellungszusage.
"""),
}


def run_git(directory, *arguments):
    """Only used by explicit initialization; all arguments are passed without a shell."""
    environment = os.environ.copy()
    # Repository-selection variables must not redirect writes into the caller's repository.
    for name in tuple(environment):
        if name.startswith("GIT_"):
            del environment[name]
    return subprocess.run(
        ["git", *arguments], cwd=directory,
        env=environment, text=True, check=True, capture_output=True,
    )


def initialize_lab(destination):
    if not shutil.which("git"):
        raise ValueError("Git fehlt im PATH. Installiere Git und prüfe git --version.")
    target = Path(destination).expanduser().resolve()
    if target.exists():
        raise ValueError("Der Zielordner existiert bereits. Wähle einen neuen eigenen Ordner.")
    parent = target.parent
    if not parent.is_dir():
        raise ValueError("Der übergeordnete Ordner muss bereits existieren.")
    for ancestor in (parent, *parent.parents):
        if (ancestor / ".git").exists() or ((ancestor / "HEAD").is_file() and (ancestor / "objects").is_dir()):
            raise ValueError("Das Labor muss außerhalb eines bestehenden Git-Repositorys liegen.")
    # Check ordinary repos, worktrees, and bare repos before creating any directory.
    try:
        run_git(parent, "rev-parse", "--git-dir")
    except subprocess.CalledProcessError:
        pass
    else:
        raise ValueError("Das Labor muss außerhalb eines bestehenden Git-Repositorys liegen.")
    target.mkdir()
    (target / "remote.git").mkdir()
    run_git(target / "remote.git", "init", "--bare", "--initial-branch=main")
    run_git(target, "clone", str(target / "remote.git"), "analyst")
    analyst = target / "analyst"
    run_git(analyst, "config", "user.name", "Git Lab Learner")
    run_git(analyst, "config", "user.email", "learner@example.invalid")
    (analyst / "analysis_config.toml").write_text(
        "window_matches = 5\ncompleted_only = true\n", encoding="utf-8")
    (analyst / "README.txt").write_text(
        "Git-Labor: Konfiguration einer Sportauswertung. Keine echten Spielerdaten.\n", encoding="utf-8")
    (analyst / ".gitignore").write_text("private_data/\n.env\n", encoding="utf-8")
    run_git(analyst, "add", "--", "analysis_config.toml", "README.txt", ".gitignore")
    run_git(analyst, "commit", "-m", "Add baseline analysis configuration")
    run_git(analyst, "push", "-u", "origin", "main")
    run_git(target, "clone", str(target / "remote.git"), "reviewer")
    for name in ("user.name", "user.email"):
        value = "Git Lab Reviewer" if name == "user.name" else "reviewer@example.invalid"
        run_git(target / "reviewer", "config", name, value)
    print(f"Labor angelegt: {target}\nArbeitskopien: analyst und reviewer; Remote: remote.git")
    print("Der Startcommit liegt nur im Labor. Keine globale Git-Konfiguration geändert.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--init", metavar="NEUER_ORDNER", help="Labor außerhalb bestehender Repos anlegen; erzeugt dort einen Startcommit")
    parser.add_argument("--round", choices=ROUNDS, help="Arbeitsauftrag anzeigen; verändert nichts")
    arguments = parser.parse_args()
    if arguments.init and arguments.round:
        parser.error("Wähle entweder --init oder --round.")
    if arguments.init:
        try:
            initialize_lab(arguments.init)
        except (ValueError, OSError, subprocess.CalledProcessError) as error:
            print(f"Labor nicht vollständig angelegt: {error}", file=sys.stderr)
            print("Ein eventuell begonnener Ordner bleibt erhalten und wird nicht überschrieben.", file=sys.stderr)
            return 1
    elif arguments.round:
        title, instruction = ROUNDS[arguments.round]
        print(f"Runde {arguments.round}: {title}\n{instruction.strip()}")
    else:
        print("Git-Labor: Theorie auf der Website, Arbeit in deiner IDE.\n")
        for number, (title, _) in ROUNDS.items():
            print(f"{number}. {title}")
        print("\nEinstieg: python git_lab.py --help")
        print("Nur --init erzeugt Repositories und einen lokalen Startcommit.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
