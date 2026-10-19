# Erste Schritte

In diesem Tutorial holst du WOMBOT, prüfst das Paket und stellst ihn in deinem Mandanten bereit – zunächst nur für
dich. Danach stellst du ihm die erste Frage.

## Was du brauchst

- Eine **Microsoft-365-Copilot-Lizenz** für dein Konto.
- Einen Mandanten, in dem du **eigene Apps hochladen** darfst. Ob das erlaubt ist, entscheidet die IT (Teams Admin
  Center → Setup-Richtlinien → „Benutzerdefinierte Apps hochladen“). Im Firmenmandanten frag vorher nach.
- **Node.js 26** oder neuer und **Git**.
- **Visual Studio Code** mit der Erweiterung **Microsoft 365 Agents Toolkit** (oder die CLI, siehe
  [Befehle](../reference/befehle.md#microsoft-365-agents-toolkit)).

## 1. Holen und prüfen

```sh
git clone https://github.com/besessener/WOMBOT.git
cd WOMBOT
npm ci
npm run env:init
npm run validate
```

`env:init` legt `env/.env.dev` und `env/.env.local` an; in diese Dateien schreibt das Toolkit später die Kennungen
deines Mandanten, deshalb stehen sie nicht in Git. `validate` endet mit:

```text
appPackage: valid and within policy
```

## 2. Bereitstellen

1. Öffne den Ordner in VS Code und wähle links **Microsoft 365 Agents Toolkit**.
2. Melde dich unter **Accounts** mit deinem Microsoft-365-Konto an.
3. Wähle unter **Lifecycle** den Eintrag **Provision** und als Umgebung **dev**.

Das Toolkit baut das Paket nach `appPackage/build/`, prüft es, legt die App an und veröffentlicht den Agenten mit
`AGENT_SCOPE=personal`: Nur du siehst ihn.

## 3. Ausprobieren

1. Öffne <https://m365.cloud.microsoft/chat>.
2. Wähle in der Liste der Agenten **WOMBOTdev**.
3. Lies den Hinweis zu Beginn und wähle den Starter **Who owes me what?** – oder frag auf Deutsch:
   „Wer schuldet mir was aus den letzten 30 Tagen?“

WOMBOT antwortet mit einer Tabelle: wer, was, wann zugesagt, wann fällig, Status, Quelle. Öffne ein paar Quellen und
prüfe, ob die Einträge stimmen. Falsch erkannte Zusagen sind wertvolle Rückmeldungen: Notier dir Frage und Antwort
für [Anweisungen ändern](../how-to/anweisungen-aendern.md).

## Weiter

- Andere mitnutzen lassen: [Bereitstellen und freigeben](../how-to/bereitstellen.md).
- Verstehen, wie WOMBOT entscheidet: [Was als Zusage zählt](../explanation/zusagen.md).
- Wissen, was er nie tut: [Grundregeln](../explanation/grundregeln.md).
