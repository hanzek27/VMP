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

/** Emoji per topic, purely decorative — keeps the picker scannable. */
export const TOPIC_ICONS = {
  pojmy: '📖',
  'svetla-plavidel': '🚦',
  'zvukove-signaly': '🔊',
  'znaky-vodni-cesty': '🪧',
  'plavebni-provoz': '↔️',
  'komory-mosty': '🌉',
  'stani-kotveni': '⚓',
  'snizena-viditelnost': '🌫️',
  'vodni-sporty': '🏄',
  'technicke-doklady': '📋',
  'prvni-pomoc': '🚑',
  'pojmy-lodi': '📖',
  'typy-plachetnic': '⛵',
  'konstrukce-vystroj': '🔧',
  'stabilita-trup': '⚖️',
  'aerodynamika-plachet': '💨',
  kormidlo: '🎡',
  'plachteni-manevry': '🧭',
  'colreg-obecne': '📜',
  'vyhybaci-pravidla': '↔️',
  'svetla-znaky-lodi': '🚦',
  'nouzove-signaly': '🆘',
  'namorni-pravo': '⚖️',
  'navigace-kompas': '🧭',
  'namorni-mapy': '🗺️',
  'iala-lateralni': '🔴',
  'iala-kardinalni': '🟡',
  meteorologie: '🌦️',
  'bezpecnost-zachrana': '🛟',
}

export const topicLabel = (categoryId, topicId) =>
  TOPICS[categoryId]?.[topicId] ?? topicId

export const topicIcon = (topicId) => TOPIC_ICONS[topicId] ?? '•'
