# Texte übersetzen

Was du in Copilot von WOMBOT siehst – Name, Beschreibung, Gesprächsstarter – gibt es auf Englisch und Deutsch.
Copilot zeigt die Sprache deines Microsoft-365-Kontos; für jede andere Sprache Englisch. Die Antworten selbst sind
davon unabhängig: WOMBOT antwortet in der Sprache, in der du fragst.

## Wo die Texte stehen

| Datei | Inhalt |
| --- | --- |
| `appPackage/manifest.json` | `localizationInfo`: Englisch (`en.json`) ist Standard, Deutsch (`de.json`) zusätzlich. |
| `appPackage/declarativeAgent.json` | Statt Texten Schlüssel wie `[[agent_description]]` und `[[starter_all_title]]`. |
| `appPackage/en.json`, `appPackage/de.json` | Name, Kurz- und Langbeschreibung der App und unter `localizationKeys` der Text zu jedem Schlüssel. |

Der Hinweis zu Beginn einer Unterhaltung (`disclaimer`) und die Anweisungen lassen sich bei Microsoft nicht
übersetzen; beide bleiben Englisch.

## Einen Text ändern

1. Ändere ihn in `en.json` **und** `de.json`.
2. Führe `npm run validate` aus. Die Prüfung verlangt, dass jede Sprachdatei zu jedem Schlüssel, den der Agent nutzt,
   einen Text hat und keine Schlüssel enthält, die niemand nutzt; dazu die Längengrenzen aus Microsofts Schema (etwa
   80 Zeichen für die Kurzbeschreibung).

## Einen Gesprächsstarter hinzufügen

1. Trag in `declarativeAgent.json` unter `conversation_starters` einen Eintrag mit zwei neuen Schlüsseln ein, zum
   Beispiel `[[starter_week_title]]` und `[[starter_week_text]]`. Schlüssel bestehen aus Buchstaben, Ziffern und `_`
   und beginnen nicht mit einer Ziffer.
2. Trag beide Schlüssel mit Text in `en.json` und `de.json` ein.
3. `npm run validate`, dann bereitstellen. Microsoft erlaubt höchstens zwölf Starter.

## Eine Sprache hinzufügen

1. Kopiere `en.json` nach zum Beispiel `fr.json` und übersetze alle Werte.
2. Trag die Datei in `manifest.json` unter `localizationInfo.additionalLanguages` ein:
   `{ "languageTag": "fr", "file": "fr.json" }`.
3. `npm run validate`, dann bereitstellen.
