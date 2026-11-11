"""Zeige den nächsten Arbeitsauftrag, ohne deinen Anwendungscode auszuführen."""
import argparse
import ast
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
STAGES = {
    'api': ('Eine echte API lesen', 'client.py', 'examples/http_results.py',
            'Welche Fehler muss dein Aufrufer unterscheiden können?'),
    'auth': ('Den eigenen Account anbinden', 'auth.py', None,
             'Was weißt du sicher über den erlaubten Zugriff und das Antwortschema?'),
    'cleaning': ('Rohdaten bereinigen', 'cleaning.py', 'examples/clean_inventory.py',
                 'Welche Fachregel des Lagerbeispiels gilt für Kickbase gerade nicht?'),
    'identity': ('Spieler und Partien verbinden', 'identity.py', None,
                 'Welche Zeilenanzahl erwartest du nach deinem Join?'),
    'storage': ('Beobachtungen historisieren', 'storage.py', 'examples/sqlite_weather.py',
                'Was muss nach einem korrigierten oder abgebrochenen Import erhalten bleiben?'),
    'metrics': ('Kennzahlen definieren', 'metrics.py', None,
                'Welches selbst gerechnete Gegenbeispiel könnte deinen ersten Entwurf widerlegen?'),
    'dashboard': ('Ergebnisse darstellen', 'dashboard.py', None,
                  'Was soll sichtbar sein, wenn der letzte Abruf gescheitert ist?'),
    'transfer': ('Eine eigene Änderung prüfen', None, None,
                 'Kannst du eine neue Frage mit deinem Datenstand beantworten und ohne Vorlage umsetzen?'),
}


def describe_workspace(filename):
    path = PROJECT_ROOT / 'src' / 'season_dashboard' / filename
    print(f'\nDeine Datei: src/season_dashboard/{filename}')
    try:
        module = ast.parse(path.read_text(encoding='utf-8-sig'))
    except SyntaxError as error:
        print(f'Syntaxfehler in Zeile {error.lineno}. Prüfe zuerst die Syntax.')
        return
    for function in module.body:
        if not isinstance(function, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        has_placeholder = any(
            isinstance(node, ast.Raise)
            and isinstance(node.exc, ast.Call)
            and isinstance(node.exc.func, ast.Name)
            and node.exc.func.id == 'NotImplementedError'
            for node in ast.walk(function)
        )
        status = 'Platzhalter vorhanden' if has_placeholder else 'kein Platzhalter erkannt'
        print(f'  {function.name}: {status}')
        description = ast.get_docstring(function)
        if description:
            print('  ' + description.splitlines()[0])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--list', action='store_true', help='Alle Abschnitte zeigen')
    parser.add_argument('--stage', choices=STAGES, help='Einen Arbeitsauftrag öffnen')
    arguments = parser.parse_args()
    if arguments.list or not arguments.stage:
        for number, (stage, (title, *_)) in enumerate(STAGES.items(), start=1):
            print(f'{number}. {stage}: {title}')
        print('\nEinstieg: python coach.py --stage api')
        print('Verträge stehen direkt bei den Funktionen. Website/ZIP-LERNWEG enthalten die Quellen.')
    if arguments.stage:
        title, filename, example, question = STAGES[arguments.stage]
        print(title + '\n' + question)
        if example:
            print('Vergleichsbeispiel: ' + example)
        filenames = [filename] if filename else [entry[1] for entry in STAGES.values() if entry[1]]
        for target in filenames:
            describe_workspace(target)
        print('\nArbeitsrunde: Vorhersage notieren, Beispiel untersuchen, selbst umsetzen,')
        print('Abweichung eingrenzen, einen Hinweis nutzen, erneut ohne Vorlage prüfen.')
        print('Das Entfernen eines Platzhalters belegt keine korrekte Implementierung.')
        print('Keine Anmeldung, Netzwerkanfrage oder Ausführung deiner Module durch dieses Werkzeug.')


if __name__ == '__main__':
    main()
