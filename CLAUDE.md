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
subdirectory. Keep it that way. The build must be served over HTTPS or
localhost, though — `file://` has no service worker, so opening `dist/index.html`
straight from disk gives up offline caching and install.

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

### Topics (`q.topic`)

The source sets are only loosely thematic — `PP2 2015` alone mixes vessel
lights, right of way, locks, mooring, reduced visibility and water-skiing. So
`tools/classify.mjs` assigns every question a **thematic topic** (30 across the
three categories, e.g. `svetla-plavidel`, `vyhybaci-pravidla`, `meteorologie`).

- Ordered keyword rules, **first match wins**; unmatched questions fall back to
  the dominant topic of their source set, so coverage is always 100%.
- `topic` is **derived, not scraped** — `scrape.mjs` calls `classifyBank()`
  before writing, so a refresh can't wipe it. Never hand-edit `topic` in
  `bank.json`; change the rules and re-run `npm run classify`.
- Rule order is load-bearing. Specific patterns must sit above general ones —
  e.g. `komory-mosty` runs before the vessel-light rule so a green *lock*
  signal light isn't filed as a vessel light.
- Two traps already hit: a `je:$` pattern matches any verb ending in `-je:`
  (`zachycuje:`), and `při plavbě …` swallows aerodynamics questions unless the
  narrow aero rule runs first. Audit with a group×topic cross-tab after edits.

`npm run classify -- --report` prints per-topic counts plus sample questions.

## Architecture

```
src/
  categories.js        exam params, group-code → human label
  lib/exam.js          sampling, shuffling, scoring, mode predicates
  lib/storage.js       localStorage hooks: settings, history, missed
  lib/pwa.js           SW registration, install prompt, update, image cache
  lib/backGuard.js     system back button → close sheet / confirm quit
  components/
    Home.jsx           category cards, mode launch, attempt history
    Settings.jsx       toggles + missed-list management
    Exam.jsx           question runner: timer, nav, overview sheet, dialogs
    QuestionView.jsx   one question + options — shared by Exam and Result
    Result.jsx         score/pass-fail, per-set breakdown, answer review
    Explainer.jsx      picture + correct answer, browse-only (no session)
    OfflineSection.jsx offline/install block inside Settings
    UpdateToast.jsx    "new version" bar, rendered over every screen
```

`App.jsx` is the whole router: a `view` string
(`home|settings|exam|result|explain`) plus one `session` object. No
react-router, no state library. Session shape is built by `createSession()` in
`src/lib/exam.js`. `explain` is the odd one out — it holds a category id, not a
session, because the explainer never records an answer.

### Three modes

| mode | source | scored | timed | feedback |
| --- | --- | --- | --- | --- |
| `exam` | proportional draw | yes | yes (unless disabled) | only if `instantFeedback` |
| `learn` | whole bank | no | no | always |
| `mistakes` | previously-missed only | no | no | always |
| `topic` | one `q.topic` only | no | no | always |

Branch on **`isScored(mode)`**, not on `mode === 'learn'`. The three practice
modes share one path; special-casing them per screen is what the `isScored`
refactor removed. `createSession(categoryId, mode, settings, opts)` takes
`opts.missedIds` / `opts.topic` — add new mode inputs there, not as positional
arguments.

Note `Exam.jsx` keeps two labels: `modeLabel` (may be a topic name, used in the
header) and `finishNoun` (always a plain noun) — "Dokončit Světla a znaky
plavidel" reads badly.

`learn` has no button of its own any more: the category card offers *Procvičit*,
which opens the topic picker with "Všechny otázky" as its first row.

### Obrázkový supervysvětlovač (`Explainer.jsx`)

Not a mode — no session, no answers, no scoring. It lists every picture in a
category next to its correct answer, grouped by topic, for scrolling through
lights and buoys. `imageCards()` / `imageCount()` in `categories.js` build it.

