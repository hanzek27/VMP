#!/usr/bin/env node
/**
 * Rebuilds src/data/bank.json and public/img/ from the official question sets
 * published by Státní plavební správa.
 *
 *   npm run scrape
 *
 * The source markup is a plain table, one <tr class="bg"> block per question:
 * a numbered header row, an "Otázka" row (text and/or an image), then three
 * answer rows where the correct one is labelled "Správná odpověď a)". Both the
 * question and the individual answers may carry images.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { classifyBank } from './classify.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const IMG_DIR = join(ROOT, 'public', 'img')
const BANK = join(ROOT, 'src', 'data', 'bank.json')
const CACHE = join(ROOT, '.cache')

const IMG_BASE = 'http://www.spspraha.cz/zkousky/images/'
const SOURCES = {
  M: 'http://www.spspraha.cz/zkousky/otazky.asp?zp=M%202015',
  S: 'http://www.spspraha.cz/zkousky/otazky.asp?zp=S%202015',
  C: 'http://www.spspraha.cz/zkousky/otazky.asp?zp=C',
}

const decode = (s) =>
  s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim()

const imagesIn = (frag) =>
  [...frag.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1].split('/').pop())

function cell(frag, where) {
  const t = decode(frag.replace(/<img[^>]*>/g, ''))
  const img = imagesIn(frag)
  if (!t && !img.length) throw new Error(`empty ${where}`)
  return { ...(t ? { t } : {}), ...(img.length ? { img } : {}) }
}

function parse(html, setId) {
  return html
    .split(/<tr class="bg">/)
    .slice(1)
    .map((raw) => {
      const num = raw.match(/č\.\s*<span[^>]*>\s*(\d+)\s*<\/span>/)
      const group = raw.match(/Zkratka souboru otázek:<\/i><\/span>\s*([^<]+?)\s*</)
      const question = raw.match(/>Otázka<\/th>([\s\S]*?)<\/tr>/)
      if (!num || !question) throw new Error(`${setId}: unparseable block`)

      const rows = [
        ...raw.matchAll(
          />(Správná\s+)?[Oo]dpověď&nbsp;([a-z])\)<\/th>([\s\S]*?)<\/tr>/g
        ),
      ]
      const correct = rows.findIndex((r) => r[1])
      if (correct === -1) throw new Error(`${setId} #${num[1]}: no correct answer marked`)
      if (rows.length < 2) throw new Error(`${setId} #${num[1]}: ${rows.length} answers`)

      return {
        n: Number(num[1]),
        g: group ? group[1] : '?',
        ...cell(question[1], `${setId} #${num[1]} question`),
        correct,
        a: rows.map((r, i) => cell(r[3], `${setId} #${num[1]} answer ${i}`)),
      }
    })
}

/** Cache the source HTML so re-running the parser doesn't hammer the server. */
async function fetchPage(id, url) {
  const file = join(CACHE, `${id}.html`)
  if (existsSync(file) && !process.argv.includes('--refresh')) {
    console.log(`  ${id}: using cached HTML (pass --refresh to re-download)`)
    return readFile(file, 'utf8')
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
  const html = await res.text()
  await mkdir(CACHE, { recursive: true })
  await writeFile(file, html)
  console.log(`  ${id}: downloaded ${(html.length / 1024).toFixed(0)} kB`)
  return html
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true })

  const bank = {}
  const images = new Set()

  console.log('Fetching question sets…')
  for (const [id, url] of Object.entries(SOURCES)) {
    const questions = parse(await fetchPage(id, url), id)
    bank[id] = questions
    for (const q of questions) {
      for (const i of q.img ?? []) images.add(i)
      for (const a of q.a) for (const i of a.img ?? []) images.add(i)
    }
    const groups = [...new Set(questions.map((q) => q.g))].sort()
    console.log(`  ${id}: ${questions.length} questions, ${groups.length} sets (${groups.join(', ')})`)
  }

  console.log(`\nDownloading images (${images.size} referenced)…`)
  let fetched = 0
  for (const name of images) {
    const dest = join(IMG_DIR, name)
    if (existsSync(dest)) continue
    const res = await fetch(IMG_BASE + name)
    if (!res.ok) {
      console.warn(`  ! ${name}: HTTP ${res.status}`)
      continue
    }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()))
    fetched++
  }
  console.log(`  ${fetched} new, ${images.size - fetched} already present`)

  // topics are derived, so re-apply them here — a scrape would otherwise wipe them
  classifyBank(bank)

  await writeFile(BANK, JSON.stringify(bank))
  const totals = Object.entries(bank).map(([k, v]) => `${k}=${v.length}`).join(' ')
  console.log(`\nWrote ${BANK} (${totals}), topics applied`)
}

main().catch((err) => {
  console.error('\nscrape failed:', err.message)
  process.exit(1)
})
