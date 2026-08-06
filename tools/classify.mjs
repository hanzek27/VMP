#!/usr/bin/env node
/**
 * Assigns a thematic topic to every question in src/data/bank.json.
 *
 *   npm run classify           # reclassify + write back
 *   npm run classify -- --report   # also print samples per topic
 *
 * The official question sets (`PP2 2015`, `MP1`, …) are only loosely thematic —
 * `PP2 2015` alone mixes vessel lights, right of way, locks, mooring, reduced
 * visibility and water-skiing. This script cuts across them with ordered
 * keyword rules: first match wins, and anything unmatched falls back to the
 * dominant topic of its source set, so every question always gets a topic.
 *
 * Rules are matched against the lowercased question text. Order is significant –
 * put the specific patterns above the general ones.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BANK = join(ROOT, 'src', 'data', 'bank.json')

// Topic labels live with the app so there is exactly one source of truth.
export { TOPICS } from '../src/topics.js'
import { TOPICS } from '../src/topics.js'

/** Fallback when no rule matches: the dominant topic of the source set. */
const GROUP_DEFAULT = {
  M: {
    'PP1 2015': 'pojmy',
    'PP2 2015': 'plavebni-provoz',
    'PP3 2015': 'svetla-plavidel',
    'PP4 2015': 'znaky-vodni-cesty',
    'TZ 2015': 'technicke-doklady',
    'ZP 2015': 'prvni-pomoc',
  },
  S: {
    'P1 2015': 'pojmy-lodi',
    'P2 2015': 'konstrukce-vystroj',
    'P3 2015': 'stabilita-trup',
    'P4 2015': 'plachteni-manevry',
  },
  C: {
    MP1: 'colreg-obecne',
    MP2: 'vyhybaci-pravidla',
    MP3: 'svetla-znaky-lodi',
    MP4: 'namorni-pravo',
    N1: 'navigace-kompas',
    N2: 'namorni-mapy',
    N3: 'iala-lateralni',
    N4: 'iala-kardinalni',
    M1: 'meteorologie',
    Z1: 'bezpecnost-zachrana',
  },
}

