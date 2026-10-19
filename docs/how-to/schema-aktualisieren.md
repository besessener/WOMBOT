# Schemas aktualisieren

Die JSON-Schemas von Microsoft liegen unter `schemas/`, damit Prüfung und Tests ohne Netz laufen und eine neue
Version bewusst übernommen wird. `npm run validate` wählt das Schema nach `manifestVersion` im App-Manifest
(`schemas/teams-v<version>.json`) und nach `version` im Agenten (`schemas/declarative-agent-<version>.json`).

## Eine neue Version übernehmen

1. Lies, was sich geändert hat: die Abschnitte „What's new“ im
   [App-Manifest](https://learn.microsoft.com/microsoft-365/extensibility/schema/) und „Changes from previous
   version“ im
   [Manifest für deklarative Agenten](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.8).
2. Lade das Schema herunter, zum Beispiel:

   ```sh
   curl -fsSL -o schemas/declarative-agent-v1.9.json \
     https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.9/schema.json
   ```

3. Setze `version` und `$schema` in `appPackage/declarativeAgent.json` (oder `manifestVersion` und `$schema` in
   `appPackage/manifest.json`) auf die neue Version.
4. Führe `npm run validate` aus und lösche das alte Schema, sobald nichts mehr darauf verweist.
5. **Neue Fähigkeiten oder Eigenschaften sind abgelehnt, bis du entscheidest.** Die Prüfung arbeitet mit
   Positivlisten (`src/policy/agent-policy.ts`). Nimm etwas nur auf, wenn es die
   [Grundregeln](../explanation/grundregeln.md) nicht verletzt – nie eine schreibende Fähigkeit – und beschreibe es im
   [Agent-Manifest](../reference/agent-manifest.md).
6. Stell bereit und probiere WOMBOT aus, wie unter
   [Anweisungen ändern](anweisungen-aendern.md#im-copilot-ausprobieren) beschrieben.