The one subtlety is *which* cell holds the picture. Usually it is `q.img`
(M: 162, C: 62), but 16 C questions put images on the answers and ask which one
is right — there the **correct answer's** image is what the user needs to see,
and 7 of those answers have no text at all, so the question itself becomes the
caption (its trailing colon gets stripped). S has no pictures at all and the
card hides the button.

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

## PWA — installable, offline, back-button aware

The app installs to a phone home screen and runs with no network at all. Four
pieces, all of which only exist in a **production build** (`npm run dev` has no
service worker on purpose — a stale cache while editing is worse than being
online-only):

- `public/manifest.webmanifest` + `icon-*.png` (rendered from `favicon.svg`;
  regenerate with headless Chrome, there is no image tooling in the repo).
  Paths inside it are relative, like `base: './'` — don't absolutise them.
- `tools/sw.js` — the service worker, a **template**. `tools/vite-plugin-pwa.mjs`
  reads `dist/` after the build and substitutes `__VERSION__`, `__SHELL__`,
  `__MEDIA__`. It walks the output directory rather than the rollup bundle,
  because `public/img` never enters the bundle.
- `src/lib/pwa.js` — registration plus the `useInstall` / `useUpdate` /
  `useOfflineMedia` hooks. State lives in module-level stores, not React:
  `beforeinstallprompt` fires before anything mounts and Chrome only offers it
  once.
- `src/lib/backGuard.js` — see below.

Non-obvious bits:

1. **Two caches.** `vmp-shell-<hash>` (HTML/JS/CSS/icons, ~460 kB incl. the
   whole question bank) is precached on install and replaced wholesale on
   update. `vmp-media-v1` holds the 242 images, is filled lazily or on demand
   from Settings, and **survives updates** — re-downloading 5 MB per release is
   not acceptable on mobile data.
2. **The worker never calls `skipWaiting()` by itself.** A new build takes over
   only when the user accepts the `UpdateToast`, because activating it reloads
   the page and would destroy a running exam. `controllerchange` therefore
   reloads only when *we* asked for it — the first install fires it too.
3. **The shell version is a hash of output filenames + sizes.** Asset names
   already carry a content hash; the sizes are there for `public/` files, whose
   names never change. A same-size edit to an image is the one thing it misses.
4. **Register against `document.baseURI`, not `import.meta.url`.** The bundle
   lives in `assets/`, which would scope the worker to `/assets/`.
5. `--safe-t` (`env(safe-area-inset-top)`) pads `.hero`, `.topbar` and
   `.examhead`: installed on iOS the status bar sits over the page.
6. `overscroll-behavior` is `contain` on the body and both scroll regions —
   installed, a pull-to-refresh would silently throw away an exam.

### System back button

With no browser chrome, back is the only "back" the user has, and one history
entry means it closes the app mid-exam. `useBackGuard(active, onBack)` claims a
history entry per closable thing — screens (`Settings`, `Result`), sheets, the
exam itself (which answers with the same quit confirmation as ✕).

The entries are anonymous: what the module reconciles is their **count**, in a
microtask after the commit. That is what makes a swap safe — unmounting the
exam's three guards while `Result` mounts one nets to two `history.back()`
calls, and React's cleanup order (which is definition order, *not* LIFO) stops
mattering. If a handler doesn't actually close anything, the entry is simply
re-pushed on the next commit.

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

The explainer: both category lists complete (M 162, C 78 incl. the 16
answer-image ones), grouped, every image loads, back returns home, no overflow
at 390 px.

PWA, verified the same way against `vite preview`: worker registers and claims
the page, manifest parses, app and bank boot with the network cut, "download
all images" completes and images then load offline, back closes sheet →
confirms quit → dismisses dialog → returns home with the history balanced
(`playwright`'s `context.setOffline()` and `page.goBack()` do both jobs), no
update prompt on a fresh install, and a rebuild raises the prompt, reloads onto
the new assets and leaves exactly one shell cache. Note that a source edit the
minifier drops produces byte-identical output and therefore *no* update — use a
change that survives into `dist/` when testing this.

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
