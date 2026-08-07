/**
 * Taháky – prose cheat sheets that explain *why* a signal looks the way it
 * does, instead of drilling the question one more time.
 *
 * A sheet is pure data so the renderer (components/Cheatsheet.jsx) stays dumb
 * and a second sheet is a matter of pushing another object here. It points at
 * a category + topic so the reader can jump straight into practising it.
 *
 * Block kinds:
 *   lead   – a paragraph
 *   rules  – numbered "why it is like that" items  { t, d }
 *   cards  – picture + meaning, optionally with the daytime shape
 *            { img, day, t, d, tag }
 *   facts  – tight key/value list                  { k, v }
 *   warn   – a caveat callout
 *
 * Image names are the same files the questions use (public/img).
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
]

export const getCheatsheet = (id) => CHEATSHEETS.find((s) => s.id === id)
