import bank from './data/bank.json'

/**
 * Exam parameters come from the Státní plavební správa exam rules; the question
 * banks are scraped from spspraha.cz (see tools-parse.mjs).
 */
export const CATEGORIES = [
  {
    id: 'M',
    name: 'M a M20',
    subtitle: 'Vůdce malého plavidla – vnitrozemské vodní cesty',
    questionCount: 35,
    passMark: 30,
    timeLimitMin: 30,
    accent: 'ocean',
  },
  {
    id: 'S',
    name: 'S a S20',
    subtitle: 'Doplňková zkouška pro plachetnice',
    questionCount: 14,
    passMark: 11,
    timeLimitMin: 10,
    accent: 'sail',
  },
  {
    id: 'C',
    name: 'C – příbřežní plavba na moři',
    subtitle: 'Námořní jachtařský průkaz – příbřežní plavba',
    questionCount: 28,
    passMark: 24,
    timeLimitMin: 25,
    accent: 'sea',
  },
]

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id)

export const getQuestions = (id) => bank[id]

/** Human-readable names for the question-set codes, where the source provides them. */
const GROUP_LABELS = {
  M1: 'Meteorologie',
  MP1: 'Mezinárodní právo a předpisy',
  MP2: 'Mezinárodní právo a předpisy',
  MP3: 'Mezinárodní právo a předpisy',
  MP4: 'Mezinárodní právo a předpisy',
  N1: 'Navigace',
  N2: 'Navigace',
  N3: 'Navigace',
  N4: 'Navigace',
  Z1: 'Bezpečnost a záchrana života na moři',
}

export const groupLabel = (code) => GROUP_LABELS[code] || code

/** Question counts per source question-set, used for proportional sampling. */
export function groupSizes(categoryId) {
  const sizes = new Map()
  for (const q of bank[categoryId]) sizes.set(q.g, (sizes.get(q.g) || 0) + 1)
  return sizes
}

export const totalQuestions = (id) => bank[id].length
