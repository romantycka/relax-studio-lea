// ═══════════════════════════════════════════════════════════════
//  AKTUALITY — nastavení (vyplňuje se JEDNOU, při spuštění webu)
// ═══════════════════════════════════════════════════════════════
//
//  Sem patří odkaz na publikovanou Google tabulku, do které majitelka
//  vkládá odkazy na své facebookové příspěvky. Web si ji načítá sám,
//  takže na webu se už nic upravovat nemusí.
//
//  Jak tabulku připravit — jednorázově, podrobný postup je v README.md:
//    1. Vytvořit Google tabulku, do sloupce A se vkládají odkazy.
//    2. Soubor → Sdílet → Publikovat na webu → formát „hodnoty oddělené
//       čárkami (.csv)“ → Publikovat.
//    3. Vygenerovanou adresu (končí na output=csv) vložit sem do uvozovek.
//
//  Dokud je pole prázdné, web zobrazuje označenou ukázku.
// ═══════════════════════════════════════════════════════════════

const TABULKA_AKTUALIT = "";

// Záloha pro případ, že by tabulka nešla načíst — sem může správce webu
// vložit odkazy ručně. Běžně zůstává prázdné.
const FB_PRISPEVKY = [];
