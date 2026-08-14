/**
 * Thematic topics, one map per exam category. Key order defines display order.
 *
 * Single source of truth: `tools/classify.mjs` imports this to assign
 * `q.topic`, and the app imports it to label and group questions. Adding a
 * topic here does nothing on its own — it also needs a rule in classify.mjs.
 */
export const TOPICS = {
  M: {
    pojmy: 'Pojmy a definice',
    'svetla-plavidel': 'Světla a znaky plavidel',
    'zvukove-signaly': 'Zvukové signály',
    'znaky-vodni-cesty': 'Signální znaky na vodní cestě',
    'plavebni-provoz': 'Plavební provoz a přednost',
    'komory-mosty': 'Plavební komory a mosty',
    'stani-kotveni': 'Stání, kotvení a vyvazování',
    'snizena-viditelnost': 'Snížená viditelnost',
    'vodni-sporty': 'Vodní sporty a zvláštní činnosti',
    'technicke-doklady': 'Technické požadavky a doklady',
    'prvni-pomoc': 'První pomoc',
  },
  S: {
    'pojmy-lodi': 'Pojmy, části lodi a lanoví',
    'typy-plachetnic': 'Typy plachetnic a trupů',
    'konstrukce-vystroj': 'Konstrukce, plachty a výstroj',
    'stabilita-trup': 'Stabilita a hydrodynamika trupu',
    'aerodynamika-plachet': 'Aerodynamika plachet a síly',
    kormidlo: 'Kormidlo a ovládání',
    'plachteni-manevry': 'Plachtění a manévry',
  },
  C: {
    'colreg-obecne': 'COLREG – obecná ustanovení',
    'vyhybaci-pravidla': 'Vyhýbací pravidla',
    'svetla-znaky-lodi': 'Světla a znaky lodí',
    'nouzove-signaly': 'Nouzové a zvukové signály',
    'snizena-viditelnost': 'Snížená viditelnost',
    'namorni-pravo': 'Námořní právo',
    'navigace-kompas': 'Navigace a kompas',
    'namorni-mapy': 'Námořní mapy',
    'iala-lateralni': 'Značení IALA – laterální',
    'iala-kardinalni': 'Značení IALA – kardinální',
    meteorologie: 'Meteorologie',
    'bezpecnost-zachrana': 'Bezpečnost a záchrana',
  },
}

/** Icon name per topic (see components/Icon.jsx) – keeps the picker scannable. */
export const TOPIC_ICONS = {
  pojmy: 'book',
  'svetla-plavidel': 'light',
  'zvukove-signaly': 'horn',
  'znaky-vodni-cesty': 'sign',
  'plavebni-provoz': 'crossing',
  'komory-mosty': 'bridge',
  'stani-kotveni': 'anchor',
  'snizena-viditelnost': 'fog',
  'vodni-sporty': 'lifering',
  'technicke-doklady': 'clipboard',
  'prvni-pomoc': 'firstaid',
  'pojmy-lodi': 'book',
  'typy-plachetnic': 'sailboat',
  'konstrukce-vystroj': 'wrench',
  'stabilita-trup': 'hull',
  'aerodynamika-plachet': 'wind',
  kormidlo: 'wheel',
  'plachteni-manevry': 'tack',
  'colreg-obecne': 'scroll',
  'vyhybaci-pravidla': 'crossing',
  'svetla-znaky-lodi': 'light',
  'nouzove-signaly': 'sos',
  'namorni-pravo': 'law',
  'navigace-kompas': 'compass',
  'namorni-mapy': 'map',
  'iala-lateralni': 'buoy',
  'iala-kardinalni': 'cardinal',
  meteorologie: 'weather',
  'bezpecnost-zachrana': 'lifering',
}

export const topicLabel = (categoryId, topicId) =>
  TOPICS[categoryId]?.[topicId] ?? topicId

export const topicIcon = (topicId) => TOPIC_ICONS[topicId] ?? 'rings'
