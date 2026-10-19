# Architektur

WOMBOT ist ein **deklarativer Agent** für Microsoft 365 Copilot. Es gibt keinen eigenen Server, kein eigenes
Sprachmodell und keine eigene Datenhaltung: WOMBOT besteht aus einem App-Paket, das Copilot sagt, wie er sich
verhalten soll und welche Daten er dafür lesen darf.

```text
appPackage/
├── manifest.json           Microsoft-365-App-Manifest (Name, Icons, Verweis auf den Agenten)
├── declarativeAgent.json   der Agent: Fähigkeiten, Gesprächsstarter, Hinweis, Verhalten
├── instruction.txt         die Anweisungen – das eigentliche Produkt
├── color.png               Icon 192 × 192
└── outline.png             Icon 32 × 32, weiß auf transparent
```

Zur Laufzeit läuft alles bei Microsoft: Copilot liest mit den Berechtigungen der Person, die fragt, aus Mail, Teams
und Besprechungen, und das Modell von Copilot formuliert die Antwort nach `instruction.txt`.

## Was im Repository Code ist

Der TypeScript-Code unter `src/` läuft nie im Mandanten. Er prüft das App-Paket, bevor es dorthin gelangt:

| Modul | Aufgabe |
| --- | --- |
| `src/package/` | Liest `appPackage/` so, wie das Agents Toolkit es baut: `${{VAR}}`-Platzhalter gefüllt, `$[file('…')]` aufgelöst. |
| `src/schema/` | Prüft Manifest und Agent gegen Microsofts JSON-Schemas, die unter `schemas/` im Repository liegen. |
| `src/policy/` | Prüft die [Grundregeln](grundregeln.md), die sich im Paket ausdrücken lassen: nur lesende Fähigkeiten, keine Aktionen, die Pflichtabschnitte der Anweisungen, die Längengrenze. |
| `src/check.ts` | Fügt beides zusammen; `npm run validate` gibt das Ergebnis aus. |
| `src/cli/` | Die Befehle `validate` und `env:init`. |

Die Schemas liegen im Repository, damit Prüfung und Tests ohne Netz laufen und eine neue Version von Microsoft
bewusst übernommen wird ([Schemas aktualisieren](../how-to/schema-aktualisieren.md)).

## Warum deklarativ

Ein *Custom Engine Agent* mit eigenem Server und eigenem Modell hätte mehr Kontrolle gegeben – etwa eine Bestätigung
im Code, bevor etwas gesendet wird. Dafür bräuchte er Hosting, eine App-Registrierung mit Graph-Berechtigungen und
die Zustimmung eines Administrators, und alle gelesenen Inhalte liefen über diesen Server.

Ein deklarativer Agent braucht nichts davon: Er nutzt die Berechtigungen der fragenden Person, und die Daten verlassen
Microsoft 365 nicht. Der Preis ist, dass Regeln für das Verhalten nur in den Anweisungen stehen können. WOMBOT
gleicht das aus, indem er **nur liest** – was er nicht tun kann, muss keine Anweisung verbieten. Die
[Grundregeln](grundregeln.md) beschreiben, welche Regel wo durchgesetzt wird.

## Grenzen

- WOMBOT braucht eine Microsoft-365-Copilot-Lizenz oder einen Mandanten mit nutzungsbasierter Abrechnung; mit
  Copilot Chat allein stehen die Fähigkeiten für Mail, Teams und Besprechungen nicht zur Verfügung.
- Welche Inhalte Copilot findet, entscheidet Microsofts Suche. WOMBOT kann keinen Ordner und keinen Zeitraum
  erzwingen; er nennt in jeder Antwort, was er durchsucht hat.
- Ob eine Zusage erledigt ist, erkennt WOMBOT nur an Spuren in Mail, Teams und Besprechungen. Was anderswo geliefert
  wurde, sieht er nicht und markiert es als offen oder unklar.
