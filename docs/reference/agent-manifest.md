# Agent-Manifest

WOMBOT nutzt das [Microsoft-365-App-Manifest](https://learn.microsoft.com/microsoft-365/extensibility/schema/) in
Version 1.30 und das
[Manifest für deklarative Agenten](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.8)
in Version 1.8. Beide Schemas liegen unter `schemas/`; `npm run validate` prüft dagegen und gegen die
[Grundregeln](../explanation/grundregeln.md).

## Fähigkeiten

Erlaubt sind genau diese vier (`ALLOWED_CAPABILITIES` in `src/policy/agent-policy.ts`). Jede andere lehnt die
Prüfung ab; `test/docs.test.ts` verlangt, dass jede erlaubte hier steht.

| Fähigkeit | Wofür WOMBOT sie braucht | Abschaltbar |
| --- | --- | --- |
| `Email` | Zusagen in Mails finden und prüfen, ob geliefert wurde. Ohne Einschränkung auf Ordner, weil Zusagen in Posteingang, gesendeten Elementen und abgelegten Ordnern stehen. | ja |
| `TeamsMessages` | Zusagen in Chats, Gruppenchats, Kanälen und Besprechungschats. | ja |
| `Meetings` | Aufgabenpunkte aus Transkripten und Zusammenfassungen. | ja |
| `People` | Namen eindeutig Personen zuordnen. `include_related_content` bleibt aus. | nein |

„Abschaltbar“ heißt: Über `user_overrides` kann jede Person die Quelle im Copilot für ihre Unterhaltung ausschalten.

Bewusst **nicht** erlaubt, unter anderem: `EmailActions` und `MeetingActions` (schreiben), `WebSearch` (Daten verlassen
den Mandanten in eine Suchanfrage), `OneDriveAndSharePoint` und `GraphConnectors` (für Zusagen nicht nötig, viel
Rauschen), `CodeInterpreter`, `GraphicArt`, `ScenarioModels`, `Dataverse`, `EmbeddedKnowledge`.

## Eigenschaften des Agenten

| Eigenschaft | Wert in WOMBOT |
| --- | --- |
| `instructions` | `$[file('instruction.txt')]`, höchstens 8000 Zeichen, mit den Pflichtabschnitten aus `REQUIRED_INSTRUCTION_SECTIONS` |
| `conversation_starters` | Sechs Starter: alles, überfällig, eine Person, eine Besprechung, eigene Zusagen, Erinnerungsentwurf |
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
| `APP_NAME_SUFFIX` | Hängt die Umgebung an den Namen an (`WOMBOTdev`), damit Test und Freigabe nebeneinander existieren. |
