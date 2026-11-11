"""Eigene Referenz: erfundene Wetterbeobachtungen mit Revisionshistorie.

Quelle für Transaktionen/Parameter: https://docs.python.org/3/library/sqlite3.html
Die In-Memory-Datenbank schreibt keine Projektdateien und enthält keine Sportdaten.
"""
import math
import sqlite3


def save_readings(connection, readings):
    """Ein Batch ist atomar. Gleiche Stations-/Mess-/Abrufzeit wird nicht verdoppelt."""
    with connection:
        for station, observed_at, fetched_at, temperature in readings:
            if isinstance(temperature, bool) or not isinstance(temperature, (int, float)) or not math.isfinite(temperature):
                raise ValueError('Temperatur muss eine Zahl sein.')
            connection.execute(
                'INSERT INTO readings VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING',
                (station, observed_at, fetched_at, temperature),
            )


def main():
    with sqlite3.connect(':memory:') as connection:
        connection.execute('''CREATE TABLE readings (
            station TEXT NOT NULL, observed_at TEXT NOT NULL, fetched_at TEXT NOT NULL,
            temperature REAL NOT NULL, PRIMARY KEY (station, observed_at, fetched_at)
        )''')
        first = [('Nord', '2026-01-01T10:00:00Z', '2026-01-01T10:01:00Z', 3)]
        save_readings(connection, first)
        save_readings(connection, first)
        save_readings(connection, [('Nord', first[0][1], '2026-01-01T10:02:00Z', 4)])
        try:
            save_readings(connection, [('Süd', first[0][1], first[0][2], 5),
                                       ('West', first[0][1], first[0][2], None)])
        except ValueError:
            print('Ungültiger Batch zurückgerollt.')
        print('Erfundene Beobachtungen:', connection.execute(
            'SELECT * FROM readings ORDER BY fetched_at'
        ).fetchall())


if __name__ == '__main__':
    main()
