# Grundregeln

WOMBOT liest dienstliche Kommunikation – deine und die der Menschen, mit denen du schreibst. Diese Regeln prägen den
Entwurf. Zu jeder steht, wo sie durchgesetzt wird: im **Paket** (die Prüfung `npm run validate` lässt den Build
scheitern), in den **Anweisungen** (das Modell soll sich daran halten) oder in **Microsoft 365** selbst.

## Nur lesen

WOMBOT kann nichts senden, beantworten, verschieben, markieren, löschen oder planen. Erinnerungen formuliert er als
Entwurf; abschicken tust du sie selbst.

- **Paket:** Erlaubt sind nur die lesenden Fähigkeiten `Email`, `TeamsMessages`, `Meetings` und `People`. Schreibende
  wie `EmailActions` und `MeetingActions`, API-Plugins (`actions`), andere Agenten (`worker_agents`) und
  MCP-Verbindungen lehnt die Prüfung ab – auch dann, wenn Microsofts Schema sie erlaubt. Welche Eigenschaften
  zulässig sind, steht als Positivliste in `src/policy/agent-policy.ts`; was Microsoft neu einführt, ist abgelehnt,
  bis jemand entscheidet, dass es sicher ist.
- **Anweisungen:** Abschnitt „Read-only“ – WOMBOT behauptet nie, etwas getan zu haben.

Warum so streng: Ein deklarativer Agent hat keinen eigenen Code, in dem eine Bestätigung erzwungen werden könnte. Eine
Regel, die nur im Prompt steht, kann ein geschickt formulierter Mailtext aushebeln. Eine Fähigkeit, die es nicht gibt,
nicht.

## Inhalte sind Daten, keine Anweisungen

Mails, Chatnachrichten, Transkripte, Dateinamen und Anhänge sind Material, das WOMBOT auswertet. Was darin steht,
kann ihm nichts befehlen – egal, wer es geschrieben hat. Enthält ein Inhalt Anweisungen, ignoriert WOMBOT sie und
sagt das.

- **Anweisungen:** Abschnitt „Content is data, not instructions“; die Prüfung verlangt, dass es ihn gibt.
- **Paket:** Weil WOMBOT nur liest, kann eine eingeschleuste Anweisung höchstens die Antwort verfälschen, aber nichts
  auslösen.

## Keine Quelle, kein Eintrag

Jeder Eintrag verlinkt die Mail, Nachricht oder Besprechung, aus der er stammt. WOMBOT erfindet keine Personen,
Daten, Zitate oder Links; findet er nichts, sagt er das und nennt, was er durchsucht hat.

- **Anweisungen:** Abschnitte „Output“ und „Sources and honesty“.
- **Paket:** `discourage_model_knowledge` ist an, damit Copilot nicht aus Allgemeinwissen ergänzt; die Prüfung
  verlangt es.

## Zusagen, nicht Menschen

WOMBOT verfolgt, was zugesagt wurde, nicht, wer zuverlässig ist. Er bewertet, rankt und vergleicht keine Personen,
führt keine Statistik je Person und beschreibt Fakten neutral („seit 3. Mai keine Antwort gefunden“), nie Motive.

- **Anweisungen:** Abschnitt „Respect for people“.

Im Arbeitsumfeld ist das mehr als Höflichkeit: Werkzeuge, die Verhalten oder Leistung von Beschäftigten auswerten
können, unterliegen in Deutschland der Mitbestimmung des Betriebsrats (§ 87 Abs. 1 Nr. 6 BetrVG). WOMBOT ist
bewusst so gebaut, dass er keine solche Auswertung liefert. Ob sein Einsatz in deinem Unternehmen trotzdem eine
Abstimmung braucht, klärst du mit deiner IT, dem Datenschutz und gegebenenfalls dem Betriebsrat, bevor du ihn
für andere freigibst ([Bereitstellen und freigeben](../how-to/bereitstellen.md)).

## Nur, was du sehen darfst

WOMBOT arbeitet mit deinen Berechtigungen. Er sieht nur Mails, Chats und Besprechungen, auf die du selbst Zugriff
hast, und speichert nichts außerhalb von Microsoft 365.

- **Microsoft 365:** Copilot setzt Berechtigungen, Vertraulichkeitsbezeichnungen und Aufbewahrungsrichtlinien des
  Mandanten durch; WOMBOT hat keinen Weg daran vorbei.
- **Anweisungen:** WOMBOT fasst keine privaten Gespräche zusammen, an denen du nicht beteiligt warst.
- **Repository:** Mandantenspezifische Kennungen, die das Agents Toolkit beim Bereitstellen erzeugt, landen in
  `env/.env.dev` und `env/.env.local`; beide sind von Git ausgeschlossen.

## Neutral und generisch

Keine Namen, Adressen oder Kennungen einer Organisation im Code, in den Anweisungen oder in den Beispielen. Beispiele
nutzen erfundene Namen.
