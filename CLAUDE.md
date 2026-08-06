# CLAUDE.md — VMP Testy

Practice-exam app for the Czech **vůdce malého plavidla** (small-craft skipper)
licence. Static React SPA, no backend. All UI copy is in **Czech**.

Repo: `hanzek27/VMP` · `/home/honza/MY_shit/VMP`

> **Git is off-limits.** Never `git add`, `git commit`, or `git push` — the user
> handles all version control themselves. See [Working agreements](#working-agreements).

## Commands

```bash
npm run dev       # dev server (:5173)
npm run build     # static build → dist/
npm run preview   # serve dist/ (:4173, or --port)
npm run scrape    # rebuild src/data/bank.json + public/img from spspraha.cz
```

`vite.config.js` sets `base: './'` so `dist/` can be dropped into any
subdirectory. Keep it that way.

## The three exam categories

Parameters come from the exam rules and live in `src/categories.js`:

| id | name | drawn | pass | limit | bank |
| -- | ---- | ----: | ---: | ----: | ---: |
| `M` | M a M20 (inland) | 35 | 30 | 30 min | 407 |
| `S` | S a S20 (sail) | 14 | 11 | 10 min | 170 |
| `C` | C – příbřežní plavba na moři | 28 | 24 | 25 min | 215 |

⚠️ These pass marks came from the user's original brief and were **never
independently confirmed** against current SPS rules. Don't present them as
verified.

## Question data — read this before touching the scraper

Source: `http://www.spspraha.cz/zkousky/otazky.asp?zp=...`, scraped by
`tools/scrape.mjs` into `src/data/bank.json` (~240 kB, bundled) plus 242 images
in `public/img/`. Source HTML is cached in `.cache/` (gitignored);
`npm run scrape -- --refresh` forces a re-download.

Non-obvious properties of the source markup, each of which cost a bug:

1. **The correct answer is always listed first** — every one of the 792
   questions has it as option `a)`. The app therefore shuffles options by
   default (`shuffleAnswers`). Turning that setting off makes the test
   worthless; the Settings copy says so.
2. The correct-answer row reads `Správná odpověď&nbsp;a)` — **lowercase `o`**,
   unlike the `Odpověď&nbsp;b)` rows. A regex expecting `[Oo]dpověď` is
   required or the correct answer is silently missed.
3. An answer row can span **two `<td>`s** (text + image). Match to `</tr>`, not
   to the first `</td>`.
4. **Both questions and individual answers can carry images.** Some C questions
   (IALA buoyage) have image-only answers with no text at all.
5. Every question has exactly 3 options. Question numbers (`q.n`) are unique
   within a category.

The scraper **throws** on unexpected markup rather than silently dropping
questions. Keep it that way — a silent drop would corrupt the bank invisibly.

### bank.json shape

```jsonc
{ "M": [ {
  "n": 171,                    // question number, unique per category
  "g": "PP3 2015",             // source question-set code
  "t": "Tato signalizační světla nese:",
  "img": ["211.jpg"],          // optional
  "correct": 0,                // index into `a` (always 0 as scraped)
  "a": [ { "t": "...", "img": ["N16.jpg"] }, ... ]   // exactly 3
} ] }
```

`t` and `img` are both optional on a cell, but never both absent.

## Architecture

```
src/
  categories.js        exam params, group-code → human label
  lib/exam.js          sampling, shuffling, scoring, mode predicates
  lib/storage.js       localStorage hooks: settings, history, missed
  components/
    Home.jsx           category cards, mode launch, attempt history
    Settings.jsx       toggles + missed-list management
    Exam.jsx           question runner: timer, nav, overview sheet, dialogs
    QuestionView.jsx   one question + options — shared by Exam and Result
    Result.jsx         score/pass-fail, per-set breakdown, answer review
```

`App.jsx` is the whole router: a `view` string (`home|settings|exam|result`)
plus one `session` object. No react-router, no state library. Session shape is
built by `createSession()` in `src/lib/exam.js`.

### Three modes

| mode | source | scored | timed | feedback |
| --- | --- | --- | --- | --- |
| `exam` | proportional draw | yes | yes (unless disabled) | only if `instantFeedback` |
| `learn` | whole bank | no | no | always |
| `mistakes` | previously-missed only | no | no | always |

Branch on **`isScored(mode)`**, not on `mode === 'learn'`. The two practice
modes share one path; special-casing them per screen is what the `isScored`
refactor removed.

### Proportional sampling

Each bank splits into source question-sets (`PP1 2015`, `N4`, …). A drawn test
allocates picks across those sets **proportionally, by largest remainder**
(`allocate()` in `lib/exam.js`), so composition mirrors the bank instead of
over-weighting whichever set shuffles to the front. Allocation is capped at
each set's size and loops until the remainder is placed. If the real exam turns
out to use fixed per-set quotas, `allocate()` is the single place to change.

### Missed-question tracking

`useMissed()` keeps `{ [categoryId]: number[] }` of **question numbers** (not
indices — so it survives a re-scrape). A question enters on a wrong answer in
*any* mode and leaves as soon as it's answered correctly. **Skipped questions
are not recorded** (`sessionOutcome()` ignores `null`). Updated once at session
finish, so changing an answer mid-exam behaves correctly.

localStorage keys: `vmp.settings.v1`, `vmp.history.v1` (last 20), `vmp.missed.v1`.
All reads are try/caught — private mode must not crash the app.

## Conventions

- **Czech noun agreement matters.** Use `plural(n, one, few, many)` from
  `lib/exam.js` for any counted noun (1 / 2–4 / 0 and 5+). `zbývá 3 otázek` is
  wrong; `zbývají 3 otázky` is right.
- Images resolve via `` `${import.meta.env.BASE_URL}img/${name}` `` — never a
  bare absolute path, or the relative-base build breaks.
- Styling is one hand-written `src/styles.css` with CSS custom properties and a
  `prefers-color-scheme: dark` block. Mobile-first; nautical navy/teal palette.
  No CSS framework — don't add one without asking.
- Touch targets ≥44 px; the page must never scroll horizontally at 390 px.

## Testing

There is **no test runner in the repo**. Verification so far has been ad-hoc
Playwright scripts driving a `vite preview` build, kept in the session
scratchpad rather than committed. If you re-create them:

- Playwright's cached browsers mismatch the installed package version. Launch
  with the system Chrome instead:
  `chromium.launch({ executablePath: '/usr/bin/google-chrome' })`
- To answer deterministically, first enable the **„Označit správnou odpověď"**
  setting, then click `.answer.is-correct` (or `.answer:not(.is-correct)` to
  answer wrong on purpose).
- Scope confirm-dialog clicks to `.dialog` — nav and dialog share button labels
  like „Dokončit".
- Button `innerText` includes icon glyphs (`✕`); normalise before asserting.

What has been verified: allocation sums, 500-draw sampling (no dupes, correct
answer tracks through shuffling, full bank coverage), full exam→result→review
flow, learn mode, mistakes-mode lifecycle, timer expiry auto-submit, settings
persistence, and no-horizontal-overflow at 390 px.

## Working agreements

- **Never run `git add`, `git commit`, or `git push`. Ever.** Version control is
  the user's job, not yours — not even when asked to "finish up", not even for
  a file you just created, and not as a helpful last step. Leave changes in the
  working tree and say what you changed. Don't offer to commit either; if the
  user wants it committed, they'll do it themselves.
- The user edits copy directly in the components (e.g. the hero lead in
  `Home.jsx`). Don't revert their wording when refactoring nearby.
- Images (5.1 MB) are committed to the repo intentionally, so the app works
  offline and needs no CDN.