const RULES = {
  M: [
    // whole sets that are unambiguously one topic
    ['prvni-pomoc', (t, g) => g === 'ZP 2015'],
    ['technicke-doklady', (t, g) => g === 'TZ 2015'],

    // "Zvukový signál «...» znamená" – questions about signal meaning
    ['zvukove-signaly', /^zvukový signál|^signál "|řada úderů na zvon ve smyslu|^opakované řady úderů/],

    // fixed marks on the waterway (boards, lights, buoys) – not vessel lights
    ['znaky-vodni-cesty', /signální znak|signální znaky|výstražní znaky|bóji pro označení strany plavební dráhy/],

    // lights and day marks carried by vessels
    ['svetla-plavidel', (t, g) => g === 'PP3 2015'],

    // before the vessel-light rule: lock signal lights are lock questions
    ['komory-mosty', /plavební komor|plavebních komor|plavebními komor|plavebníc?h? ?komorou|proplav|most/],

    [
      'svetla-plavidel',
      /musí nést|může nést|musí .*signalizovat|za dne signalizovat|v nouzi|vrcholovým světlem|bočními světly|záďovým světlem|světlem viditelným|balóny a kužele|tabulí a vlajek|modré světlo|modrý kužel|modré kužele|modrá světla|zelená světla|černý balón/,
    ],
    ['snizena-viditelnost', /snížené viditelnosti|podmínky viditelnosti|podmínek snížené/],
    ['vodni-sporty', /lyžování|lyžař|potápění|koupán|koupající|skokům nad vodní|pod vodní hladinou|vymezené vodní ploch/],
    ['stani-kotveni', /stání|stojící|kotv|vyvazování|vyvazují|vyvazovat|nasedlých|odrazník/],
    // definitions stay definitions even when they mention a topical keyword
    ['pojmy', (t, g) => g === 'PP1 2015' && /se rozumí|^termín|^výraz|označuje|je ve smyslu/.test(t)],
    [
      'plavebni-provoz',
      /předjížd|předjet|potkávání|úžin|kříží|křížení|obrat|přednost|rychlost|vlnobití|sání|proti proudu|přikázaným směrem|bezpečnou vzdálenost|vedle sebe|kolize|sestav|vlečení|více než 12 cestujících|vodního stavu/,
    ],
    ['pojmy', /se rozumí|^termínem|označuje|^výraz/],
  ],

  S: [
    // definition-form questions and named parts of the boat / rigging
    [
      'pojmy-lodi',
      /^výraz|^výrazem|ploutvová skříň|přední vaz|klounovec|rolfok|^kokpit|takeláž|persenink|lodní kulatiny|^čelen|saling|^stěh|upínačka|úpona|topenanta|napínák|ráhno \(vratipeň\)|^šekl|otěží?m?e?|spoušť nebo výtah|^kiking je|^blok|příďový trojúhelník|refovací aparát|lanoví|^laterál je|^jola |^šarpie /,
    ],
    // hull and keel types
    [
      'typy-plachetnic',
      /kýlová plachetnice|kýlovou plachetnici|ploutvokýlová|ploutvová plachetnice|ploutvových plachetnic|jolovým tvarem|šarpiovým tvarem|tvarem trupu|konstrukce trupu|lodní těleso závodních/,
    ],
    ['kormidlo', /kormid/],
    ['konstrukce-vystroj', /^trysail/],
    // aerodynamic theory that happens to be phrased "při plavbě …"
    ['aerodynamika-plachet', /výslednice sil|aerodynamick|profil[uyem]* plachty|účinnost profilu/],
    // manoeuvres and points of sail — must beat the generic "výhoda" rule
    [
      'plachteni-manevry',
      /křižov|vyostřování|odpadání|^obrat|halsa|přehození ráhna|zvrhnutí|poryv|^plavba |při plavbě|při jízdě na|návětrná strana|závětrná strana|stoupavost|kolébání|vleku havarované|posádka|přeostření/,
    ],
    [
      'aerodynamika-plachet',
      /zdánliv|profil|proudění|obtékání|přetlak|výsledná síla|síla větru na plachty|nastavení plachet|nastavení hlavní plachty|nastavená plachta|nastavení kosatky|aktivní plocha plachty|spinaker se používá|vliv kosatky|těžiště plachet|pohonná síla|vějička|plachta je v základě|boční sílu na plachtě/,
    ],
    [
      'stabilita-trup',
      /stabilit|náklon|vztlak|výtlak|těžiště|laterál|rovnovážn|setrvačnost|hydrodynamick|hydrostatick|odpor|skluz|plavat těleso|návětrnost|závětrnost|trup|kýl|ploutv|rychlost plachetnice|vada/,
    ],
    [
      'konstrukce-vystroj',
      /výhod|nevýhod|charakterizuje|typickým znakem|konstruován|vlastnost|požadovanou|slouží|materiál|plachtovin|barvu|kladky|refování|kasání|^genua|^spinakr|kosatka|bezanová|trysail|bouřkov|otěžový vozík|automatická|samovylévací|stěžeň|stěžňová/,
    ],
  ],

  C: [
    ['meteorologie', (t, g) => g === 'M1'],
    ['bezpecnost-zachrana', (t, g) => g === 'Z1'],
    ['iala-kardinalni', (t, g) => g === 'N4'],
    ['iala-lateralni', (t, g) => g === 'N3'],
    ['namorni-mapy', (t, g) => g === 'N2'],
    ['navigace-kompas', (t, g) => g === 'N1'],
    ['namorni-pravo', (t, g) => g === 'MP4'],

    ['nouzove-signaly', /nouzov[éý]|rakety|granáty|padáková|pochodeň|dýmový signál|vzpažuje|zvukové signály|zvukový signál|prodloužený tón|oznamuje plavidlu v dohledu/],
    ['snizena-viditelnost', /snížené viditelnost|snížené viditelnosti|mlze|mlhov/],
    ['svetla-znaky-lodi', /takto označen|kuželový znak|světel|světla|světlech|pravidla týkající se světel/],
    // only the vessel-against-vessel rules; the general duties stay in colreg-obecne
    [
      'vyhybaci-pravidla',
      /uvolnit cestu|uvolní cestu|uvolnit? cestu|přibližují-li se|křižují kur[sz]y|předjížd|předjíždějící|úzkým průplavem|úzkého průplavu|lov ryb|plachetnice, mající vítr/,
    ],
    // lookout, safe speed, risk of collision, action to avoid — COLREG's general part
    [
      'colreg-obecne',
      /mezinárodní pravidla|za plavby znamená|pozorování|bezpečné rychlosti|nebezpečí srážky|zabránění srážce|zabránit srážce|sblížení se s|bagrovací/,
    ],
  ],
}

const test = (rule, text, group) =>
  typeof rule === 'function' ? rule(text, group) : rule.test(text)

export function classify(categoryId, question) {
  const text = (question.t || '').toLowerCase()
  for (const [topic, rule] of RULES[categoryId] ?? []) {
    if (test(rule, text, question.g)) return topic
  }
  return GROUP_DEFAULT[categoryId]?.[question.g] ?? 'ostatni'
}

/** Adds/refreshes `topic` on every question. Mutates and returns the bank. */
export function classifyBank(bank) {
  for (const [cat, questions] of Object.entries(bank)) {
    for (const q of questions) q.topic = classify(cat, q)
  }
  return bank
}

// ---------------------------------------------------------------- CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const bank = classifyBank(JSON.parse(readFileSync(BANK, 'utf8')))
  const report = process.argv.includes('--report')

  for (const [cat, questions] of Object.entries(bank)) {
    const counts = new Map()
    for (const q of questions) counts.set(q.topic, (counts.get(q.topic) || 0) + 1)

    console.log(`\n===== ${cat} (${questions.length}) =====`)
    for (const id of Object.keys(TOPICS[cat])) {
      const n = counts.get(id) || 0
      const bar = '█'.repeat(Math.round(n / 3))
      console.log(`  ${String(n).padStart(4)}  ${id.padEnd(22)} ${bar} ${TOPICS[cat][id]}`)
      if (report && n) {
        questions
          .filter((q) => q.topic === id)
          .slice(0, 4)
          .forEach((q) => console.log(`         · ${q.t.replace(/\n/g, ' ').slice(0, 78)}`))
      }
    }
    const unknown = [...counts.keys()].filter((k) => !TOPICS[cat][k])
    for (const u of unknown) console.log(`  !! ${counts.get(u)} in unknown topic "${u}"`)
  }

  writeFileSync(BANK, JSON.stringify(bank))
  console.log(`\nWrote ${BANK}`)
}
