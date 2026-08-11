# Relax studio LEA — web

Nový web pro masážní studio v Liberci (majitelka Leona Roubková).
Nahrazuje starý web na Webnode: https://www.relaxstudiolea.cz

## Co to je

Statický web — čisté HTML, CSS a JavaScript. **Žádný build, žádné závislosti, žádný backend.**
Nahraje se na hosting jako soubory. Nepřidávej npm, bundler ani framework, pokud o to nikdo nepožádá.

## Struktura

Web běží na GitHub Pages: https://romantycka.github.io/relax-studio-lea/
Kořenový `index.html` je rozcestník na obě varianty (`web/` a `web-v2/`), klient si podle
něj vybírá. Repozitář je veřejný.

```
Relax_Studio/
├── index.html            ← rozcestník variant (jen pro Pages, ne pro finální hosting)
├── web-v2/               ← 2. varianta: bento mřížka, pastely, video v hero
├── web/                  ← 1. varianta, tohle se nahrává na hosting
│   ├── index.html        ← celý web je jedna stránka (one-page + kotvy)
│   ├── css/style.css
│   ├── js/main.js        ← animace, parallax, menu, galerie, formulář, feed
│   ├── js/aktuality.js   ← KONFIGURACE zdroje facebookových příspěvků
│   ├── img/              ← optimalizované obrázky pro web (max 1920 px)
│   ├── README.md         ← návod pro majitelku a správce webu
│   └── vzor-tabulky-aktuality.csv
└── *.jpg                 ← originální nezmenšené fotky a logo od majitelky (zdroj)
```

Fotky v kořeni jsou **zdroje**. Na web patří jen jejich zmenšené kopie ve `web/img/`.

## Pravidla obsahu

**Textový obsah se nesmí měnit.** Všechny texty (nadpisy, popisy služeb, ceny, sekce
„O mně“, reference) jsou doslova převzaté ze stávajícího webu. Majitelka si je odsouhlasila.
Uprav je jen na výslovné vyžádání.

Pozor na dvě místa, kde se ceny na starém webu liší a je to **záměrně zachováno**:
medová masáž je na úvodní stránce za 900 Kč a v ceníku za 990 Kč. Nesjednocovat bez zadání.

Kontakty: +420 737 706 415 · leonaroubkova@centrum.cz · Moskevská 52/24, 460 01 Liberec
Facebook (osobní profil, ne firemní stránka): https://www.facebook.com/leona.roubkova.3

## Vizuální styl

Fonty: `Cormorant Garamond` (nadpisy), `Jost` (text) — z Google Fonts.

Barvy jsou v CSS proměnných na začátku `style.css`:
`--cream #faf4ec`, `--sage #8b9a7d`, `--sage-dark #66755a`, `--brown #4a3b26`, `--gold #a8834f`.
Nové barvy nezaváděj, používej existující proměnné.

### Logo

Originál `logo.jpg` je zelenohnědý na krémovém pozadí. Z něj jsou vygenerované
čtyři varianty s průhledným pozadím ve `web/img/`:

| soubor | použití |
|---|---|
| `logo-full.png` / `logo-mark.png` | světlá pozadí (hlavička po odscrollování) |
| `logo-full-light.png` / `logo-mark-light.png` | tmavá pozadí (hero, patička, hlavička nad fotkou) |

Hlavička mezi tmavou a světlou variantou přepíná podle třídy `.scrolled` (CSS opacity).
Světlé varianty jsou monochromatické krémové se zesílenou alfou — bez toho na tmavém
podkladu zanikají. Kdyby bylo potřeba je přegenerovat, postup je popsaný níže v „Přegenerování loga“.

## Aktuality z Facebooku

Majitelka **neumí a nechce** editovat kód. Jakékoli řešení, které po ní chce sáhnout na
soubor nebo něco nahrát na hosting, je nepoužitelné — na tom už jeden návrh padl.

Současné řešení: odkazy na příspěvky zadává do **Google tabulky**, web si ji načítá sám
jako publikované CSV a vykreslí tři nejnovější přes oficiální Facebook embed.

Nastavuje se v `web/js/aktuality.js`:
- `TABULKA_AKTUALIT` — adresa publikované tabulky (`output=csv`). **Zatím prázdné.**
- `FB_PRISPEVKY` — ruční záložní seznam, kdyby tabulka vypadla. Běžně prázdné.

Chování je ošetřené ve všech stavech (ověřeno testem): tabulka vyplněná → příspěvky;
prázdná nebo nedostupná → **označená ukázka**, nikdy prázdná sekce.

Proč ne automatický feed: profil je **osobní**, ne firemní stránka. Facebook Page Plugin
funguje jen pro stránky. Plná automatika by šla až po převodu profilu na firemní stránku —
majitelce navrženo, zatím **odloženo, neřešit bez jejího pokynu**.

## Objednávkový formulář

Nemá backend. Po odeslání sestaví předvyplněný e-mail přes `mailto:`.
Pokud by se přidával server, musí se řešit ochrana proti spamu a souhlas se zpracováním údajů.

## Spuštění náhledu

```bash
python3 -m http.server 8744 --directory web
```

V Claude Code je připravená konfigurace v `.claude/launch.json` (`preview_start` → „web“
nebo „web-v2“, port 8745).

## Jak testovat změny

Vizuální kontrola v prohlížeči nestačí — animace se spouští až při scrollu a část
obrázků je lazy. Osvědčený postup: headless Chrome přes DevTools Protocol, projet
stránku odshora dolů a pak změřit stav.

Co má po projetí celé stránky vyjít:
- všech **36** prvků `.reveal / .reveal-left / .reveal-right` má třídu `.in-view`
- `document.documentElement.scrollWidth === clientWidth` (nic nepřetéká do stran)
- všechny obrázky načtené (výjimka: `#lbImg` v lightboxu nemá `src`, dokud se neklikne)

Pozor: headless Chrome má minimální šířku okna ~500 px. Skutečnou mobilní šířku (375 px)
takhle neotestuješ — na to použij panel prohlížeče (`resize_window` → mobile).

Ve **variantě 2** je stejná kontrola, jen se třídou `.is-in` a **41** prvky.

Dvě pasti, na které se dá narazit znovu:
- V panelu prohlížeče mají stránky `document.visibilityState === "hidden"`, takže
  `IntersectionObserver` **nikdy nespustí** — animace se tam ověřit nedají, jen vzhled.
  Na animace používej headless Chrome přes CDP.
- Ke starému běžícímu headless Chromu na stejném ladicím portu se připojí i nový běh
  a měří se pak jiné okno. Před měřením `pkill -f "remote-debugging-port=..."`.

## Přegenerování loga

Kdyby bylo potřeba varianty loga vyrobit znovu z `logo.jpg` (pozadí je jednolité
`rgb(255,243,234)`):

1. alfa = `1 − min(pixel / pozadí)` po kanálech, hodnoty pod 0.05 vynulovat (JPEG šum)
2. barvu odmíchat z podkladu: `(pixel − pozadí × (1−α)) / α`
3. oříznout podle `getbbox()` — značka je nad řádkem 1010, celé logo do 1560
4. světlá varianta: alfu umocnit na 0.55 (zesílení krytí) a barvu přebít na `(247,241,231)`

Vyžaduje `pillow` a `numpy`.

## Co zbývá

- [ ] Vyplnit `TABULKA_AKTUALIT` po založení Google tabulky (postup ve `web/README.md`)
- [ ] Nasadit na hosting a nastavit doménu
- [ ] Rozhodnout o převodu facebookového profilu na firemní stránku
