# Bereitstellen und freigeben

WOMBOT kennt drei Reichweiten. Sie unterscheiden sich darin, wer den Agenten sieht und wer zustimmen muss.

| Reichweite | Wer ihn sieht | Wie | Zustimmung |
| --- | --- | --- | --- |
| `personal` | nur du | Provision mit `AGENT_SCOPE=personal` (Standard) | keine |
| `shared` | alle, denen du den Link gibst | Provision mit `AGENT_SCOPE=shared` | keine, sofern der Mandant geteilte Agenten erlaubt |
| `tenant` | alle im Mandanten, die die IT freigibt | Publish | ein Administrator im Microsoft 365 Admin Center |

## Bevor andere WOMBOT nutzen

WOMBOT liest Kommunikation, an der auch andere beteiligt sind. Bevor du ihn über `personal` hinaus freigibst:

1. Kläre mit IT und Datenschutz, ob eigene Agenten erlaubt sind und ob eine Freigabe nötig ist.
2. Kläre, ob der Betriebsrat beteiligt werden muss. WOMBOT bewertet keine Personen (siehe
   [Grundregeln](../explanation/grundregeln.md#zusagen-nicht-menschen)); das ist ein gutes Argument, ersetzt aber
   keine Abstimmung.
3. Gib den Menschen, die WOMBOT nutzen, die [Grundregeln](../explanation/grundregeln.md) zu lesen.

## Per Link teilen

1. Setze in `env/.env.dev` den Wert `AGENT_SCOPE=shared`.
2. Führe **Provision** erneut aus.
3. Das Toolkit schreibt den Link nach `SHARE_LINK` in `env/.env.dev`. Gib ihn weiter.

## Für den Mandanten veröffentlichen

1. Führe **Publish** aus (`atk publish --env dev`). Das Paket landet zur Prüfung im Katalog des Mandanten.
2. Ein Administrator gibt es im Microsoft 365 Admin Center unter **Agents** frei und legt fest, für wen.
3. Neue Versionen: `version` in `appPackage/manifest.json` erhöhen, erneut veröffentlichen, erneut freigeben lassen.

## Zurückziehen

- `personal` und `shared`: Im Microsoft 365 Copilot unter **Agents** den Agenten entfernen, oder die App im
  [Teams Developer Portal](https://dev.teams.microsoft.com/apps) löschen.
- `tenant`: Ein Administrator blockiert oder entfernt ihn im Admin Center.
