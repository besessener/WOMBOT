# Agent-Manifest

WOMBOT nutzt das [Microsoft-365-App-Manifest](https://learn.microsoft.com/microsoft-365/extensibility/schema/) in
Version 1.30 und das
[Manifest für deklarative Agenten](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.8)
in Version 1.8, dazu Microsofts Schema für Sprachdateien (1.30) und für Evaluierungen (1.2.0, aus
[microsoft/work-iq](https://github.com/microsoft/work-iq), MIT). Alle Schemas liegen unter `schemas/`;
`npm run validate` prüft dagegen und gegen die [Grundregeln](../explanation/grundregeln.md).

## Fähigkeiten

Erlaubt sind genau diese vier (`ALLOWED_CAPABILITIES` in `src/policy/agent-policy.ts`). Jede andere lehnt die
Prüfung ab; `test/docs.test.ts` verlangt, dass jede erlaubte hier steht.

| Fähigkeit | Wofür WOMBOT sie braucht | Abschaltbar |
| --- | --- | --- |
| `Email` | Zusagen in Mails finden und prüfen, ob geliefert wurde. Ohne Einschränkung auf Ordner, weil Zusagen in Posteingang, gesendeten Elementen und abgelegten Ordnern stehen. | ja |
| `TeamsMessages` | Zusagen in Chats, Gruppenchats, Kanälen und Besprechungschats. | ja |
| `Meetings` | Aufgabenpunkte aus Transkripten und Zusammenfassungen. | ja |
| `People` | Namen eindeutig Personen zuordnen. `include_related_content` bleibt aus; die Prüfung lehnt `true` ab. | nein |

„Abschaltbar“ heißt: Über `user_overrides` kann jede Person die Quelle im Copilot für ihre Unterhaltung ausschalten.

Bewusst **nicht** erlaubt, unter anderem: `EmailActions` und `MeetingActions` (schreiben), `WebSearch` (Daten verlassen
den Mandanten in eine Suchanfrage), `OneDriveAndSharePoint` und `GraphConnectors` (für Zusagen nicht nötig, viel
Rauschen), `CodeInterpreter`, `GraphicArt`, `ScenarioModels`, `Dataverse`, `EmbeddedKnowledge`.

## Eigenschaften des Agenten

| Eigenschaft | Wert in WOMBOT |
| --- | --- |
| `instructions` | `$[file('instruction.txt')]`, höchstens 8000 Zeichen, mit den Pflichtabschnitten aus `REQUIRED_INSTRUCTION_SECTIONS` |
| `description` | Schlüssel `[[agent_description]]`, Texte in `en.json` und `de.json` |
| `conversation_starters` | Sechs Starter als Schlüssel `[[starter_…_title]]`/`[[starter_…_text]]`: alles, überfällig, eine Person, eine Besprechung, eigene Zusagen, Erinnerungsentwurf |
| `behavior_overrides` | `special_instructions.discourage_model_knowledge: true` (Pflicht) |
| `disclaimer` | Hinweis zu Beginn jeder Unterhaltung: nur lesen, kann irren, Quelle prüfen |
| `user_overrides` | `Email`, `TeamsMessages` und `Meetings` abschaltbar |

Abgelehnt, auch wenn das Schema sie kennt: `actions`, `worker_agents`, `editorial_answers`, `sensitivity_label` und
jede Eigenschaft, die Microsoft später hinzufügt.

## Eigenschaften des App-Manifests

Erlaubt sind nur die Eigenschaften, die ein reiner deklarativer Agent braucht (`$schema`, `manifestVersion`,
`version`, `id`, `developer`, `icons`, `name`, `description`, `accentColor`, `copilotAgents`, `validDomains`,
`localizationInfo`) und unter `copilotAgents` nur `declarativeAgents` mit genau einem Agenten. Bots,
Nachrichtenerweiterungen, Tabs, API-Plugins, Custom Engine Agents und Agent-Connectors (MCP) lehnt die Prüfung ab.

## Sprachen

`localizationInfo` nennt `en.json` als Standard und `de.json` als zusätzliche Sprache. Jede Sprachdatei folgt
Microsofts Schema für Sprachdateien und hat zu jedem `[[schlüssel]]` des Agenten einen Text; unbenutzte Schlüssel
lehnt die Prüfung ab (`src/policy/localization.ts`). Wie du Texte änderst:
[Texte übersetzen](../how-to/texte-uebersetzen.md).

## Version

`version` in `appPackage/manifest.json` ist dieselbe wie in `package.json` (ein Test prüft das) und beginnt nie mit
`0`: Microsofts Paketprüfung lehnt Versionen wie `0.1.0` ab, das JSON-Schema nicht. `npm run validate` prüft das
deshalb selbst. Jede neue Veröffentlichung im Mandanten braucht eine höhere Version.

## Platzhalter

Das Agents Toolkit ersetzt `${{NAME}}` beim Bauen aus `env/.env.<umgebung>`. Zum Prüfen setzt `npm run validate`
feste Werte ein (`VALIDATION_VALUES` in `src/package/placeholders.ts`); ein unbekannter Name ist ein Fehler.

| Platzhalter | Bedeutung |
| --- | --- |
| `TEAMS_APP_ID` | Die App-ID im Mandanten; schreibt das Toolkit beim ersten Bereitstellen. |
| `APP_NAME_SUFFIX` | Hängt die Umgebung an den Namen an. In `dev`, der eigentlichen Bereitstellung, ist er leer (Name „WOMBOT“); `local` heißt „WOMBOTlocal“, damit beide nebeneinander existieren. Zum Prüfen setzt `npm run validate` den längeren Wert `local` ein. |
