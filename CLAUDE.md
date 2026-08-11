# Relax studio LEA — web

Nový web pro masážní studio v Liberci (majitelka Leona Roubková).
Nahrazuje starý web na Webnode: https://www.relaxstudiolea.cz

## Co to je

Statický web — čisté HTML, CSS a JavaScript. **Žádný build, žádné závislosti, žádný backend.**
Nahraje se na hosting jako soubory. Nepřidávej npm, bundler ani framework, pokud o to nikdo nepožádá.

## Struktura

Web běží na GitHub Pages: https://romantycka.github.io/relax-studio-lea/
Kořenový `index.html` je rozcestník na varianty (`web/`, `web-v2/` a `web-v3/`), klient si podle
něj vybírá. Repozitář je veřejný.

```
Relax_Studio/
├── index.html            ← rozcestník variant (jen pro Pages, ne pro finální hosting)
├── web-v3/               ← 3. varianta: kopie v2 v růžovo-béžové paletě, jediný font Quicksand,
│                            vlastní hero video (bez vodoznaku, viz „Hero video ve variantě 3“)
├── web-v2/               ← 2. varianta: bento mřížka, pastely, video v hero
├── web/                  ← 1. varianta, tohle se nahrává na hosting
│   ├── index.html        ← celý web je jedna stránka (one-page + kotvy)
│   ├── css/style.css
│   ├── js/main.js        ← animace, parallax, menu, galerie, formulář, feed
│   ├── js/aktuality.js   ← KONFIGURACE zdroje facebookových příspěvků
│   ├── img/              ← optimalizované obrázky pro web (max 1920 px)
│   ├── README.md         ← návod pro majitelku a správce webu
│   └── vzor-tabulky-aktuality.csv
└── *.jpg, *.mp4          ← originální nezmenšené fotky, video a logo od majitelky (zdroj)
```

Fotky a video v kořeni jsou **zdroje**. Na web patří jen jejich zmenšené kopie
ve `web/img/`, resp. `web-v3/video/`.

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

## Nasouvání sekcí ve variantě 3

Přišpendlené jsou čtyři bloky — hero, parallaxový pás, reference a patička. Zůstanou stát
a následující sekce se přes ně nasune. Každá dvojice je obalená v `<div class="stick">`;
díky tomu sticky skončí, jakmile je blok překrytý, a video se pak neskládá pod zbytkem
stránky. Ostatní sekce mají třídu `.sec-over` (zaoblená horní hrana, přesah −46 px, stín
nahoru), takže se přes sebe nasouvají taky.

**Přišpendlit jde jen blok, který se vejde do okna** — jinak se jeho spodek stane trvale
nedosažitelným. Naměřené výšky sekcí (šířky 1000–2560 px):

| sekce | výška | vhodná k přišpendlení |
|---|---|---|
| pás s fotkou | 429 – 695 px | ano, vejde se vždy |
| reference | 660 – 734 px | ano od šířky 1081 px (pod ní se karty lámou do dvou řad) |
| patička | 147 px (mobil 276) | ano, vejde se vždy |
| galerie / o mně / kontakt | 835 – 1176 px | ne, vejdou se jen na velkých displejích |
| uvítání / služby / objednávka | 1268 – 2998 px | ne |

Patička je `sticky bottom:0` se `z-index:-1` — kontakty se přes ni odsouvají nahoru.
Bez záporného z-indexu by její tmavý pruh svítil přes hero (patička je v DOM později).

Čtyři věci, které to rozbijí:
- `overflow-x:hidden` na `body` — udělá z body scrollovací kontejner a **sticky přestane
  fungovat**. Proto je tam `overflow-x:clip`. Neměnit zpátky.
- Přišpendlení hero platí až od 861 px (`@media (min-width:861px)`). Na užších displejích je
  hero vyšší než okno a jeho spodek s kontakty by se stal nedosažitelným. Reference se
  přišpendlí až od `(min-width:1081px) and (min-height:780px)` ze stejného důvodu.
- `offsetTop` uvnitř obalu `.stick` je vůči obalu, ne vůči dokumentu. Na scrollování
  v testech používej `getBoundingClientRect().top + scrollY`.
- `prefers-reduced-motion` vrací obojí na `position:relative` — ten blok musí v CSS zůstat
  až za media query s přišpendlením, jinak ho nepřebije.

## Hero video ve variantě 3

Zdroj je v kořeni jako `hero video.mp4` (AI generované, 1280×720, 10 s). Měl v pravém
dolním rohu vodoznak generátoru. Do `web-v3/video/hero.mp4` je nasazená verze bez něj:

```bash
ffmpeg -i "hero video.mp4" -vf "delogo=x=1116:y=548:w=88:h=88" -an \
  -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart web-v3/video/hero.mp4
```

Zvuk se zahazuje (video běží mute), poster `web-v3/img/hero-poster.jpg` je první snímek.
Výsledek je ~630 kB. Vodoznak byl ověřen na výřezech obou spodních rohů po celé délce.

## Objednávkový formulář

Nemá backend. Po odeslání sestaví předvyplněný e-mail přes `mailto:`.
Pokud by se přidával server, musí se řešit ochrana proti spamu a souhlas se zpracováním údajů.

## Spuštění náhledu

```bash
python3 -m http.server 8744 --directory web
```

V Claude Code je připravená konfigurace v `.claude/launch.json` (`preview_start` → „web“,
„web-v2“ na portu 8745, „web-v3“ na portu 8746, „rozcestnik“ nad kořenem na portu 8747).

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
Ve **variantě 3** taky `.is-in`, ale **45** prvků.

Tři pasti, na které se dá narazit znovu:
- `window.scrollTo(y)` se kvůli `scroll-behavior:smooth` projeví až po chvíli. Když se
  poloha čte hned, vyjde stará hodnota (a vypadá to, že prvek je přišpendlený, i když není).
  Buď počkej ~0,5 s, nebo použij `scrollTo({top:y, behavior:'instant'})`.
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
