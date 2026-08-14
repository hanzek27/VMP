/**
 * Taháky – prose cheat sheets that explain *why* a signal looks the way it
 * does, instead of drilling the question one more time.
 *
 * A sheet is pure data so the renderer (components/Cheatsheet.jsx) stays dumb
 * and a second sheet is a matter of adding another object to the list. Each one
 * points at a category + topic so the reader can jump straight into practising it.
 *
 * Block kinds:
 *   lead    – a paragraph
 *   rules   – numbered "why it is like that" items  { t, d }
 *   cards   – picture + meaning, optionally with the daytime shape
 *             { img, day, t, d, tag }
 *   signals – a sound signal drawn as its rhythm      { code, t, d, tag }
 *   facts   – tight key/value list                  { k, v }
 *   warn    – a caveat callout
 *
 * Image names are the same files the questions use (public/img).
 *
 * A `signals` code is one char per blip: L long (4 s), S short (1 s), V very
 * short, B a series of strokes on the bell (4 s), `-` a gap between groups and
 * `…` "and it carries on". The written-out `t` says the same thing, so the strip
 * is decoration – nothing depends on reading it.
 */
export const CHEATSHEETS = [
  {
    id: 'svetla-m',
    categoryId: 'M',
    topic: 'svetla-plavidel',
    icon: '🚦',
    title: 'Světla a znaky plavidel',
    subtitle: 'M a M20 · 82 otázek okruhu',
    lead:
      'Osmdesát dva otázek vypadá jako osmdesát dva nezávislých obrázků, ale ' +
      'není to tak. Celý systém stojí na čtyřech světlech, na jednom pravidle ' +
      'pro svislé sloupce, na hranici sedmi metrů a na tom, že každá barva má ' +
      'jeden význam. Když si sedne těchhle pár věcí, zbytek se dá u většiny ' +
      'obrázků odvodit.',
    sections: [
      /* ------------------------------------------------------------- 1 */
      {
        icon: '🧭',
        title: 'Čtyři světla, ze kterých se skládá skoro všechno',
        blocks: [
          {
            kind: 'lead',
            text:
              'Poziční světla neříkají, co plavidlo dělá – říkají, kde je a ' +
              'kam je natočené. Jsou jen čtyři a jejich sektory nejsou ' +
              'náhodná čísla.',
          },
          {
            kind: 'facts',
            items: [
              {
                k: 'Vrcholové',
                v: 'silné bílé, 225°, vysoko a co nejvíc vpředu',
              },
              {
                k: 'Boční',
                v: 'jasné, zelené na pravoboku a červené na levoboku, každé 112,5°',
              },
              { k: 'Záďové', v: 'jasné nebo obyčejné bílé, 135°' },
              { k: 'Ze všech stran', v: 'nepřerušovaně 360°' },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: '225 + 135 = 360',
                d:
                  'Vrcholové pokrývá celou příďovou půlku a kus boků, záďové ' +
                  'přesně ten zbytek. Dohromady kruh – nikde díra, nikde ' +
                  'překryv. Proto ta divná čísla.',
              },
              {
                t: '112,5 + 112,5 = 225',
                d:
                  'Obě boční světla dohromady dávají přesně sektor toho ' +
                  'vrcholového. Zepředu proto vidíš vždycky tři světla naráz.',
              },
              {
                t: 'Ze sektorů se pozná natočení',
                d:
                  'Červené i zelené a nad nimi bílé = jede přímo na mě. Jen ' +
                  'zelené = koukám mu na pravobok. Jen červené = na levobok. ' +
                  'Jen nízké bílé = jsem za ním a předjíždím ho. Celá logika ' +
                  'vyhýbání stojí na tomhle.',
              },
              {
                t: 'Síla světla klesá dozadu',
                d:
                  'Silné vrcholové, jasná boční, záďové smí být i obyčejné. ' +
                  'Zepředu se musí být vidět dřív a dál, protože tam se ' +
                  'sbíhají kurzy.',
              },
              {
                t: 'Denní znaky musí být vidět stejně dobře',
                d:
                  'Tabule a vlajky mají u malých plavidel minimálně ' +
                  '0,6 × 0,6 m. Balóny a kužele lze nahradit čímkoli, co má ' +
                  'z dálky stejný tvar – na materiálu nezáleží, na siluetě ano.',
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------- 2 */
      {
        icon: '🎚',
        title: 'Svislý sloupec světel = stavová hláška',
        blocks: [
          {
            kind: 'lead',
            text:
              'Cokoli visí svisle nad sebou na stěžni, není poziční světlo, ' +
              'ale informace o stavu plavidla. Čte se shora dolů, je to ' +
              'vidět ze všech stran a skoro vždycky k tomu existuje denní ' +
              'dvojník. Tohle je nejvýnosnější tabulka celého okruhu.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: '251.jpg',
                t: 'Červené nad zeleným',
                d: 'Plachetnice, která není malým plavidlem. Smí je nést navíc k bočním a záďovému.',
                tag: 'Rudá nad zelenou = plachty',
              },
              {
                img: '412.jpg',
                t: 'Bílé nad červeným',
                d: 'Plavidlo lodivodské služby.',
                tag: 'White over red – pilot ahead',
              },
              {
                img: '46.jpg',
                day: '46A.jpg',
                t: 'Červené nad bílým',
                d:
                  'Vážně poškozené plavidlo, plavidlo účastnící se záchranných ' +
                  'prací, plavidlo, které ztratilo manévrovací schopnost, nebo ' +
                  'plavidlo s povolením plavebního úřadu.',
                dayText: 'Za dne červenobílá vlajka – záchranné práce.',
                tag: 'Průšvih nebo záchrana',
              },
              {
                img: '291.jpg',
                day: '292.jpg',
                t: 'Zelené nad bílým',
                d: 'Převozní loď, která nepluje volně (na laně). Nic dalšího nenese.',
                dayText: 'Za dne zelený balón.',
                tag: 'Přívoz',
              },
              {
                img: '491.jpg',
                day: '491A.jpg',
                t: 'Zelené nad bílým + vrcholové bílé',
                d:
                  'Plavidlo, které vleče rybářské sítě. Od přívozu se liší ' +
                  'jediným detailem – samostatným vrcholovým bílým světlem ' +
                  'na druhém stěžni.',
                dayText: 'Za dne dvojitý kužel vrcholy k sobě.',
                tag: 'Nejzáludnější dvojice okruhu',
              },
              {
                img: '2101A.jpg',
                day: '2102A.jpg',
                t: 'Červené nad červeným',
                d: 'Plavidlo ztratilo manévrovací schopnost. Světla 1 m nad sebou.',
                dayText: 'Za dne dva černé balóny 1 m nad sebou.',
                tag: 'Red over red – the captain is dead',
              },
              {
                img: '48.jpg',
                day: '48A.jpg',
                t: 'Červené – bílé – červené',
                d:
                  'Plavidlo s omezenou možností manévrování. Ovládat se dá, ' +
                  'ale špatně, proto je mezi červenými bílé.',
                dayText: 'Za dne balón – dvojitý kužel – balón.',
                tag: 'Nech mu 50 m',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Dvě červená vs. červené–bílé–červené',
                d:
                  'Dvě červená = neřídím vůbec. Červené–bílé–červené = řídím, ' +
                  'ale skoro to nejde. To bílé uprostřed je „ještě ' +
                  'trochu žiju“.',
              },
              {
                t: 'Zelená v sloupci znamená „něco táhnu nebo někam patřím“',
                d:
                  'Plachetnice táhne plachty, rybář sítě, přívoz lano. Zelená ' +
                  'nahoře nebo dole vždycky doprovází činnost, ne poruchu.',
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------- 3 */
      {
        icon: '🚢',
        title: 'Kolik bílých na stěžni, tolik problémů za zádí',
        blocks: [
          {
            kind: 'lead',
            text:
              'U velkých plavidel se počet vrcholových bílých světel řídí ' +
              'jednoduchou úvahou: čím delší a hůř ovladatelnější celek za ' +
              'sebou táhneš, tím víc bílých musíš mít. A vlek se navíc pozná ' +
              'podle žluté.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: '211.jpg',
                t: 'Jedno bílé vrcholové',
                d: 'Samostatně plující plavidlo s vlastním pohonem. Základní sada: vrcholové, boční, záďové.',
              },
              {
                img: '221.jpg',
                day: '222.jpg',
                t: 'Dvě bílá nad sebou + žluté záďové',
                d:
                  'Remorkér v čele vlečné sestavy. Záďové světlo je žluté, ' +
                  'aby ten, kdo pluje za ním, poznal, že nejde o volné ' +
                  'plavidlo, ale o čelo vleku.',
                dayText: 'Za dne žlutý válec.',
              },
              {
                img: '223.jpg',
                t: 'Tři bílá nad sebou',
                d: 'Každý z remorkérů v čele sestavy vlečené více remorkéry vedle sebe.',
              },
              {
                img: '231.jpg',
                t: 'Tři bílá do trojúhelníku',
                d:
                  'Tlačná sestava. Trojúhelník místo svislé řady říká, že ' +
                  'náklad není za lodí, ale před ní.',
              },
              {
                img: '241.jpg',
                t: 'Dvě bílá vedle sebe, každé na svém stěžni',
                d:
                  'Bočně svázaná sestava. Každé plavidlo si drží vlastní ' +
                  'vrcholové a vlastní záďové, boční jsou jen na vnějších bocích.',
              },
              {
                img: '225.jpg',
                day: '226.jpg',
                t: 'Jedno obyčejné bílé ze všech stran',
                d: 'Vlečené plavidlo. Nemá pohon, takže nemá co ukazovat kromě své polohy.',
                dayText: 'Za dne žlutý balón.',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Žlutá = patřím k vleku',
                d:
                  'Žluté záďové na remorkéru, žlutý válec za dne, žlutý balón ' +
                  'na vlečeném. Kdykoli uvidíš ve vleku žlutou, znamená to ' +
                  '„za mnou nebo přede mnou ještě něco je“.',
              },
              {
                t: 'Svisle = vleču, do trojúhelníku = tlačím',
                d:
                  'Dvě nebo tři bílá pod sebou patří vlečné sestavě, tři do ' +
                  'trojúhelníku tlačné. Rozdíl v uspořádání kopíruje rozdíl ' +
                  've tvaru celku.',
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------- 4 */
      {
        icon: '📏',
        title: 'Malé plavidlo: všechno se točí kolem sedmi metrů',
        blocks: [
          {
            kind: 'lead',
            text:
              'U malých plavidel se pravidla lámou na délce 7 m. Pod ní se ' +
              'nevejde stěžeň ani poctivé sektory, takže stačí jedno obyčejné ' +
              'bílé světlo viditelné ze všech stran. Nad ní už se musí dát ' +
              'poznat, kam plavidlo míří.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: '261.jpg',
                t: 'Malé plavidlo s vlastním pohonem',
                d: 'Vrcholové, boční a záďové – stejná sada jako u velkých, jen menší.',
              },
              {
                img: '261D.jpg',
                t: 'Motor, délka do 7 m',
                d: 'Stačí jedno obyčejné bílé světlo viditelné ze všech stran.',
                tag: 'hranice 7 m',
              },
              {
                img: '261BA.jpg',
                t: 'Malé plavidlo, které vleče nebo vede jiné malé plavidlo',
                d:
                  'Vrcholové, boční a záďové. Boční smí být sdružená v jedné ' +
                  'svítilně na přídi – to je ten diagram se zeleno-červeným ' +
                  'kruhem.',
              },
              {
                img: '262.jpg',
                t: 'Vlečené nebo v bočně svázané sestavě vedené malé plavidlo',
                d: 'Obyčejné bílé světlo viditelné ze všech stran.',
              },
              {
                img: '263.jpg',
                t: 'Plachetnice nad 7 m – varianta A',
                d: 'Boční světla (smí být sdružená v jedné svítilně) a záďové světlo. Žádné vrcholové – plachetnice nemá motor.',
              },
              {
                img: '263A.jpg',
                t: 'Plachetnice nad 7 m – varianta B',
                d: 'Tříbarevná svítilna na vrcholu stěžně místo tří samostatných světel.',
              },
              {
                img: '263B.jpg',
                t: 'Plachetnice do 7 m',
                d:
                  'Obyčejné bílé světlo ze všech stran. Blíží-li se jiné ' +
                  'plavidlo, musí kromě toho ukázat druhé obyčejné bílé světlo.',
                tag: 'ten druhý bílý blikanec zkouška miluje',
              },
              {
                img: '264.jpg',
                t: 'Malé plavidlo bez pohonu i bez plachet',
                d: 'Veslice a podobné – obyčejné bílé světlo ze všech stran.',
              },
              {
                img: '265.jpg',
                day: '266.jpg',
                t: 'Plachty a motor současně',
                d: 'Svítí jako motorové plavidlo, protože se jako motorové plavidlo i chová.',
                dayText: 'Za dne černý kužel vrcholem dolů.',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Proč to druhé bílé u malé plachetnice',
                d:
                  'Z jednoho bílého kruhového světla nepoznáš ani směr, ani ' +
                  'jak je loď daleko. Jakmile se někdo blíží, druhé světlo ' +
                  'udělá z bodu dvojici – a dvojice už prozradí vzdálenost ' +
                  'i pohyb.',
              },
              {
                t: 'Kužel vrcholem dolů = mám motor, i když vidíš plachty',
                d:
                  'Bez něj by ti ostatní dávali přednost jako plachetnici. ' +
                  'Kužel je oprava toho, co vidí očima.',
              },
              {
                t: 'Sdružená svítilna a tříbarevná svítilna nejsou totéž',
                d:
                  'Sdružená (červená + zelená v jednom pouzdře) sedí na přídi ' +
                  'a doplňuje ji záďové světlo. Tříbarevná (červená + zelená ' +
                  '+ bílá) sedí na vrcholu stěžně a nahrazuje všechna tři.',
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------- 5 */
      {
        icon: '🎨',
        title: 'Barvy nejsou dekorace',
        blocks: [
          {
            kind: 'lead',
            text:
              'Mimo poziční světla má každá barva jeden ustálený význam. ' +
              'U spousty obrázků stačí poznat barvu a je hotovo.',
          },
          {
            kind: 'facts',
            items: [
              { k: 'Modrá', v: 'nebezpečný náklad – a počet kuželů či světel říká jak moc' },
              { k: 'Modrá přerušovaná', v: 'plavební úřad, policie, celní správa, IZS' },
              { k: 'Žlutá', v: 'vlek nebo práce – „něco tu není normální plavba“' },
              { k: 'Žlutá přerušovaná', v: 'práce na vodní cestě za plavby' },
              { k: 'Zelená u plovoucího stroje', v: 'tudy smíš obeplout' },
              { k: 'Červená u plovoucího stroje', v: 'tudy ne' },
              { k: 'Červenobílá vlajka', v: 'smíš, ale pomalu – chraň mě před vlnobitím' },
            ],
          },
          {
            kind: 'cards',
            items: [
              {
                img: '281.jpg',
                day: '282.jpg',
                t: 'Modré světlo',
                d: 'Plavidlo přepravující nebezpečné věci.',
                dayText: 'Za dne modrý kužel. Jeden, dva nebo tři – viz odstupy níže.',
              },
              {
                img: '432.jpg',
                t: 'Modré přerušované světlo',
                d: 'Plavidlo plavebního úřadu, Policie ČR, obecní policie, Celní správy a složek IZS.',
              },
              {
                img: '47.jpg',
                t: 'Žluté přerušované světlo',
                d: 'Plavidlo vykonávající práci na vodní cestě za plavby.',
              },
              {
                img: '362b.jpg',
                day: '362c.jpg',
                t: 'Zelená na obou stranách',
                d: 'Plovoucí stroj pracující na místě, obeplout lze z obou stran.',
                dayText: 'Za dne dva zelené kosočtverce na každé straně.',
              },
              {
                img: '362.jpg',
                t: 'Červený balón na jedné straně, zelené kosočtverce na druhé',
                d: 'Obeplout lze jen po té straně, kde svítí zelená. Červená stranu zavírá.',
              },
              {
                img: '364b.jpg',
                t: 'Červenobílé vlajky na obou stranách',
                d:
                  'Plovoucí stroj nebo nasedlé či potopené plavidlo – obeplout ' +
                  'lze z obou stran, ale vyžaduje ochranu před vlnobitím.',
              },
              {
                img: '364.jpg',
                t: 'Červenobílá na jedné straně, celočervená na druhé',
                d: 'Obeplout jen po červenobílé straně, a pomalu.',
              },
              {
                img: '372.jpg',
                t: 'Žlutý plovák s radarovým odražečem',
                d: 'Označuje kotvy plavidel, které mohou vytvářet nebezpečí pro plavbu.',
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------- 6 */
      {
        icon: '🆘',
        title: 'Když se něco děje: kývání a kroužení',
        blocks: [
          {
            kind: 'lead',
            text:
              'Statická světla popisují stav. Cokoli se pohybuje – kýve se, ' +
              'krouží, opakuje – je volání o pomoc nebo hlášení poruchy. ' +
              'Tohle je jediné pravidlo, které tuhle skupinu drží pohromadě.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: '2101.jpg',
                day: '2102.jpg',
                t: 'Kývání v půlkruhu',
                d:
                  'Červené světlo (na malém plavidle smí být bílé) kývající se ' +
                  'v půlkruhu = plavidlo ztratilo manévrovací schopnost. ' +
                  'Statická varianta jsou dvě červená světla 1 m nad sebou.',
                dayText: 'Za dne kývání červenou vlajkou v půlkruhu, staticky dva černé balóny.',
              },
            ],
          },
          {
            kind: 'facts',
            items: [
              { k: 'Kroužení', v: 'vlajkou, jiným předmětem nebo světlem = nouze' },
              { k: 'Vlajka + balón', v: 'balón nad nebo pod vlajkou = nouze' },
              { k: 'Červený déšť', v: 'světlice v krátkých intervalech = nouze' },
              { k: 'Padákové světlice', v: 'nebo pochodně s červeným světlem = nouze' },
              { k: '· · · – – – · · ·', v: 'SOS světlem nebo zvukem' },
              { k: 'Zvon a dlouhé tóny', v: 'opakované řady úderů na zvon nebo dlouhé zvukové signály' },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Ztráta manévrovací schopnosti ≠ nouze',
                d:
                  'Kývání červeným světlem je porucha řízení – „nemůžu ' +
                  'uhnout, uhni ty“. Kroužení, světlice a SOS jsou nouze – ' +
                  '„potřebuju pomoc“. Zkouška to rozlišuje.',
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------- 7 */
      {
        icon: '📐',
        title: 'Odstupy, které se prostě musí umět',
        blocks: [
          {
            kind: 'lead',
            text:
              'Tady žádná logika nepomůže, jsou to čtyři čísla. Aspoň se ' +
              'řadí hezky vzestupně podle počtu modrých.',
          },
          {
            kind: 'facts',
            items: [
              { k: '1 modrý kužel / světlo', v: 'stání nejméně 10 m' },
              { k: '2 modré kužele / světla', v: 'stání nejméně 50 m' },
              { k: '3 modré kužele / světla', v: 'stání nejméně 100 m' },
              {
                k: 'Víc než 1 modrá za plavby',
                v: 'plout dál než 50 m, pokud nejde o potkávání nebo předjíždění',
              },
              {
                k: 'Balón – dvojitý kužel – balón',
                v: 'omezená možnost manévrování, nejméně 50 m',
              },
              {
                k: '3 zelená světla do trojúhelníku',
                v: 'nejméně 1000 m od zádi (v obrázcích okruhu není, v otázkách ano)',
              },
            ],
          },
          {
            kind: 'warn',
            text:
              'Pozor na záměnu: 50 m platí jak pro dva modré kužele, tak pro ' +
              'plavidlo s omezenou manévrovací schopností. 100 m jsou tři ' +
              'modré, 1000 m tři zelená.',
          },
        ],
      },

      /* ------------------------------------------------------------- 8 */
      {
        icon: '🗂',
        title: 'Zbytek, který se musí nabiflovat',
        blocks: [
          {
            kind: 'lead',
            text:
              'Co se nevešlo do žádného vzorce. Většinou jde o jednu činnost ' +
              '= jeden znak.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: '271.jpg',
                t: 'Žlutý dvojitý kužel',
                d: 'Plavidlo s povolením přepravovat víc než 12 cestujících, které nepřesahuje 20 m.',
              },
              {
                img: '294.jpg',
                day: '295.jpg',
                t: 'Zelené nad bílým + poziční světla',
                d: 'Volně plující převozní loď. Na rozdíl od té na laně má i boční a záďové světlo.',
                dayText: 'Za dne zelený balón.',
              },
              {
                img: '293.jpg',
                t: 'Bílé světlo na loďce nebo plováku',
                d: 'Loďka nebo plovák nesoucí vodicí lano převozní lodě.',
              },
              {
                img: '313.jpg',
                t: 'Černý balón',
                d: 'Plavidlo stojící bez přímého nebo nepřímého přístupu na břeh.',
              },
              {
                img: '351.jpg',
                day: '352.jpg',
                t: 'Bílá světla na plovácích',
                d: 'Rybářská síť nebo jiné rybolovné zařízení ve vodě.',
                dayText: 'Za dne žluté vlajky na plovácích a černý balón na plavidle.',
              },
              {
                img: '492.jpg',
                day: '492A.jpg',
                t: 'Červené nad dvěma bílými',
                d:
                  'Plavidlo při rybolovu, jehož zařízení zasahuje dál než ' +
                  '150 m od boku. Druhé bílé světlo ukazuje směr, kterým ' +
                  'zařízení sahá.',
                dayText: 'Za dne dvojitý kužel a k němu kužel vrcholem vzhůru ve směru zařízení.',
              },
              {
                img: '371A.jpg',
                t: 'Bílá světla na plovoucím zařízení',
                d: 'Plovoucí těleso nebo zařízení, jehož vhozené kotvy mohou vytvářet nebezpečí pro plavbu.',
              },
              {
                img: '410.jpg',
                t: 'Vlajka A (modrobílá)',
                d: 'Plavidlo zajišťující činnost pod vodní hladinou – potápěči.',
              },
              {
                img: '45.jpg',
                t: 'Přeškrtnuté P s číslem',
                d: 'Zákaz bočního stání plavidel ve vzdálenosti vyznačené na znaku v metrech.',
              },
              {
                img: '2121.jpg',
                t: 'Červený plamenec',
                d: 'Plavidlo s oprávněním přednostního proplutí.',
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------- 9 */
      {
        icon: '🧠',
        title: 'Poslední kontrola před zkouškou',
        blocks: [
          {
            kind: 'rules',
            items: [
              {
                t: 'Světla se nesou od západu do východu slunce a za snížené viditelnosti',
                d: 'Snížená viditelnost je „a navíc“, ne „místo“ – i v poledne v mlze se svítí.',
              },
              {
                t: 'Nejčastější past: přívoz vs. vlečení sítí',
                d: 'Zelené nad bílým je obojí. Rozhoduje samostatné vrcholové bílé světlo – to má rybář, přívoz ne.',
              },
              {
                t: 'Druhá past: dvě červená vs. červené–bílé–červené',
                d: 'Bez řízení vs. špatně ovladatelné. Bílé uprostřed = ještě to nějak jde.',
              },
              {
                t: 'Třetí past: kužel vrcholem dolů vs. dvojitý kužel',
                d:
                  'Černý kužel dolů = plachty i motor. Žlutý dvojitý kužel = ' +
                  'víc než 12 cestujících. Černý dvojitý kužel vrcholy k sobě ' +
                  '= vlečení rybářských sítí.',
              },
              {
                t: 'Když si nevzpomeneš, počítej',
                d:
                  'Kolik světel, jaké barvy, svisle nebo do trojúhelníku. ' +
                  'Většina odpovědí se liší právě v tomhle a ne ve významu.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'zvuky-m',
    categoryId: 'M',
    topic: 'zvukove-signaly',
    icon: '🔊',
    title: 'Zvukové signály',
    subtitle: 'M a M20 · 22 otázek okruhu',
    lead:
      'Zvukové signály vypadají jako dvacet dva náhodných kombinací pípání, ' +
      'ale je to skládačka ze dvou dílků – krátkého a dlouhého zvuku – a ta má ' +
      'gramatiku. Počet krátkých říká, jak moc plavidlo ztrácí kontrolu. Dlouhé ' +
      'zvuky volají „pozor“. A co se donekonečna opakuje, je nouze. Naučit se ' +
      'dá skoro všechno kromě čtyř čísel a jedné pasti se zvonem.',
    sections: [
      /* --------------------------------------------------------------- 1 */
      {
        icon: '⏱',
        title: 'Dva dílky, ze kterých se skládá všechno',
        blocks: [
          {
            kind: 'lead',
            text:
              'Celá abeceda má čtyři znaky a tři z nich se liší jen délkou. ' +
              'Sekundy nejsou dekorace – zkouška se na ně ptá přímo.',
          },
          {
            kind: 'facts',
            items: [
              { k: 'Krátký zvuk', v: '1 sekunda' },
              { k: 'Dlouhý zvuk', v: '4 sekundy' },
              { k: 'Velmi krátký zvuk', v: 'kratší než krátký – používá se jen v řadě za sebou' },
              {
                k: 'Řada úderů na zvon',
                v: '4 sekundy; lze nahradit řadou úderů kovu o kov stejné délky',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: '1 a 4 sekundy – a zvon je taky 4',
                d:
                  'Dlouhý zvuk a řada úderů na zvon trvají stejně dlouho. Zvon ' +
                  'je vlastně „dlouhý zvuk stojícího plavidla“ – a taky se tak ' +
                  'používá, viz mlha.',
              },
              {
                t: 'Materiál je jedno, délka ne',
                d:
                  'Zvon smí zastoupit cokoli, čím jde bušit kov o kov, jen to ' +
                  'musí trvat ty 4 sekundy. Stejná logika jako u balónů a kuželů ' +
                  've světlech: rozhoduje, co je z dálky poznat.',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 2 */
      {
        icon: '🔢',
        title: 'Krátké zvuky se počítají: čím víc, tím méně ovládám',
        blocks: [
          {
            kind: 'lead',
            text:
              'Pět signálů, jeden žebříček. Od „točím volantem“ přes „couvám“ ' +
              'až po „nejde to“. Když si zapamatuješ, že počet roste s velikostí ' +
              'problému, nemusíš si pamatovat pětkrát nic.',
          },
          {
            kind: 'signals',
            items: [
              { code: 'S', t: '1 krátký', d: 'Pluji doprava.', tag: 'kormidlo' },
              { code: 'SS', t: '2 krátké', d: 'Pluji doleva.', tag: 'kormidlo' },
              { code: 'SSS', t: '3 krátké', d: 'Stroj má zpětný chod.', tag: 'stroj' },
              {
                code: 'SSSS',
                t: '4 krátké',
                d: 'Nejsem schopen manévrování.',
                tag: 'už neovládám',
              },
              {
                code: 'SSSSS',
                t: '5 krátkých',
                d: 'Předjíždění nelze uskutečnit – s ohledem na možné nebezpečí kolize.',
                tag: 'odmítnutí',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: '1 – 2 – 3 je kormidlo, kormidlo, stroj',
                d:
                  'Jeden krátký doprava, dva doleva, tři zpětný chod. Přesně ' +
                  'tohle platí i na moři (COLREG), takže se to učíš jen jednou ' +
                  'pro obě zkoušky.',
              },
              {
                t: 'Od čtyř výš už to není manévr, ale hlášení',
                d:
                  'Čtyři = neumím manévrovat, pět = tvůj manévr nepřipouštím. ' +
                  'Ani jedno neříká, kam pluju – proto se to nedá splést s ' +
                  'jedním a dvěma.',
              },
              {
                t: 'Doprava = 1, doleva = 2',
                d:
                  'Zapamatuj si to jako jediné pravidlo a vyřeší ti šest ' +
                  'signálů, ne dva – vrací se to v obratech i ve vyplouvání ' +
                  'z přístavu.',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 3 */
      {
        icon: '🧩',
        title: 'Signál je věta: hlava říká co, ocas kam',
        blocks: [
          {
            kind: 'lead',
            text:
              'Složené signály nejsou nové signály. Vpředu je manévr, vzadu ' +
              'směr – a směr se počítá pořád stejně: jeden krátký doprava, dva ' +
              'krátké doleva.',
          },
          {
            kind: 'signals',
            items: [
              { code: 'L', t: '1 dlouhý', d: 'Pozor.', tag: 'hlava: pozor' },
              {
                code: 'L-S',
                t: '1 dlouhý + 1 krátký',
                d: 'Mám v úmyslu provést obrat doprava.',
              },
              {
                code: 'L-SS',
                t: '1 dlouhý + 2 krátké',
                d: 'Mám v úmyslu provést obrat doleva.',
              },
              {
                code: 'LLL',
                t: '3 dlouhé',
                d: 'Mám v úmyslu přeplout vodní cestu.',
                tag: 'hlava: přeplouvám',
              },
              {
                code: 'LLL-S',
                t: '3 dlouhé + 1 krátký',
                d: 'Mám v úmyslu vyplout z přístavu doprava.',
              },
              {
                code: 'LLL-SS',
                t: '3 dlouhé + 2 krátké',
                d: 'Mám v úmyslu vplout do přístavu doleva.',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Ocas je vždycky směr',
                d:
                  'Ať je vpředu cokoli, jeden krátký na konci znamená doprava a ' +
                  'dva doleva. Nikdy naopak.',
              },
              {
                t: 'Hlava je manévr',
                d:
                  'Jeden dlouhý = „pozor, něco udělám“ (obrat). Tři dlouhé = ' +
                  '„křižuji vodní cestu“ (přístav, přejezd na druhou stranu). ' +
                  'Bez ocasu je to čisté přeplutí.',
              },
              {
                t: 'Manévrové signály jsou pro velká plavidla',
                d:
                  'Otázky na obrat a na odmítnuté předjíždění jsou formulované ' +
                  'pro „plavidlo, které není malým“. Malé plavidlo tyhle signály ' +
                  'nedává.',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 4 */
      {
        icon: '📣',
        title: '„Jeden dlouhý“ je univerzální pozor',
        blocks: [
          {
            kind: 'lead',
            text:
              'Jediný signál, který se v otázkách objevuje pořád znovu, v pěti ' +
              'různých situacích. Pokaždé znamená totéž: pozor, jsem tady, ' +
              'nevidím za rohem.',
          },
          {
            kind: 'facts',
            items: [
              { k: 'Prostě pozor', v: 'základní význam signálu' },
              {
                k: 'Před nepřehlednou úžinou',
                v: 'a je-li úžina dlouhá, opakovat i při proplouvání',
              },
              {
                k: 'Lano přívozu v dráze',
                v: 'žádost o uvolnění plavební dráhy',
              },
              {
                k: 'Za snížené viditelnosti',
                v: 'samostatně plující plavidlo, opakovaně nejméně 1× za minutu',
              },
              {
                k: 'Malé plavidlo v mlze',
                v: 'bez radiolokátoru dává stejný signál – 1 dlouhý za minutu',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 5 */
      {
        icon: '🌫',
        title: 'Mlha: co se opakuje každou minutu',
        blocks: [
          {
            kind: 'lead',
            text:
              'Za snížené viditelnosti se signál opakuje v intervalech ne ' +
              'delších než jedna minuta a rozděluje se podle jedné otázky: ' +
              'pluju, nebo stojím? Kdo pluje, troubí. Kdo stojí, zvoní.',
          },
          {
            kind: 'signals',
            items: [
              {
                code: 'L…',
                t: '1 dlouhý, každou minutu',
                d: 'Samostatně plující plavidlo.',
                tag: 'pluji',
              },
              {
                code: 'LL…',
                t: '2 dlouhé, každou minutu',
                d: 'Sestava plavidel.',
                tag: 'pluji',
              },
              {
                code: 'B…',
                t: '1 řada úderů na zvon, každou minutu',
                d: 'Stojím na levé straně plavební dráhy.',
                tag: 'stojím',
              },
              {
                code: 'B-B…',
                t: '2 řady úderů na zvon, každou minutu',
                d: 'Stojím na pravé straně plavební dráhy.',
                tag: 'stojím',
              },
              {
                code: 'B-B-B…',
                t: '3 řady úderů na zvon, každou minutu',
                d: 'Stojím v neurčité poloze.',
                tag: 'stojím',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Troubení = jedu, zvon = stojím',
                d:
                  'Celá pětice se tím rozpadne na dvě trojice. Zvon nemá jak ' +
                  'oznámit směr, protože stojící plavidlo nikam nepluje – ' +
                  'oznamuje polohu.',
              },
              {
                t: 'Počet dlouhých = kolik nás pluje',
                d: 'Jeden dlouhý jedno plavidlo, dva dlouhé celá sestava. Nic jiného za tím není.',
              },
              {
                t: 'Počet řad na zvon = kde stojím',
                d:
                  'Jedna řada levá strana, dvě řady pravá, tři řady „nevím / ' +
                  'neurčitá poloha“. Tři jsou logické: když nemůžeš říct stranu, ' +
                  'odzvoníš obě a ještě jednu.',
              },
            ],
          },
          {
            kind: 'warn',
            text:
              'Tady se pravidlo „doprava = 1“ obrací! U zvonu je 1 řada LEVÁ ' +
              'strana a 2 řady PRAVÁ. Ty dvě otázky jsou si navzájem nesprávnou ' +
              'odpovědí, takže se na tom dá spolehlivě prohořet. Pomůcka: za ' +
              'plavby se počítá jako na moři (pravá je jednička), za stání se ' +
              'čte jako text – zleva.',
          },
        ],
      },

      /* --------------------------------------------------------------- 6 */
      {
        icon: '🆘',
        title: 'Nouze a kolize: „řada“ bez počtu',
        blocks: [
          {
            kind: 'lead',
            text:
              'Když u signálu není číslo, ale slovo „řada“, nejde o manévr, ale ' +
              'o problém. Který, to prozradí tempo: panika je rychlá, volání ' +
              'o pomoc je dlouhé.',
          },
          {
            kind: 'signals',
            items: [
              {
                code: 'VVVVVVV…',
                t: 'Řada velmi krátkých zvuků',
                d: 'Hrozí nebezpečí kolize. Dává ho ten, kdo kolizi vidí přicházet.',
                tag: 'teď hned',
              },
              {
                code: 'LLL…',
                t: 'Řada dlouhých zvuků',
                d: 'Signál nouze – plavidlo se ocitlo v nouzi a žádá o pomoc.',
                tag: 'potřebuji pomoc',
              },
              {
                code: 'B-B…',
                t: 'Opakované řady úderů na zvon',
                d: 'Rovněž signál nouze. Zvon i troubení tu znamenají totéž.',
                tag: 'potřebuji pomoc',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Rychlé a krátké = kolize, dlouhé a vytrvalé = nouze',
                d:
                  'Zní to jako to, co znamená: velmi krátké zvuky za sebou jsou ' +
                  'zvuková panika o kolizi za pár sekund, dlouhý tón se nese ' +
                  'daleko a znamená „přijeďte“.',
              },
              {
                t: 'Nouze umí obojí',
                d:
                  'Plavidlo v nouzi smí dávat opakované řady úderů na zvon ' +
                  'nebo dlouhé zvukové signály. V otázkách se objevují obě ' +
                  'varianty a obě jsou správně.',
              },
            ],
          },
          {
            kind: 'warn',
            text:
              'O nouzi versus mlhu rozhoduje interval, ne zvuk. „1 dlouhý ' +
              'jednou za minutu“ je mlha. „Řada dlouhých“ jeden za druhým je ' +
              'nouze. Stejně tak 1 řada na zvon za minutu = stojím v mlze, ' +
              'kdežto opakované řady = nouze.',
          },
        ],
      },

      /* --------------------------------------------------------------- 7 */
      {
        icon: '🧠',
        title: 'Poslední kontrola před zkouškou',
        blocks: [
          {
            kind: 'rules',
            items: [
              {
                t: '3 krátké jsou zpětný chod, ne „plnou silou vpřed“',
                d: 'Nejčastější nabízená blbost. Tři krátké = couvám.',
              },
              {
                t: '4 versus 5 krátkých',
                d:
                  '4 = nejsem schopen manévrování (to je o mně). ' +
                  '5 = předjíždění nelze uskutečnit (to je o tobě).',
              },
              {
                t: 'Řada velmi krátkých ≠ 5 krátkých ≠ řada dlouhých',
                d:
                  'Neurčitá řada velmi krátkých = hrozí kolize. Přesně pět ' +
                  'krátkých = zamítnuté předjíždění. Řada dlouhých = nouze. ' +
                  'Všechny tři si zkouška plete navzájem.',
              },
              {
                t: 'Zvon v mlze je naopak',
                d: '1 řada = levá strana, 2 řady = pravá, 3 řady = neurčitá poloha.',
              },
              {
                t: 'Na moři je interval dvě minuty, ne jedna',
                d:
                  'Na vnitrozemí (M) se signál v mlze opakuje nejméně 1× za ' +
                  'minutu, v kategorii C dává loď se strojním pohonem ' +
                  '„jeden prodloužený tón“ v intervalech kratších než dvě ' +
                  'minuty. Nepleť si zkoušky.',
              },
              {
                t: 'Když si nevzpomeneš, počítej a měř',
                d:
                  'Kolik zvuků, jak dlouhých, a je vpředu dlouhý? Většina ' +
                  'nabízených odpovědí se liší jen v tomhle.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'barvy-m',
    categoryId: 'M',
    topic: 'znaky-vodni-cesty',
    icon: '🔴',
    title: 'Barvy, strany a břehy',
    subtitle: 'M a M20 · 106 otázek okruhu',
    lead:
      'Červená a zelená se v otázkách objeví na bocích plavidla, na bójích, na ' +
      'tabulích u břehu i na semaforu plavební komory – pokaždé v jiné úloze. ' +
      'Potíž nedělají barvy, ale směr, od kterého se strana počítá: na plavidle ' +
      'je to příď, na řece proud a na moři cesta z moře do přístavu. Když si u ' +
      'každého znaku nejdřív odpovíš „od čeho se ta strana měří“, zbytek je už ' +
      'jenom dvojice barev a dvojice tvarů.',
    sections: [
      /* --------------------------------------------------------------- 1 */
      {
        icon: '🚥',
        title: 'Jedna dvojice barev, čtyři různé úlohy',
        blocks: [
          {
            kind: 'lead',
            text:
              'Než začneš luštit konkrétní obrázek, zařaď ho. Červená a zelená ' +
              'znamenají něco jiného na plavidle, něco jiného na vodní cestě a ' +
              'úplně jiného na semaforu. Uvnitř každé úlohy je to pak už ' +
              'jednoznačné.',
          },
          {
            kind: 'facts',
            items: [
              {
                k: 'Na plavidle',
                v: 'červená = levobok, zelená = pravobok; říká, kam je plavidlo natočené',
              },
              {
                k: 'Na vodní cestě',
                v: 'červená = pravá strana plavební dráhy, zelená = levá; počítáno po proudu',
              },
              {
                k: 'Na semaforu',
                v: 'červená = nesmíš, zelená = smíš; komory, mostní pole, znaky A a E',
              },
              {
                k: 'V nouzi',
                v: 'červená volá o pomoc nebo hlásí poruchu, zelená nikdy',
              },
            ],
          },
          {
            kind: 'warn',
            text:
              'Většina chytáků stojí na tom, že nabídnutá odpověď použije ' +
              'správnou barvu ve špatné úloze – „červená bóje = mám ji po ' +
              'levoboku“ zní povědomě, protože červená je opravdu levobok, ' +
              'jenže na plavidle, ne na řece.',
          },
        ],
      },

      /* --------------------------------------------------------------- 2 */
      {
        icon: '🚢',
        title: 'Na plavidle: červená vlevo, zelená vpravo',
        blocks: [
          {
            kind: 'lead',
            text:
              'Boční světla jsou to jediné, co se počítá od přídě plavidla. ' +
              'Zelené na pravoboku, červené na levoboku, každé svítí v ' +
              'obzorovém výseku 112,5°. Nad nimi silné bílé vrcholové (225°), ' +
              'vzadu bílé záďové (135°). Nic z toho se nikdy neprohodí, ať ' +
              'plavidlo pluje kamkoli.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: '211.jpg',
                t: 'Samostatně plující plavidlo s vlastním pohonem',
                d:
                  'Vrcholové bílé vpředu a vysoko, boční červené a zelené na ' +
                  'bocích, záďové bílé vzadu. Z každého směru vidíš jinou ' +
                  'kombinaci – a právě z ní poznáš, kam plavidlo míří.',
                tag: 'Zelená vpravo, červená vlevo – od přídě',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Levobok je červený, ať se děje co se děje',
                d:
                  'Boční světla popisují plavidlo, ne okolí. Nezávisí na ' +
                  'proudu, na břehu ani na tom, kudy plaveš. Tohle je jediná ' +
                  'barva v celé zkoušce, která se nikdy nevztahuje k ničemu ' +
                  'vnějšímu.',
              },
              {
                t: 'Z barev se čte natočení',
                d:
                  'Červené i zelené naráz = jede přímo na tebe. Jen zelené = ' +
                  'díváš se mu na pravobok. Jen červené = na levobok. Jen ' +
                  'bílé nízko = koukáš mu na záď a předjíždíš ho.',
              },
              {
                t: 'Červená napravo znamená, že ustupuješ ty',
                d:
                  'Když se kurzy kříží a vidíš červené světlo, máš druhé ' +
                  'plavidlo zpravidla po svém pravoboku – a plavidlo, které má ' +
                  'druhé na pravém boku, dává přednost. Zelené světlo tedy ' +
                  'obvykle znamená, že přednost máš ty. Rozhoduje ale poloha, ' +
                  'ne barva: barva je jen rychlá kontrola, že sis polohu ' +
                  'přečetl správně.',
              },
              {
                t: 'Zbytek světel rozebírá jiný tahák',
                d:
                  'Sloupce světel na stěžni, hranice sedmi metrů a denní ' +
                  'znaky jsou v taháku Světla a znaky plavidel. Tady jde jen ' +
                  'o to, že boční světla jsou zdrojem té „správné“ představy ' +
                  'červená–vlevo, kterou pak na řece nesmíš použít.',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 3 */
      {
        icon: '🌊',
        title: 'Na vodní cestě: strany se počítají po proudu',
        blocks: [
          {
            kind: 'lead',
            text:
              'Pravý a levý břeh nejsou „vpravo a vlevo ode mě“. Určují se ve ' +
              'směru po proudu, tedy směrem k ústí; proti proudu se pluje k ' +
              'prameni. Plavební dráha má strany podle stejného klíče, a znaky ' +
              'se kvůli tomu, kudy zrovna plaveš, nepřebarvují.',
          },
          {
            kind: 'facts',
            items: [
              { k: 'Pravá strana dráhy', v: 'červená, tvar válce – červená válcová bóje' },
              { k: 'Levá strana dráhy', v: 'zelená, tvar kužele – zelená kuželová bóje' },
              {
                k: 'Rozdělení dráhy',
                v: 'koule s vodorovnými červenými a zelenými pruhy',
              },
              {
                k: 'Bílé „P“ na bóji strany',
                v: 'plavební dráha vede podél míst stání',
              },
              { k: 'Po proudu', v: 'směr k ústí – tímhle směrem se strany pojmenovaly' },
              { k: 'Proti proudu', v: 'směr k prameni – strany zůstávají, otočil ses jen ty' },
            ],
          },
          {
            kind: 'cards',
            items: [
              {
                img: 'II1A.jpg',
                t: 'Červená válcová bóje',
                d: 'Pravá strana plavební dráhy.',
                tag: 'Červená = válec = pravá',
              },
              {
                img: 'II2b.jpg',
                t: 'Zelená kuželová bóje',
                d: 'Levá strana plavební dráhy.',
                tag: 'Zelená = kužel = levá',
              },
              {
                img: 'II3A.jpg',
                t: 'Koule s červenými a zelenými pruhy',
                d:
                  'Rozdělení plavební dráhy – místo, kde se dráha dělí. Obě ' +
                  'barvy naráz proto, že za bójí pokračují obě strany.',
              },
              {
                img: 'II4B.jpg',
                t: 'Bílé písmeno P na bóji strany',
                d:
                  'Plavební dráha vede podél míst stání. Písmeno se přidává k ' +
                  'běžné bóji strany, barva a tvar zůstávají v původním významu.',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Tvar nese tutéž informaci jako barva',
                d:
                  'Válec vpravo, kužel vlevo. V protisvětle, za šera nebo při ' +
                  'barvosleposti je silueta jediné, co zbude – proto se ' +
                  'tvarová dvojice objevuje i ve vrcholových znacích a na ' +
                  'tabulích u břehu.',
              },
              {
                t: 'Bóje strany označuje kraj dráhy, ne překážku',
                d:
                  'Voda pro tebe je mezi červenou a zelenou. Bóje neříká ' +
                  '„tady je něco“, ale „tady dráha končí“.',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 4 */
      {
        icon: '🪧',
        title: 'Tytéž strany na břehu, jen v jiném tvaru',
        blocks: [
          {
            kind: 'lead',
            text:
              'Znaky umístěné na břehu říkají, kde v korytě dráha leží nebo kde ' +
              'je nebezpečí. Barva funguje stejně jako u bójí – červená patří k ' +
              'pravému břehu, zelená k levému – a tvar tu barvu podruhé ' +
              'potvrzuje: pravý břeh dostává čtverec nebo obdélník, levý ' +
              'trojúhelník nebo kosočtverec.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: '4b.jpg',
                t: 'Červená obdélníková tabule',
                d: 'Plavební dráha při pravém břehu.',
                tag: 'Pravý břeh: červená, hranatá',
              },
              {
                img: '5b.jpg',
                t: 'Zelený trojúhelník v bílém kosočtverci',
                d: 'Plavební dráha při levém břehu.',
                tag: 'Levý břeh: zelená, špičatá',
              },
              {
                img: '4f.jpg',
                t: 'Červený kužel vrcholem dolů',
                d: 'Nebezpečné místo nebo překážka při pravém břehu.',
              },
              {
                img: '5f.jpg',
                t: 'Zelený kužel vrcholem vzhůru',
                d: 'Nebezpečné místo nebo překážka při levém břehu.',
              },
              {
                img: '1f1.jpg',
                t: 'Červenobíle pruhovaná tyč s červeným válcem',
                d: 'Označení překážky při pravém břehu.',
              },
              {
                img: '2f.jpg',
                t: 'Zelenobíle pruhovaná tyč se zeleným kuželem',
                d: 'Označení překážky při levém břehu.',
              },
              {
                img: '4d.jpg',
                t: 'Žlutočerný čtverec',
                d:
                  'Pravobřežní přechodový signální znak – dráha přechází od ' +
                  'jednoho břehu ke druhému.',
                tag: 'Barva mlčí, stranu říká tvar',
              },
              {
                img: '5d.jpg',
                t: 'Žlutočerný kosočtverec',
                d: 'Levobřežní přechodový signální znak.',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Přechodové znaky jsou výjimka: nejsou červenozelené',
                d:
                  'Jsou žluté s černým svislým pruhem a stranu prozradí jen ' +
                  'tvar – čtverec je pravobřežní, kosočtverec levobřežní. ' +
                  'Je to jediná dvojice v okruhu, kde barva o straně nic neříká.',
              },
              {
                t: 'Tabule může udávat i vzdálenost',
                d:
                  'Znak „plavební dráha je vzdálena od pravého (levého) břehu ' +
                  '10 m“ pracuje se stejným pojmem strany – měřeno po proudu.',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 5 */
      {
        icon: '🔁',
        title: 'Proč to nesedí s tvými vlastními světly',
        blocks: [
          {
            kind: 'lead',
            text:
              'Tady vzniká skoro celý zmatek. Obě soustavy jsou samy o sobě ' +
              'jednoduché, ale každá měří stranu od něčeho jiného, takže se ' +
              'navzájem nepotvrzují.',
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Plujeme po proudu: červené bóje po pravoboku',
                d:
                  'Pravá strana dráhy je červená a při plavbě po proudu je ' +
                  'tvá pravá strana totožná s pravou stranou dráhy. Zelené ' +
                  'kužele máš tedy po levoboku – přesně naopak, než svítíš ty sám.',
              },
              {
                t: 'Plujeme proti proudu: červené bóje po levoboku',
                d:
                  'Bóje se nepřebarvily, otočil ses ty. Pravá strana dráhy je ' +
                  'pořád táž strana koryta, jen ji teď míjíš zleva.',
              },
              {
                t: 'Nehledej v tom souhlas s bočními světly',
                d:
                  'Boční světla popisují plavidlo, bóje popisují koryto. Že ' +
                  'používají tytéž dvě barvy, je historická shoda, ne ' +
                  'pravidlo, ze kterého se dá jedno odvodit z druhého.',
              },
              {
                t: 'Příkazové tabule řady B mluví naopak o tvých bocích',
                d:
                  '„Příkaz plout ke straně plavební dráhy, která je po levém ' +
                  'boku“ nebo „přeplout na stranu, která je po pravém boku“ – ' +
                  'tady se strana měří od tebe. Táž tabule proto pro protijedoucí ' +
                  'loď znamená druhou stranu koryta.',
              },
            ],
          },
          {
            kind: 'warn',
            text:
              'Jednoduchá kontrola u každé otázky: mluví se o boku plavidla ' +
              '(levobok, pravobok, „po levém boku“), nebo o straně dráhy či ' +
              'břehu (levá strana, pravý břeh)? První je od přídě, druhé po proudu.',
          },
        ],
      },

      /* --------------------------------------------------------------- 6 */
      {
        icon: '⚓',
        title: 'Na moři je totéž popsané z druhé strany (kategorie C)',
        blocks: [
          {
            kind: 'lead',
            text:
              'Laterální značení IALA nepoužívá proud, ale směr značení: z ' +
              'moře do přístavu. Barvy a tvary jsou stejné jako na řece – ' +
              'červená je válec, zelená kužel – jen se strana nepojmenovává, ' +
              'nýbrž se rovnou říká, kterým bokem bóji minout. Proto se otázky ' +
              'vždycky ptají „plujete z moře do přístavu“ nebo „z přístavu na ' +
              'moře“: bez směru odpověď neexistuje.',
          },
          {
            kind: 'facts',
            items: [
              { k: 'Z moře do přístavu', v: 'červená válcová po levoboku, zelená kuželová po pravoboku' },
              { k: 'Z přístavu na moře', v: 'obráceně – červená po pravoboku, zelená po levoboku' },
              { k: 'Vrcholový znak', v: 'kopíruje tvar bóje: červený válec, zelený kužel vrcholem vzhůru' },
              { k: 'Hlavní dráha vpravo', v: 'červená válcová s jedním širokým zeleným pásem' },
              { k: 'Hlavní dráha vlevo', v: 'zelená kuželová s jedním širokým červeným pásem' },
            ],
          },
          {
            kind: 'cards',
            items: [
              {
                img: 'N03.jpg',
                t: 'Červená válcová bóje',
                d: 'Z moře do přístavu ji musíš minout na levoboku.',
                tag: 'Do přístavu: červená vlevo',
              },
              {
                img: 'N04.jpg',
                t: 'Zelená kuželovitá bóje',
                d: 'Z moře do přístavu ji musíš minout na pravoboku.',
              },
              {
                img: 'N05.jpg',
                t: 'Červená tyčová bóje s červeným válcem',
                d: 'Z přístavu na moře ji mineš na pravoboku – táž bóje, opačný směr.',
                tag: 'Na moře: všechno naopak',
              },
              {
                img: 'N06.jpg',
                t: 'Zelená tyčová bóje se zeleným kuželem',
                d: 'Z přístavu na moře ji mineš na levoboku.',
              },
              {
                img: 'N11.jpg',
                t: 'Červená válcová se zeleným pásem',
                d: 'Hlavní plavební dráha vede vpravo.',
              },
              {
                img: 'N12.jpg',
                t: 'Zelená kuželová s červeným pásem',
                d: 'Hlavní plavební dráha vede vlevo.',
              },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Řeka a moře si neodporují, jen se dívají z opačného konce',
                d:
                  'Směr značení na moři vede z moře do přístavu, tedy zhruba ' +
                  'proti proudu. Bóje, kterou při vplouvání máš po levoboku, ' +
                  'stojí u téhož břehu, který se z pohledu po proudu jmenuje ' +
                  'pravý – a ten je červený i na řece. Mění se pojmenování, ' +
                  'ne strana koryta.',
              },
              {
                t: 'Bóji s pásem čti podle hlavní barvy',
                d:
                  'Chovej se k ní, jako by pás neexistoval, a jsi v hlavní ' +
                  'dráze. Červenou válcovou tedy mineš po levoboku, čímž ti ' +
                  'hlavní dráha zůstane vpravo. Pás v druhé barvě jenom říká, ' +
                  'že na opačnou stranu odbočuje vedlejší dráha.',
              },
              {
                t: 'Vrcholový znak nemá vlastní fantazii',
                d:
                  'Červená bóje nese válec, nikdy kouli ani kužel. Zelená ' +
                  'nese kužel vrcholem vzhůru, nikdy válec ani kouli. Dvě ze ' +
                  'tří nabízených odpovědí bývají právě tyhle nesmysly.',
              },
            ],
          },
          {
            kind: 'warn',
            text:
              'Otázky pracují se systémem IALA v evropské podobě (region A). ' +
              'V Americe a Japonsku jsou laterální barvy prohozené – u zkoušky ' +
              'to nepotřebuješ, ale ať tě to nezaskočí v cizí příručce.',
          },
        ],
      },

      /* --------------------------------------------------------------- 7 */
      {
        icon: '🟡',
        title: 'Znaky, které žádnou stranu neurčují',
        blocks: [
          {
            kind: 'lead',
            text:
              'Ne každá bóje je o levé a pravé. Tyhle tři skupiny mluví o ' +
              'vodě kolem sebe a vypadají stejně na řece i na moři – poznáš je ' +
              'podle toho, že v nich červená a zelená vedle sebe nejsou.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: '8e1.jpg',
                t: 'Červenobílé svislé pruhy',
                d:
                  'Vyznačení bezpečných vod. Svislé pruhy proto, že bóje nemá ' +
                  'strany – splavno je kolem dokola.',
                tag: 'Svislé pruhy = bezpečná voda',
              },
              {
                img: 'N15.jpg',
                t: 'Táž bóje na moři',
                d:
                  'Červené a bílé svislé pruhy znamenají bezpečnou vodu i v ' +
                  'systému IALA – kolem bóje je splavná voda.',
              },
              {
                img: '8d.jpg',
                t: 'Černá s červeným pruhem, dvě koule nad sebou',
                d:
                  'Označení na překážce, kterou lze bezpečně obeplout. Na ' +
                  'moři je to izolované nebezpečí: černá s jedním nebo více ' +
                  'širokými červenými pruhy.',
                tag: 'Černočervená = stůj nad tím, obepluj to',
              },
              {
                img: 'N27.jpg',
                t: 'Celožlutá bóje',
                d:
                  'Zvláštní účel – pásmo vojenských cvičení, rekreační pásmo, ' +
                  'uložené kabely nebo potrubí. Žlutá nikdy neznamená stranu ' +
                  'dráhy.',
              },
              {
                img: 'A1_1.jpg',
                t: 'Žlutá bóje s vrcholovým znakem',
                d:
                  'Na vnitrozemské cestě označuje místo sestupu potápěčů – ' +
                  'plavba blíž než 25 m od bóje je zakázána. Zase žlutá, zase ' +
                  '„něco zvláštního“.',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 8 */
      {
        icon: '🧭',
        title: 'Kardinální bóje: černá a žlutá místo červené a zelené (C)',
        blocks: [
          {
            kind: 'lead',
            text:
              'Kardinální značení neřeší stranu dráhy, ale světovou stranu: ' +
              'říká, kterým směrem od bóje je splavná voda. Proto má jiné ' +
              'barvy – černou a žlutou – a nedá se splést s laterálním. Celá ' +
              'skupina se dá odvodit z jednoho pravidla.',
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Černá je tam, kam ukazují kužely',
                d:
                  'Vrcholový znak jsou dva černé kužely a jejich špičky ' +
                  'ukazují, kde na bóji leží černá barva. Když si zapamatuješ ' +
                  'kužely, barvu těla už nemusíš – a naopak.',
              },
              {
                t: 'Splavná voda je na té straně, kterou bóje pojmenovává',
                d:
                  'Severní kardinální bóje znamená „splavná voda je severně ' +
                  'ode mě“, tedy sever obeplouvej severem. Žádné otáčení ' +
                  'významu tu není.',
              },
            ],
          },
          {
            kind: 'facts',
            items: [
              { k: 'Sever', v: 'oba kužely vzhůru; černá nahoře, žlutá dole' },
              { k: 'Jih', v: 'oba kužely dolů; žlutá nahoře, černá dole' },
              { k: 'Východ', v: 'kužely podstavami k sobě; černá s jedním žlutým pruhem' },
              { k: 'Západ', v: 'kužely špičkami k sobě; žlutá s jedním černým pruhem' },
            ],
          },
          {
            kind: 'cards',
            items: [
              {
                img: 'N17.jpg',
                t: 'Oba kužely vzhůru',
                d: 'Severní bóje – splavná voda severně od ní.',
                tag: 'Špičky nahoru = černá nahoře',
              },
              {
                img: 'N19.jpg',
                t: 'Oba kužely dolů',
                d: 'Jižní bóje – splavná voda jižně od ní.',
                tag: 'Špičky dolů = černá dole',
              },
              {
                img: 'N16.jpg',
                t: 'Kužely podstavami k sobě',
                d:
                  'Východní bóje – splavná voda východně od ní. Špičky míří ' +
                  'nahoru i dolů, a tak je černá nahoře i dole.',
              },
              {
                img: 'N18.jpg',
                t: 'Kužely špičkami k sobě',
                d:
                  'Západní bóje – splavná voda západně od ní. Špičky se ' +
                  'potkávají uprostřed, takže černý je prostřední pruh. Tvar ' +
                  'připomíná sklenku na víno, „W“ jako West.',
              },
            ],
          },
        ],
      },

      /* --------------------------------------------------------------- 9 */
      {
        icon: '🚦',
        title: 'Červená a zelená v roli semaforu',
        blocks: [
          {
            kind: 'lead',
            text:
              'Třetí úloha barev nemá se stranami nic společného: červená ' +
              'zakazuje, zelená povoluje, obojí naráz znamená „za chvíli, ' +
              'připrav se“. Platí to u plavebních komor, u mostních polí i u ' +
              'znaků řady A a E.',
          },
          {
            kind: 'cards',
            items: [
              {
                img: 'A1a.jpg',
                t: 'Červená – bílá – červená, vodorovně',
                d: 'Zákaz proplutí. Táž zpráva existuje i jako světla nebo vlajky.',
                tag: 'Zákaz leží',
              },
              {
                img: 'E1A.jpg',
                t: 'Zelená – bílá – zelená, svisle',
                d: 'Povolení proplutí.',
                tag: 'Povolení stojí',
              },
              {
                img: 'A11A.jpg',
                t: 'Červené a zelené světlo vedle sebe',
                d:
                  'Proplutí je zakázáno, ale je třeba připravit se k plavbě. ' +
                  'Stejná dvojice u plavební komory znamená totéž: vplutí ' +
                  'zatím ne, komora se chystá otevřít.',
              },
            ],
          },
          {
            kind: 'facts',
            items: [
              { k: 'Dvě červená nad sebou', v: 'komora není v provozu' },
              { k: 'Jedno nebo dvě červená vedle sebe', v: 'komora je zavřena' },
              { k: 'Červené a zelené vedle sebe', v: 'připravuje se otevření komory' },
              { k: 'Jedno nebo dvě zelená vedle sebe', v: 'vplutí je možné' },
              { k: 'Červená při vyplouvání', v: 'vyplutí není možné' },
              {
                k: 'Mostní pole s červenými světly',
                v: 'nebo červenými tabulemi s bílým pruhem – proplutí zakázáno',
              },
            ],
          },
          {
            kind: 'warn',
            text:
              'Zelené světlo u komory nebo u mostu neznamená „levá strana ' +
              'dráhy“ a červená bóje neznamená „stůj“. Podle čeho poznat, o ' +
              'kterou úlohu jde: co je na břehu, na mostě nebo na komoře, je ' +
              'semafor; co plave ve vodě a má tvar válce nebo kužele, je strana.',
          },
        ],
      },

      /* -------------------------------------------------------------- 10 */
      {
        icon: '🆘',
        title: 'A ještě jednou červená: nouze a porucha',
        blocks: [
          {
            kind: 'lead',
            text:
              'Poslední úloha červené je nejstarší: přitáhnout pozornost. ' +
              'Zelená v ní nevystupuje nikdy, takže každá odpověď se zeleným ' +
              'nouzovým signálem je špatně.',
          },
          {
            kind: 'facts',
            items: [
              { k: 'Červený déšť ze světlic', v: 'nouze, opakuje se v krátkých intervalech' },
              { k: 'Padáková světlice nebo pochodeň', v: 'červené světlo = nouze a potřeba pomoci' },
              { k: 'Kývání červeným světlem v půlkruhu', v: 'ztráta manévrovací schopnosti (na malém plavidle smí být bílé)' },
              { k: 'Kývání červenou vlajkou', v: 'totéž za dne' },
              { k: 'Červený plamenec na přídi', v: 'oprávnění přednostního proplutí' },
              { k: 'Oranžový dým', v: 'nouze – dým je oranžový, ne červený ani žlutý' },
            ],
          },
          {
            kind: 'rules',
            items: [
              {
                t: 'Porucha není nouze',
                d:
                  'Kývání červeným světlem hlásí „nemůžu uhnout“. Světlice, ' +
                  'kroužení a SOS znamenají „potřebuju pomoc“. Zkouška obojí ' +
                  'nabízí vedle sebe.',
              },
              {
                t: 'Zelená a nouze nejdou dohromady',
                d:
                  'Tři zelená světla, zelené pochodně ani zelené hvězdy nejsou ' +
                  'nouzové signály. Vždycky je to nabídnutá past.',
              },
            ],
          },
        ],
      },

      /* -------------------------------------------------------------- 11 */
      {
        icon: '🧠',
        title: 'Poslední kontrola před zkouškou',
        blocks: [
          {
            kind: 'rules',
            items: [
              {
                t: 'Bok, nebo strana?',
                d:
                  'Levobok a pravobok se počítají od přídě. Levá a pravá ' +
                  'strana dráhy a levý a pravý břeh se počítají po proudu. ' +
                  'Přečti si otázku ještě jednou a zjisti, o kterou dvojici jde.',
              },
              {
                t: 'Červená válcová = pravá strana dráhy',
                d:
                  'Na řece se neptáme, kterým bokem ji minout – to záleží na ' +
                  'tom, jestli plaveš po proudu, nebo proti němu.',
              },
              {
                t: 'Na moři je bez směru otázka neúplná',
                d:
                  'Z moře do přístavu: červená po levoboku. Z přístavu na ' +
                  'moře: červená po pravoboku. Zadání ten směr vždycky ' +
                  'obsahuje, takže ho hledej dřív než barvu.',
              },
              {
                t: 'Válec je červený, kužel zelený – všude',
                d:
                  'Na vnitrozemské cestě i na moři, u bóje i u vrcholového ' +
                  'znaku. Zelený válec ani červený kužel neexistují.',
              },
              {
                t: 'Žlutočerná je přechod nebo světová strana',
                d:
                  'Na řece žlutočerný přechodový znak (čtverec pravý břeh, ' +
                  'kosočtverec levý), na moři kardinální bóje. Nikdy strana ' +
                  'plavební dráhy.',
              },
              {
                t: 'Svislé červenobílé pruhy = bezpečná voda',
                d:
                  'Vodorovné červenozelené pruhy naproti tomu znamenají ' +
                  'rozdělení plavební dráhy. Pruhy jsou stejné, směr pruhů ne.',
              },
            ],
          },
        ],
      },
    ],
  },
]


export const getCheatsheet = (id) => CHEATSHEETS.find((s) => s.id === id)

