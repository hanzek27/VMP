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
libovolného podadresáře.

## Funkce

**Tři režimy u každé kategorie**

- **Test** – náhodný výběr otázek v počtu podle zkoušky, bodování, odpočet času
  a výsledek prospěl/neprospěl.
- **Procvičování** – projde *všechny* otázky daného souboru, nikdy se neboduje
  a neběží v něm čas. Správnost se ukazuje hned po odpovědi.
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
```

Skript `tools/scrape.mjs` znovu vytvoří `src/data/bank.json` a doplní chybějící
obrázky do `public/img/`. Při změně struktury zdrojové stránky skončí chybou
místo tichého vynechání otázek.

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
  data/bank.json         792 otázek
public/img/              242 obrázků k otázkám
tools/scrape.mjs         aktualizace databáze ze spspraha.cz
```

Neoficiální pomůcka pro přípravu – závazné je vždy zadání skutečné zkoušky.
