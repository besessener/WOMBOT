# Befehle

## npm-Skripte

| Befehl | Was er tut |
| --- | --- |
| `npm run env:init` | Legt `env/.env.dev` und `env/.env.local` aus den `.example`-Dateien an, wenn sie fehlen; überschreibt nie. |
| `npm run validate` | Prüft `appPackage/` und `evals/prompts.json` gegen die Schemas und die Grundregeln. Exit-Code `0` gültig, `1` mit Problemen. |
| `npm run shortcut` | Windows: Verknüpfung „WOMBOT“ auf Desktop und im Startmenü, siehe [WOMBOT schnell erreichen](../how-to/schnell-erreichen.md). |
| `npm run icons` | Erzeugt `appPackage/color.png`, `appPackage/outline.png` und `site/img/wombot-192.png` aus `site/favicon.svg` mit einem installierten Edge oder Chrome (`CHROME_PATH` überschreibt die Suche). |
| `npm test` | Alle Tests. |
| `npm run test:coverage` | Alle Tests mit Abdeckungsschwellen; schreibt `lcov.info`. |
| `npm run lint` | Biome (Format und Lint, auch für HTML, CSS und JSON) und die Typprüfung. |
| `npm run typecheck` | Nur `tsc`. |
| `npm run knip` | Toter Code und unbenutzte Abhängigkeiten. |
| `npm run format` | Formatiert und behebt, was Biome sicher beheben kann. |
| `npm run check` | Alle lokalen Prüfungen: `lint`, `knip`, `validate`, `test:coverage`. |

## Microsoft 365 Agents Toolkit

Bereitstellen und Veröffentlichen erledigt das [Agents Toolkit](https://aka.ms/M365AgentsToolkit), als
VS-Code-Erweiterung oder als CLI `atk`. Die Abläufe stehen in `m365agents.yml` (Umgebung `dev`) und
`m365agents.local.yml` (Umgebung `local`, „Preview Local in Copilot“ in VS Code).

| Befehl (CLI) | VS Code | Was er tut |
| --- | --- | --- |
| `atk auth login m365` | Accounts → Sign in to Microsoft 365 | Anmelden am Mandanten. |
| `atk provision --env dev` | Lifecycle → Provision | Paket bauen, prüfen, App anlegen oder aktualisieren, Agent veröffentlichen mit `AGENT_SCOPE`. |
| `atk publish --env dev` | Lifecycle → Publish | Paket an den Katalog des Mandanten übergeben; ein Administrator muss freigeben. |
| `atk validate --package-file appPackage/build/appPackage.dev.zip` | – | Microsofts eigene Paketprüfung. |

Die CLI gibt es als npm-Paket `@microsoft/m365agentstoolkit-cli`, etwa
`npx @microsoft/m365agentstoolkit-cli@1.1.18 provision --env dev`.

## Umgebungsdateien

| Datei | In Git | Inhalt |
| --- | --- | --- |
| `env/.env.dev.example` | ja | Vorlage für `dev`. |
| `env/.env.local.example` | ja | Vorlage für `local`. |
| `env/.env.dev`, `env/.env.local` | nein | Kopien der Vorlagen; das Toolkit schreibt beim Bereitstellen die Kennungen aus deinem Mandanten hinein. |
| `env/.env.*.user` | nein | Geheime Werte, falls das Toolkit welche braucht. |

| Variable | Bedeutung |
| --- | --- |
| `TEAMSFX_ENV` | Name der Umgebung. |
| `APP_NAME_SUFFIX` | Anhang an den Namen, siehe [Agent-Manifest](agent-manifest.md#platzhalter). |
| `AGENT_SCOPE` | Nur `dev`: `personal` (nur du, Standard), `shared` (alle mit dem Link) oder `tenant` (braucht Freigabe durch einen Administrator). |
| `TEAMS_APP_ID` | Schreibt das Toolkit beim ersten Bereitstellen. |
| `M365_TITLE_ID`, `M365_APP_ID`, `SHARE_LINK` | Schreibt das Toolkit beim Veröffentlichen. |
