# Webseite pflegen

Die Webseite liegt unter `site/` als reines HTML und CSS, ohne Build-Schritt. Sie erscheint auf
<https://besessener.github.io/WOMBOT/>. Aufbau, Abschnitte und Stylesheet teilt sie mit den Seiten von
[Archivist](https://besessener.github.io/Archivist/), [flakipype](https://besessener.github.io/flakipype/) und
[PlayMonkey](https://besessener.github.io/PlayMonkey/); nur Texte, Bilder, Icon und die Farbtokens oben in
`style.css` unterscheiden sich. Eine Änderung am Aufbau oder am gemeinsamen Teil von `style.css` gehört in alle vier
Seiten.

## Inhalt ändern

1. Bearbeite `site/index.html` oder `site/style.css`. Texte sind Deutsch, sprechen dich mit „du“ an und passen zur
   [README](../../README.md) und zu den [Grundregeln](../explanation/grundregeln.md); was die Seite verspricht, muss
   WOMBOT halten. Halte den Stand-Hinweis aktuell.
2. Öffne `site/index.html` im Browser und prüfe Hell und Dunkel (Farben des Systems) und ein handybreites Fenster.
3. Führe `npm run lint` aus; Biome prüft auch HTML und CSS.

Sobald eine Änderung unter `site/` auf `main` landet, veröffentlicht der Workflow `pages.yml` die Seite. Von Hand
startest du ihn unter Actions → Pages → **Run workflow**.

## Icon und Farbe

Das Wombat-Icon ist `site/favicon.svg`; die Akzentfarbe ist Beere (`#be185d`, dunkel `#f472b6`). Die App-Icons in
`appPackage/` stammen aus demselben Motiv: `color.png` (192 × 192, Motiv auf voller Fläche in der Akzentfarbe) und
`outline.png` (32 × 32, nur Weiß auf transparent, wie Microsoft es verlangt). `site/img/wombot-192.png` ist eine Kopie
von `color.png` für Vorschaubilder in Links.

Änderst du das Motiv oder die Farbe in `site/favicon.svg`, erzeuge alle drei neu:

```sh
npm run icons
```

Das Skript `scripts/render-icons.ts` baut die beiden Varianten aus dem Favicon (`src/icons/variants.ts`; Details in
der Akzentfarbe werden im Outline-Icon zu Löchern) und rendert sie mit einem installierten Edge oder Chrome ohne
Fenster; findet es keinen, setz `CHROME_PATH`. Halte danach `accentColor` in `appPackage/manifest.json` gleich der
Hintergrundfarbe des Favicons; ein Test prüft das. Microsofts Paketprüfung beim Bereitstellen kontrolliert Größe,
fehlende Transparenz im Farb-Icon und „nur Weiß“ im Outline-Icon.

## Screenshot

`site/img/chat-dark.png` ist ein echter Screenshot von WOMBOT in Microsoft 365 Copilot (dunkles Design, 1120 px breit).
Ein neuer Screenshot darf nichts aus einem echten Postfach zeigen – keine Namen, Betreffzeilen oder Firmen; die
Begrüßung oder Antworten zu erfundenen Testdaten eignen sich. Die Tabelle im Hero ist ein Beispiel mit erfundenen
Namen und als solches beschriftet.
