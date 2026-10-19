# WOMBOT

![Microsoft 365 Copilot](https://img.shields.io/badge/Microsoft%20365-Copilot%20Agent-BE185D)
![Declarative agent](https://img.shields.io/badge/agent-declarative%20v1.8-BE185D)
![Node.js](https://img.shields.io/badge/node-%3E%3D26-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=white)
![Biome](https://img.shields.io/badge/lint-Biome-60A5FA?logo=biome&logoColor=white)
![Knip](https://img.shields.io/badge/dead%20code-Knip-000000?logo=knip&logoColor=white)
![node:test](https://img.shields.io/badge/tested%20with-node%3Atest-339933?logo=nodedotjs&logoColor=white)
![Gitleaks](https://img.shields.io/badge/secrets-Gitleaks-blue?logo=git&logoColor=white)
![zizmor](https://img.shields.io/badge/workflow%20security-zizmor-blue?logo=githubactions&logoColor=white)
[![CI](https://github.com/besessener/WOMBOT/actions/workflows/ci.yml/badge.svg)](https://github.com/besessener/WOMBOT/actions/workflows/ci.yml)
[![CodeQL](https://github.com/besessener/WOMBOT/actions/workflows/codeql.yml/badge.svg)](https://github.com/besessener/WOMBOT/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/github/license/besessener/WOMBOT)](LICENSE)

***Who Owes Me Bot – wer schuldet dir was?***

WOMBOT ist ein Agent für Microsoft 365 Copilot. Er liest deine Mails, Teams-Chats und Besprechungen und zeigt dir, was
andere dir zugesagt haben: wer, was, bis wann, ob es erledigt aussieht und wo es steht.

- **Findet Zusagen** – „ich schick dir das bis Freitag“, Aufgabenpunkte aus Besprechungen, ein „mach ich“ im Chat.
- **Prüft den Stand** – überfällig, bald fällig, offen, unklar oder wohl erledigt, mit dem Hinweis, der es belegt.
- **Immer mit Quelle** – jeder Eintrag verlinkt Mail, Nachricht oder Besprechung; ohne Quelle kein Eintrag.
- **Liest nur** – Erinnerungen sind Entwürfe, die du selbst sendest. Eine Prüfung im Repository lässt den Build
  scheitern, sobald eine schreibende Fähigkeit dazukommt ([Grundregeln](docs/explanation/grundregeln.md)).

> **Stand:** Version 1.0.0. Anweisungen, Manifest und Prüfungen stehen; WOMBOT lässt sich mit dem Microsoft 365
> Agents Toolkit bereitstellen. Die Antworten werden noch an echten Postfächern geschärft.

## Loslegen

Voraussetzungen: eine Microsoft-365-Copilot-Lizenz, ein Mandant, in dem du eigene Apps hochladen darfst, Node.js 26
und das [Microsoft 365 Agents Toolkit](https://aka.ms/M365AgentsToolkit).

```sh
npm ci
npm run env:init     # env/.env.dev and env/.env.local from the examples
npm run check        # lint, types, dead code, app package against schemas and policy, tests
```

Danach im Agents Toolkit **Provision** wählen: WOMBOT erscheint im Copilot, zunächst nur für dich. Schritt für
Schritt: [Erste Schritte](docs/tutorials/erste-schritte.md).

## Dokumentation

Webseite: <https://besessener.github.io/WOMBOT/>. Die vollständige Dokumentation liegt unter
[`docs/`](docs/README.md), gegliedert nach [Diátaxis](https://diataxis.fr/).

## Verwandte Projekte

WOMBOT, Archivist, flakipype und PlayMonkey sind aus derselben agentischen Idee entstanden und teilen Grundregeln,
Qualitätsprüfungen und den Aufbau der Dokumentation:

- [Archivist](https://github.com/besessener/Archivist) – ein persönlicher, agentischer KI-Archivar für Windows.
- [flakipype](https://github.com/besessener/flakipype) – findet, erklärt und behebt instabile („flaky“)
  GitHub-Actions-Pipelines per Pull Request.
- [PlayMonkey](https://github.com/besessener/PlayMonkey) – Monkey-Testing für Websites in Testumgebungen: klickt
  zufällig, aber reproduzierbar, und meldet jeden Fehler mit den Schritten zum Nachstellen.

## Lizenz

[MIT](LICENSE)
