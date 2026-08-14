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
  lib/storage.js       localStorage hooks: category, settings, history, missed
  lib/pwa.js           SW registration, install prompt, update, image cache
  lib/backGuard.js     system back button → close sheet / confirm quit
  components/
    Home.jsx           dashboard for **one** category: brief, tiles, log
    Settings.jsx       toggles + missed-list management
    Exam.jsx           question runner: timer, nav, question list, dialogs
    QuestionView.jsx   one question + options — shared by Exam and Result
    Result.jsx         score/pass-fail, per-set breakdown, answer review
    Explainer.jsx      picture + correct answer, browse-only (no session)
    Cheatsheet.jsx     renders one tahák from data/cheatsheets.js
    Lightbox.jsx       tap-to-enlarge picture overlay + its ZoomImage thumbnail
    Icon.jsx           the line-art icon set (see The look)
    CompassRose.jsx    the app's mark, also the favicon
    OfflineSection.jsx offline/install block inside Settings
    UpdateToast.jsx    "new version" bar, rendered over every screen
```

`App.jsx` is the whole router: a `view` string
(`home|settings|exam|result|explain|crib`) plus one `session` object. No
react-router, no state library. Session shape is built by `createSession()` in
`src/lib/exam.js`. `explain` and `crib` are the odd ones out — they hold a
category id and a cheat-sheet id, not a session, because neither screen records
an answer.

### The home screen is one category at a time

`Home.jsx` shows a single category and remembers which (`useCategory()`,
`vmp.category.v1`). The three categories used to be three stacked cards, which
meant the same four buttons three times and a long scroll to reach anything.

The order is: masthead → category switcher → **brief** (name, the three numbers,
the pass scale, one brass *Spustit zkoušku*) → unfinished runs → four training
tiles (Okruhy / Moje chyby / Obrázky / Taháky) → ship's log.

- The tiles carry their own counts and disable themselves when there is nothing
  behind them (S has no pictures, only M has taháky).
- Okruhy and Taháky open a sheet; the sheet is `<Sheet>` inside `Home.jsx`, the
  same `.scrim`/`.panel` markup the exam overview uses.
- Unfinished runs are filtered to the shown category; a count of the ones in
  *other* categories is printed underneath, so nothing goes invisible.
- `<PassScale>` draws the pass mark as a line on a scale, with the last attempt
  for that category filled in behind it. It is the one place the two numbers
  that matter (pass mark, last score) are shown against each other.

Home unmounts while an exam runs, so `useCategory()` re-reads on mount and there
is no second copy of the state to keep in sync.

### Wide screens

Mobile-first, but the extra width goes to content rather than margins. Three
steps, all of them **only** inside `min-width` queries — the phone layout is
whatever is written above them in `styles.css`.

| from | what changes |
| ---: | --- |
| 900 px | home splits into two columns (`.deck` / `.deck__side`), the category tabs lay out in a row, result breakdown and tahák cards go two-up |
| 1024 px | the exam runs as two panes: the question list becomes a permanent sidebar, the *Přehled* button disappears, keyboard hints appear |
| 1160 px | the picture gallery goes to three columns |

- **`display: contents` is what keeps the exam honest.** `.exammain` and
  `.runcol` wrap the body and the nav so a desktop can lay them out as a grid;
  below 1024 px both are `display: contents`, so the DOM collapses back to the
  same flex column the phone always had. Don't give either a background,
  border or padding — `contents` would drop it.
- `Exam.jsx` renders **one** `<QuestionList>` component in two places: the
  sheet and the sidebar. They differ only in the wrapper class and which ref
  marks the current row (the sheet centres it on open, the sidebar follows the
  current question with `block: 'nearest'`).
- Finishing early lives in the sidebar's foot on a desktop and in the sheet's
  foot on a phone — the same button, never both on screen at once.
- **The keyboard cursor is real DOM focus, not state.** `↑`/`↓` move focus
  between the option buttons (wrapping at the ends), which means the browser
  draws the ring, a screen reader announces the option, and — because the
  options are ordinary `<button>`s — `Enter` and `Space` activate the focused
  one with no key handling of ours at all. `1`–`3` still pick an option
  outright, `←`/`→` change question, `F` flags. The cursor deliberately keeps
  its position across questions, so answering a run is ↓↓ Enter → ↓ Enter →.
- The handler returns early while the overview sheet or a dialog is open — that
  is the one thing on screen that owns the keyboard at that moment.
- `.keyhints` only *says* any of this where there is a keyboard to use.
- The nav keeps its full width so the rule above it spans the pane; its padding
  is what lines the buttons up with the answers.

### Three modes

| mode | source | scored | timed | feedback | resumable |
| --- | --- | --- | --- | --- | --- |
| `exam` | proportional draw | yes | yes (unless disabled) | `instantFeedback` | no |
| `learn` | whole bank | no | no | `instantFeedback` | yes |
| `mistakes` | previously-missed only | no | no | `instantFeedback` | yes |
| `topic` | one `q.topic` only | no | no | `instantFeedback` | yes |

`instantFeedback` governs **every** mode. It used to be forced on for the three
practice modes, which made the setting look broken — the place a user spends
most of their time ignored it. It now defaults to `true`, so a fresh install
still practises with feedback; anyone whose stored settings predate the change
keeps their `false` and has to switch it on. `markCorrect` is separate and
still overrides everything: it reveals the right answer before you pick.

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

### Tap-to-enlarge (`Lightbox.jsx`)

`<ZoomImage img caption onZoom>` replaces a plain `<img>` inside a picture
frame and `<Lightbox>` shows it full width; the tahák and the explainer both
use them, the exam deliberately does not (an answer image lives inside the
answer button, so a tap there has to select). The button carries the label and
the picture keeps `alt=""` — the meaning is always written next to it.

The overlay claims a back-guard entry like every other closable thing, so the
system back button closes the picture and leaves the screen behind it alone.
`.zoom` must keep `max-width: 100%`: the frames are `justify-items: center`
grids, so a button sized to its content would otherwise be as wide as the
source image.

### Taháky (`Cheatsheet.jsx` + `src/data/cheatsheets.js`)

The "Taháky" block on the home page. A tahák is hand-written prose that explains
*why* a group of signals is shaped the way it is, so a topic stops being 80-odd
unrelated things to memorise. Also not a mode: no session, no scoring.

The sheets are pure data — `CHEATSHEETS` is a list of
`{ id, categoryId, topic, title, subtitle, icon, lead, sections }`, and each
section holds blocks of six kinds (`lead`, `rules`, `cards`, `signals`, `facts`,
`warn`) that `<Block>` switches on. Adding a sheet is appending another object;
the home list and the router need no change. `topic` is what the sheet's
*Procvičit* button launches, so it must be a real `q.topic` of `categoryId`.

Copy is rendered as **plain text** — no markdown. `*emphasis*` shows up as
literal asterisks.

Three sheets so far:

- `svetla-m` (M / `svetla-plavidel`) — `cards` blocks. Images are plain
  `public/img` filenames, the same files the questions use: `img` is the night
  signal, optional `day` the daytime shape below it. Covers 55 of the topic's 56
  pictures (`410A.jpg` duplicates `410.jpg`).
- `zvuky-m` (M / `zvukove-signaly`) — `signals` blocks, because the topic has no
  pictures at all. A `code` string draws the signal's rhythm, one char per blip:
  `L` long (4 s), `S` short (1 s), `V` very short, `B` a bell series, `-` a
  forced line break between groups, `…` "and on it goes". `-` is what makes
  "3 dlouhé + 1 krátký" render as head-above-tail, which is the whole point of
  the strip. The strip is `aria-hidden` — every signal is also written out in
  `t`, so nothing depends on decoding it. Widths are fixed in CSS, so a code
  longer than `LLL…` will wrap; check it at 320 px if you add one.
- `barvy-m` (M / `znaky-vodni-cesty`) — the red/green system end to end: side
  lights, fairway and bank marks, IALA lateral and cardinal buoys, the lock and
  bridge semaphore, distress red. Eleven sections, 31 `cards`. The point it is
  built around is that the four roles measure the side from *different*
  directions — the bow, the current, and the run from sea into harbour — so the
  vessel's own red-to-port never confirms a red buoy.

Two things about `barvy-m` generalise to any further sheet:

- **A sheet can only point at one topic, but its material may span more.** Two
  of its sections are C (sea) content, which is why their headings say so;
  *Procvičit* still lands in M's `znaky-vodni-cesty`. Don't try to give a sheet
  two topics — say it in the copy instead.
- **The M waterway marks are picture-only.** The answer text says "pravá strana
  plavební dráhy" and never names a colour, so `bank.json` alone cannot tell you
  that the right side is the red cylinder. That came from opening the files in
  `public/img`; there is no image tooling in the repo, so read them one by one.

Renderer traps when writing a sheet: `cards` items are keyed by `c.img`, so the
same picture must not appear twice inside one `cards` block (split it into two
blocks), and `facts`/`rules`/`signals` items are keyed by their `k`/`t` text, so
two identically-worded entries in one block collide the same way.

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

### Saved practice progress

`useProgress()` keeps unfinished **practice** runs, so closing the app mid-training
is not a loss. A scored test is never saved — it gets submitted or it's gone.

- Keyed `` `${categoryId}:${mode}:${topic ?? ''}` `` (`progressKey()`), so one
  half-done topic doesn't overwrite another.
- Stored **by reference**: question numbers + per-item option order, never the
  question text (`packSession()`). A whole-bank M run is ~10 kB, not 240 kB.
  Nothing is saved until at least one answer exists.
- `unpackSession()` rebuilds it and returns **null** if anything no longer fits
  the bank (a re-scrape renumbered or dropped a question). Callers drop the run
  on null — a half-restored session is worse than none.
- **`current` is part of the session**, not `Exam.jsx` local state — a resumed
  run has to open on the question it left off. Exam's edits go through `patch()`,
  which reads the session from a ref so two changes in one React batch both land.
- Written on every answer *and* every page turn, from `App.change()`. Removed
  when the run is finished, restarted, or deleted.
- Two entry points, and neither can lose work silently: `App.start()` shows
  `ResumeDialog` if the run it's about to create already exists (covers the topic
  picker, "Všechny otázky", "Jen moje chyby" and the result screen's retry), and
  Home lists the runs with resume + a confirmed delete.

localStorage keys: `vmp.category.v1` (the home screen's category),
`vmp.settings.v1`, `vmp.history.v1` (last 20), `vmp.missed.v1`,
`vmp.progress.v1`. All reads are try/caught — private mode must not crash the app.

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

1. **Two caches.** `vmp-shell-<hash>` (HTML/JS/CSS/fonts/icons, ~530 kB incl.
   the whole question bank and the three subset woff2) is precached on install and replaced wholesale on
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
4. **Cache lookups pass `ignoreVary: true`.** A host that answers with
   `Vary: Origin` — `vite preview` does, and some CDNs do — stores a precache
   entry that a later page request (which carries an `Origin` header) will not
   match, and the app is offline-broken with a full cache. Everything cached is
   same-origin static output, so there is nothing to legitimately vary on.
   Without this the app looked fine online and died the moment the network did.
5. **Register against `document.baseURI`, not `import.meta.url`.** The bundle
   lives in `assets/`, which would scope the worker to `/assets/`.
6. `--safe-t` (`env(safe-area-inset-top)`) pads `.hero`, `.topbar` and
   `.examhead`: installed on iOS the status bar sits over the page.
7. `overscroll-behavior` is `contain` on the body and both scroll regions —
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
- Styling is one hand-written `src/styles.css` with CSS custom properties.
  Mobile-first, no CSS framework — don't add one without asking. See
  [The look](#the-look-dark-chart--brass) for the palette.
- Touch targets ≥44 px; the page must never scroll horizontally at 320, 390 or
  768 px. Check 1024 px too — that is where the exam changes shape.

## The look: instrument panel

One theme, always dark — `color-scheme: dark` on `:root`, no
`prefers-color-scheme` fork, and `<meta name="theme-color">` is a single value.
The reference is an instrument on a chart table at night: near-black water,
amber-brass fittings, warm paper ink.

- **Soft corners, hard rules.** `--r: 8px` / `--r-lg: 12px`, hairline borders
  instead of shadows, and chart-frame corner ticks on the panels that matter
  (`.brief::before`, `.tile::before` — eight 1 px gradients).
- **Palette.** `--brass` (a saturated amber, *not* a pale gold — that read as
  washed out) is the only bright colour and it means *action*: primary button,
  active tab, focus ring, counters. `--sea` is the quiet secondary. `--flag` is
  a lighter yellow kept deliberately apart from the amber, for "review this"
  and "settings are modified". Green and red are reserved for right/wrong and
  pass/fail — never decoration. `--edge` is the cool structural hairline,
  `--edge-brass` the warm one used on chart frames and over dark headers.
- **Type is one family: IBM Plex Sans, self-hosted** (`--sans`; `--display`
  aliases it). Headings and numbers are held apart by weight (700) and tracking,
  not by a second typeface. A serif display face was tried and rejected — the
  questions are long Czech sentences read under time pressure. See
  [Fonts](#fonts) for the files.
- **Buttons are flat.** `.btn--go` is solid `--brass` with no gradient, no inner
  highlight and no outer glow; label at 0.98 rem, the rest at 0.92 rem.
- **The answer states are graded by how much they mean.** Right and wrong are
  loud — a 2 px border in the state colour, a 15–18 % tint across the whole
  option, and the letter badge filled solid — while merely *picked* (and hover)
  is quiet: a dimmed amber edge and a 7 % wash, because "I chose this" is not a
  verdict. Colour is never the only carrier; the ✓/✕ mark says the same thing.
  There is exactly **one** look for "this is the right answer", whether it came
  from the `markCorrect` setting or from tapping it. Keeping it that way needs
  the hover rule excluded from the state classes
  (`.answer:hover:not(:disabled):not(.is-correct):not(.is-wrong):not(.is-chosen)`):
  a bare `.answer:hover` outranks `.answer.is-correct` on specificity and
  repaints the verdict grey under the cursor — which reads as a second, weaker
  kind of correct.
- **`--plate` is dark.** The frames behind the drawings used to be parchment.
  Roughly half the source images are white-on-black night scenes and now blend
  into the page; the daytime ones carry their own white background in the JPEG,
  which no frame colour can change.

### Fonts

`src/assets/fonts/plex-sans-{400,600,700}.woff2`, ~23 kB each.

- They are **subset to the ~170 glyphs this app actually uses** — the question
  bank, the taháky and the UI copy — which is what keeps them at a third of the
  full latin+latin-ext size. Rebuild by re-running the Google Fonts request
  `css2?family=IBM+Plex+Sans:wght@400;600;700&text=<charset>`; a re-scrape that
  introduces a character outside the subset falls back to the system sans for
  that one glyph.
- They live in `src/assets/`, **not** `public/`: the bundler rewrites the URL
  relative to the emitted CSS, which is what `base: './'` needs. A `public/`
  path would have to be absolute and would break the relative-base build.
- They are part of the shell precache, so the app renders the same offline.
- **`body::before` carries the page texture** — graticule and water wash — as one
  fixed layer at `z-index: -1`. Deliberately *not* `background-attachment: fixed`
  on the body: that repaints on every scroll frame and a phone feels it.
- **Every picture needs a `--plate`.** The question drawings are black line art
  on white *and* white line art on black; a warm light mount is what makes both
  readable on a dark page. `.figures img`, `.explain__figs`, `.crib__figs`,
  `.qlist__thumb` and `.lightbox__img` all carry one. No filters on the images
  themselves — buoy and light colours are the answer to the question.
- One loud thing per screen: `.btn--go`. If a screen has two, one of them is
  wrong.

### Icons (`components/Icon.jsx`)

`<Icon name="anchor" />` renders line art on a 24×24 grid stroked with
`currentColor`. The app used emoji before; they render as somebody else's
cartoon on every platform, ignore the palette, and made a screen of them read as
a children's app. The set is nautical objects the exam actually talks about, so
lists are scannable by shape.

- `topics.js` maps every topic to an icon name (`TOPIC_ICONS`), and
  `data/cheatsheets.js` uses names in its `icon` fields too.
- An **unknown name renders as text**, so a leftover emoji still shows up rather
  than blanking the row.
- Two icons that can appear in the same list must not look alike — `fog` (three
  wavy lines) and `waves` collided in the M picker, which is why `vodni-sporty`
  uses `lifering`.
- `CompassRose.jsx` takes `compact` for the masthead mark: same geometry, ticks
  and cardinal letters dropped because they turn to mush at 30 px.
- `public/favicon.svg` is the same rose. The PNG icons are rendered from it with
  headless Chrome (`--headless --screenshot --window-size=N,N` over a wrapper
  HTML); the maskable one insets the mark to ~74 % for the safe zone.

### The result dial

`Result.jsx` draws the score as a graduated half-dial: ticks every 10 %, a
needle at the score, and **the pass mark as its own line on the scale** — the
one number that decides the outcome belongs on the instrument. The verdict is a
rotated `.stamp`. The percentage sits *below* the hub; above it, the needle runs
straight through the text at some angles.

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

A tahák: every section renders, every card image loads, no overflow at 390 px,
and *Procvičit* opens the right topic with the right question count. Card images
are lazy — scroll the whole page before asserting on `naturalWidth`, or you will
"find" two dozen broken pictures that are simply below the fold.

Offline is the one thing `vite preview` cannot be trusted on by itself: it
sends `Vary: Origin`, which is exactly the header the service worker now has to
work around. Test it against a plain static server too — `python3 -m http.server`
inside `dist/` — so a genuine caching bug cannot hide behind a preview quirk.

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
- The user edits copy directly in the components (e.g. `.lede` at the top of
  `Home.jsx`). Don't revert their wording when refactoring nearby — that line
  has already been lost once in a redesign and had to be put back.
- Images (5.1 MB) are committed to the repo intentionally, so the app works
  offline and needs no CDN.
