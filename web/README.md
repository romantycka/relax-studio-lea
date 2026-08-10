# Relax studio LEA — web

Statický web (HTML + CSS + JS), bez závislostí a bez nutnosti serveru s databází.

## Struktura

```
web/
├── index.html      — celý web (jedna stránka se sekcemi)
├── css/style.css
├── js/main.js
└── img/            — fotky a logo
```

## Lokální spuštění

```bash
python3 -m http.server 8000
```

Pak otevřít `http://localhost:8000`.

## Nasazení

Nahrát obsah složky `web/` na hosting (funguje i zdarma na Netlify, Vercel, GitHub Pages).

## Aktuality z Facebooku

Profil `facebook.com/leona.roubkova.3` je **osobní profil**, ne firemní stránka.
Facebook pro osobní profily nenabízí automatický „feed widget“ (ten funguje jen pro
stránky), umožňuje ale oficiální vkládání **jednotlivých veřejných příspěvků**.

Aby majitelka nemusela sahat na kód ani nic nahrávat na hosting, odkazy na příspěvky
zadává do **Google tabulky**. Web si tabulku načítá sám při každém načtení stránky.

### Jednorázové nastavení (dělá správce webu)

1. Založit Google tabulku — nejrychleji naimportováním přiloženého vzoru
   `vzor-tabulky-aktuality.csv` (v Google Sheets: *Soubor → Importovat*).
   Vzor už obsahuje popisky sloupců i stručný návod přímo v řádcích.
   Odkazy patří do sloupce **A**, druhý sloupec je na poznámky — web z něj nic nebere.
2. V tabulce: **Soubor → Sdílet → Publikovat na webu**.
   Vybrat formát **„hodnoty oddělené čárkami (.csv)“** a kliknout na *Publikovat*.
3. Vygenerovanou adresu (končí na `output=csv`) vložit do `js/aktuality.js`
   na řádek `const TABULKA_AKTUALIT = "";` mezi uvozovky.
4. Majitelce poslat odkaz na tabulku (ideálně jako záložku v prohlížeči)
   a dát jí oprávnění k úpravám.

### Co dělá majitelka (cca minuta, žádný kód)

1. Příspěvek na Facebooku musí mít viditelnost **Veřejné** (ikonka zeměkoule).
   Nastavuje se při psaní příspěvku, u staršího přes ⋯ → *Upravit soukromí*.
2. U příspěvku kliknout na ⋯ → **Kopírovat odkaz**.
3. Otevřít Google tabulku a odkaz vložit do prvního volného řádku (Ctrl/⌘ + V).

Hotovo — nic se neukládá ani nenahrává, Google tabulka se ukládá sama.
Web zobrazí **tři nejnovější** příspěvky (od shora), starší řádky můžou v tabulce zůstat.
Aktualizace se projeví do několika minut, než Google publikovanou verzi obnoví.

### Pojistky

- Když tabulka není vyplněná nebo se nepodaří načíst, web ukáže **označenou ukázku**
  (návštěvník pozná, že nejde o skutečné příspěvky) — sekce nikdy nezůstane prázdná.
- V `js/aktuality.js` je pole `FB_PRISPEVKY` pro ruční záložní seznam, kdyby Google
  tabulka dlouhodobě vypadla. Běžně zůstává prázdné.

### Cesta k plné automatice

Jediný způsob, jak dostat feed, který se plní úplně sám bez tabulky, je převést profil
na firemní stránku (Facebook to umí bez ztráty fotek a přátel:
*Nastavení → Vytvořit stránku z profilu*). Pak stačí v `index.html` nahradit obsah
`<div id="fbFeed">` oficiálním Page Pluginem.

## Objednávkový formulář

Formulář nemá backend — po odeslání otevře e-mailového klienta s předvyplněnou zprávou
na `leonaroubkova@centrum.cz`. Pokud bude potřeba odesílání přímo z webu, dá se doplnit
službou typu Formspree nebo Netlify Forms.
