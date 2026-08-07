# VMP Testy

Přípravná aplikace na zkoušky vůdce malého plavidla. Otázky pocházejí
z oficiálních souborů otázek Státní plavební správy
([spspraha.cz](http://www.spspraha.cz/zkousky/)) a jsou uložené lokálně, takže
aplikace funguje i bez připojení.

## Kategorie

| Kategorie | Otázek v testu | K úspěchu | Limit | Otázek v databázi |
| --------- | -------------: | --------: | ----: | ----------------: |
| `M a M20` – vnitrozemské vodní cesty | 35 | 30 | 30 min | 407 |
| `S a S20` – plachetnice | 14 | 11 | 10 min | 170 |
| `C` – příbřežní plavba na moři | 28 | 24 | 25 min | 215 |

## Spuštění

```bash
npm install
npm run dev      # vývojový server
npm run build    # produkční build do dist/
npm run preview  # náhled produkčního buildu
```

Build je plně statický a `base` je relativní, takže `dist/` lze nasadit do
libovolného podadresáře. Musí být servírovaný přes **HTTPS** (nebo
`localhost`), jinak se neaktivuje service worker a s ním offline režim
a instalace.

## Instalace do telefonu

Aplikace je **PWA** – dá se nainstalovat na plochu a pak běží ve vlastním okně
bez adresního řádku, i úplně bez signálu.

- **Android / Chrome:** tlačítko „Instalovat aplikaci“ na úvodní obrazovce
  (nebo menu prohlížeče → *Přidat na plochu*).
- **iPhone / Safari:** *Sdílet* → *Přidat na plochu*.

Offline funguje aplikace i otázky vždy; obrázky (≈ 5 MB) se ukládají postupně,
jak na ně narazíte, nebo je lze stáhnout naráz v **Nastavení → Offline
a instalace**. Systémové tlačítko *zpět* zavírá otevřené panely a z běžícího
testu se ptá na potvrzení – aplikace se jím omylem neukončí. Novou verzi
aplikace nabídne lišta dole; nasadí se až po potvrzení, aby nespadl rozdělaný
test.

## Funkce

**Čtyři režimy u každé kategorie**

- **Test** – náhodný výběr otázek v počtu podle zkoušky, bodování, odpočet času
  a výsledek prospěl/neprospěl.
- **Procvičování** – projde *všechny* otázky daného souboru, nikdy se neboduje
  a neběží v něm čas. Správnost se ukazuje hned po odpovědi.
- **Procvičit okruh** – projde jen otázky vybraného tématického okruhu
  (např. „Světla a znaky plavidel“). Neboduje se a neběží v něm čas.
- **Jen moje chyby** – projde jen otázky, na které jste někdy odpověděli špatně.
  Nabídne se, až nějaké chyby máte. Neboduje se a neběží v něm čas.

### Seznam chyb

Otázka se do seznamu přidá, jakmile na ni **v jakémkoli režimu** odpovíte
špatně, a zmizí z něj, jakmile na ni odpovíte správně. Přeskočené otázky se
nepočítají. Seznam je per kategorie, ukládá se do `localStorage` podle čísla
otázky (přežije tedy i nové stažení databáze) a jde vymazat v Nastavení.

**Nastavení** (ukládá se do `localStorage`)

| Volba | Popis |
| --- | --- |
| Vypnout časový limit | Test běží bez odpočtu, čas se jen měří. |
| Označit správnou odpověď | Správná možnost je zvýrazněná ještě před odpovědí. |
| Okamžitá zpětná vazba | Hned po zvolení odpovědi se ukáže, zda byla správná. |
| Náhodné pořadí otázek | Platí i pro procvičování. |
| Náhodné pořadí odpovědí | Viz poznámka níže – ve výchozím stavu zapnuto. |

**Další**

- Přehled otázek s vyznačením zodpovězených a označených k revizi.
- Rozbor odpovědí po testu, s filtrem „jen chybné“ a rychlým přechodem do
  režimu opakování chyb.
- Úspěšnost podle jednotlivých souborů otázek.
- Historie posledních 20 pokusů.
- Klávesové zkratky: `1` / `2` / `3` odpověď, `←` / `→` navigace, `F` označit
  k revizi.
- Responzivní design, podpora světlého i tmavého režimu.

## Jak se vybírají otázky

Testová sada se losuje **proporčně podle souborů otázek** (`PP1`, `PP2`, …)
metodou největších zbytků, aby složení testu odpovídalo složení databáze a
nepřevažoval náhodně jeden okruh. Viz `allocate()` v `src/lib/exam.js`.

> **Pozor:** zdrojová stránka uvádí správnou odpověď vždy jako první možnost.
> Aplikace proto odpovědi standardně míchá; vypnutí volby „Náhodné pořadí
> odpovědí“ dává smysl jen při pročítání otázek, ne při testu.

## Aktualizace otázek

```bash
npm run scrape            # z lokální cache v .cache/, jinak stáhne
npm run scrape -- --refresh   # vynutí nové stažení stránek
npm run classify              # přepočítá tématické okruhy
npm run classify -- --report  # + ukázky otázek v každém okruhu
```

Skript `tools/scrape.mjs` znovu vytvoří `src/data/bank.json` a doplní chybějící
obrázky do `public/img/`. Při změně struktury zdrojové stránky skončí chybou
místo tichého vynechání otázek. Na závěr sám spustí klasifikaci, takže okruhy
zůstanou zachovány.

## Tématické okruhy

Oficiální soubory otázek (`PP2 2015`, `MP1`, …) jsou tématicky jen volné – samotné
`PP2 2015` míchá světla plavidel, přednost v plavbě, plavební komory, stání,
sníženou viditelnost i vodní lyžování. Skript `tools/classify.mjs` proto každé
otázce přiřadí **okruh** (`q.topic`); celkem jich je 30:

| Kategorie | Okruhy |
| --- | --- |
| M | Pojmy a definice · Světla a znaky plavidel · Zvukové signály · Signální znaky na vodní cestě · Plavební provoz a přednost · Plavební komory a mosty · Stání, kotvení a vyvazování · Snížená viditelnost · Vodní sporty · Technické požadavky a doklady · První pomoc |
| S | Pojmy, části lodi a lanoví · Typy plachetnic a trupů · Konstrukce, plachty a výstroj · Stabilita a hydrodynamika trupu · Aerodynamika plachet a síly · Kormidlo a ovládání · Plachtění a manévry |
| C | COLREG – obecná ustanovení · Vyhýbací pravidla · Světla a znaky lodí · Nouzové a zvukové signály · Snížená viditelnost · Námořní právo · Navigace a kompas · Námořní mapy · Značení IALA laterální · Značení IALA kardinální · Meteorologie · Bezpečnost a záchrana |

Klasifikace je **odvozená** – nikdy neupravujte `topic` ručně v `bank.json`,
změňte pravidla a spusťte `npm run classify`.

## Struktura

```
src/
  categories.js          parametry zkoušek + názvy okruhů
  lib/exam.js            losování, míchání, bodování, režimy
  lib/storage.js         nastavení, historie a seznam chyb v localStorage
  components/
    Home.jsx             výběr kategorie a režimu
    Settings.jsx         přepínače nastavení
    Exam.jsx             průběh testu, časomíra, přehled
    QuestionView.jsx     otázka a odpovědi (sdílí test i rozbor)
    Result.jsx           výsledek, rozbor, úspěšnost po okruzích
    OfflineSection.jsx   stav offline cache + instalace (v Nastavení)
    UpdateToast.jsx      nabídka nové verze
  lib/pwa.js             registrace service workeru, instalace, offline cache
  lib/backGuard.js       systémové tlačítko zpět
  topics.js              názvy okruhů (sdílí appka i classify.mjs)
  data/bank.json         792 otázek včetně tématických okruhů
public/img/              242 obrázků k otázkám
public/manifest.webmanifest  + ikony pro instalaci
tools/scrape.mjs         aktualizace databáze ze spspraha.cz
tools/classify.mjs       pravidla pro tématické okruhy
tools/sw.js              šablona service workeru (jen pro build)
tools/vite-plugin-pwa.mjs  vygeneruje dist/sw.js se seznamem souborů
```

Neoficiální pomůcka pro přípravu – závazné je vždy zadání skutečné zkoušky.
