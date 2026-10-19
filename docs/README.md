# WOMBOT-Dokumentation

Die Dokumentation folgt [Diátaxis](https://diataxis.fr/): Sie ist nach dem geordnet, was du gerade brauchst.

|  | Zum Lernen | Für die Arbeit |
| --- | --- | --- |
| **Praxis** | [Tutorials](#tutorials) – Schritt für Schritt zum ersten Erfolg | [Anleitungen](#anleitungen) – ein konkretes Ziel erreichen |
| **Wissen** | [Hintergrund](#hintergrund) – verstehen, warum es so ist | [Referenz](#referenz) – nachschlagen, wie es genau ist |

## Tutorials

- [Erste Schritte](tutorials/erste-schritte.md) – klonen, prüfen, in deinem Mandanten bereitstellen, die erste Frage stellen.

## Anleitungen

**WOMBOT benutzen**

- [Bereitstellen und freigeben](how-to/bereitstellen.md) – nur für dich, per Link oder für den ganzen Mandanten.
- [WOMBOT schnell erreichen](how-to/schnell-erreichen.md) – `@WOMBOT` in jedem Copilot-Chat, angeheftet, als
  Verknüpfung auf dem Desktop.

**WOMBOT entwickeln**

- [Mitmachen](../CONTRIBUTING.md) – einrichten, arbeiten, Pull Request öffnen, veröffentlichen.
- [Anweisungen ändern](how-to/anweisungen-aendern.md) – `instruction.txt` bearbeiten, prüfen und im Copilot ausprobieren.
- [Texte übersetzen](how-to/texte-uebersetzen.md) – Beschreibung und Gesprächsstarter auf Englisch und Deutsch.
- [Schemas aktualisieren](how-to/schema-aktualisieren.md) – eine neue Manifest-Version von Microsoft übernehmen.
- [Webseite pflegen](how-to/webseite-pflegen.md) – `site/` und der Pages-Workflow.

## Referenz

- [Agent-Manifest](reference/agent-manifest.md) – jede Fähigkeit und Eigenschaft, die WOMBOT nutzt, und was die Prüfung ablehnt.
- [Befehle](reference/befehle.md) – npm-Skripte, Agents-Toolkit-Befehle und Umgebungsdateien.
- [Qualitätsprüfungen](reference/qualitaetssicherung.md) – Lint, Typen, Schemas, Grundregeln, Tests, Hooks, CodeQL.

## Hintergrund

- [Architektur](explanation/architektur.md) – warum WOMBOT ein deklarativer Agent ohne eigenen Server ist, und was das heißt.
- [Grundregeln](explanation/grundregeln.md) – nur lesen, Quellen, Inhalte sind Daten, Zusagen statt Menschen, Datenschutz.
- [Was als Zusage zählt](explanation/zusagen.md) – Zusagen erkennen, Status, Fälligkeiten, Grenzen.

Verwandte Projekte mit derselben Idee und demselben Aufbau der Dokumentation:
[Archivist](https://github.com/besessener/Archivist/blob/main/docs/README.md),
[flakipype](https://github.com/besessener/flakipype/blob/main/docs/README.md) und
[PlayMonkey](https://github.com/besessener/PlayMonkey/blob/main/docs/README.md).
