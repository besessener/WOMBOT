# WOMBOT schnell erreichen

WOMBOT läuft in Microsoft 365 Copilot, nicht auf deinem Rechner. Es gibt nichts zu starten: Ist er einmal
bereitgestellt, ist er überall da, wo du mit deinem Konto in Copilot angemeldet bist – im Browser, in Teams und in
Outlook. Drei Wege machen ihn bequem erreichbar.

## Mit @WOMBOT in jedem Copilot-Chat

Tippe in einem Copilot-Chat **@** und wähle **WOMBOT**, etwa:

```text
@WOMBOT was schuldet mir Jana noch?
```

WOMBOT antwortet direkt in diesem Gespräch; du musst vorher nicht zu ihm wechseln. Erscheint er in der @-Liste nicht,
bietet dein Mandant das für persönlich installierte Agenten nicht an; nimm dann einen der anderen Wege.

## In der Seitenleiste anheften

Nach der ersten Unterhaltung steht WOMBOT in Copilot links unter **Agents**. Fahr mit der Maus darüber, öffne **…**
und wähle **Anheften**. Fehlt der Eintrag, hilft es, die Seite neu zu laden; neue Versionen erscheinen manchmal erst
nach ein paar Minuten.

## Als Verknüpfung auf dem Desktop (Windows)

```sh
npm run shortcut
```

Das legt eine Verknüpfung **WOMBOT** mit dem Wombat-Icon auf dem Desktop und im Startmenü an. Sie öffnet den Chat mit
WOMBOT in einem eigenen Edge-Fenster ohne Tabs. Für die Taskleiste: im Startmenü mit rechts auf **WOMBOT** klicken und
**An Taskleiste anheften** wählen.

Das Skript `scripts/install-shortcut.ps1` braucht ein bereitgestelltes WOMBOT: Es liest `M365_TITLE_ID` aus
`env/.env.dev`, die das Agents Toolkit beim Bereitstellen schreibt. Das Icon legt es unter
`%LOCALAPPDATA%\WOMBOT\wombot.ico` ab. Die direkte Adresse zum Chat ist auch ein gutes Lesezeichen:

```text
https://m365.cloud.microsoft/chat/?titleId=<M365_TITLE_ID>
```

## Was nach dem Schließen bleibt

Schließt du das Fenster oder fährst den Rechner herunter, ändert sich nichts: WOMBOT bleibt in Copilot verfügbar, bis
du ihn dort entfernst oder die IT ihn sperrt. Änderungen am Repository wirken erst, wenn du ihn erneut bereitstellst
([Bereitstellen und freigeben](bereitstellen.md)); dafür brauchst du dein `env/.env.dev`, also lösch es nicht.
