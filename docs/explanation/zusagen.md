# Was als Zusage zählt

Die Regeln stehen in `appPackage/instruction.txt`; hier steht, warum sie so sind.

## Zusage oder nicht

Eine **Zusage** ist eine Aussage, mit der jemand verspricht, etwas Bestimmtes für dich zu tun oder zu liefern – oder
für eine Gruppe, zu der du gehörst:

- „Ich schick dir die Zahlen bis Freitag.“
- Ein Aufgabenpunkt im Besprechungsprotokoll, der einer Person zugeordnet ist.
- „Ja, mach ich.“ als Antwort auf deine Bitte.

**Keine** Zusage sind vage Absichten („sollten wir uns mal ansehen“), Bitten, die niemand angenommen hat,
automatische Benachrichtigungen, Newsletter und Einladungen für sich genommen. Die Grenze ist bewusst eng: Eine Liste
voller „vielleicht“ hilft niemandem, und eine falsche Zusage kann zu einer unfairen Erinnerung führen.

Eine Bitte von dir ohne Antwort ist keine Zusage. WOMBOT listet sie nur, wenn du ausdrücklich nach offenen Bitten
fragst, und dann getrennt als „gefragt, keine Antwort“.

## Status

Jede Zusage bekommt genau einen Status:

| Status | Bedeutung |
| --- | --- |
| Überfällig | Es gibt ein Fälligkeitsdatum, es ist vorbei, und WOMBOT fand keinen Hinweis auf Erledigung. |
| Bald fällig | Fällig in den nächsten 7 Tagen, kein Hinweis auf Erledigung. |
| Offen | Kein Fälligkeitsdatum, kein Hinweis auf Erledigung. |
| Unklar | Formulierung oder Hinweise sind mehrdeutig; WOMBOT sagt in einem Satz, warum. |
| Wohl erledigt | WOMBOT fand einen Hinweis – eine Antwort mit Anhang oder Link, ein „hier ist es“ – und nennt ihn. |

„Wohl erledigt“ statt „erledigt“: WOMBOT sieht nur Spuren in Mail, Teams und Besprechungen, keine Ergebnisse.

## Fälligkeiten

Relative Angaben („bis Freitag“, „nächste Woche“, „bis Monatsende“) rechnet WOMBOT vom Datum der Nachricht aus, in der
sie stehen, und zeigt das Ergebnis. Musste er annehmen, markiert er das Datum mit „(angenommen)“.

## Zeitraum und Dubletten

Ohne Angabe sucht WOMBOT in den letzten 30 Tagen und sagt das. Dieselbe Zusage in einer Mail und in einer
Besprechung ist ein Eintrag mit beiden Quellen.

## In beide Richtungen

Fragst du, was **du** anderen zugesagt hast, gelten dieselben Regeln andersherum. Das ist nützlich vor dem Urlaub oder
vor einem Rollenwechsel.
