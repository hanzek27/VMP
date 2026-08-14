/**
 * The app's icon set: line art drawn on a 24×24 grid, stroked with
 * `currentColor` so an icon takes the colour of whatever it sits in.
 *
 * Why not emoji: emoji render as somebody else's colourful cartoon on every
 * platform, they ignore the palette, and a screenful of them reads as a
 * children's app rather than an instrument. These are all nautical objects the
 * exam actually talks about — buoys, lights, a ship's wheel — so the picker is
 * scannable by shape.
 *
 * `name` that is not in the set is rendered as text, which keeps any leftover
 * emoji in `data/cheatsheets.js` working instead of blanking the row.
 */

/* Each entry is a list of shapes. Strings are paths; objects are circles. */
const ICONS = {
  // ---- interface ----
  back: ['M15.5 5 8.5 12l7 7'],
  close: ['M6.5 6.5 17.5 17.5', 'M17.5 6.5 6.5 17.5'],
  check: ['M5 12.5 9.5 17 19 7.5'],
  chevron: ['M9.5 5 16.5 12l-7 7'],
  play: [{ d: 'M9 6.2 18 12l-9 5.8z', fill: true }],
  download: ['M12 4v11', 'M8 11.5 12 15.5 16 11.5', 'M5 19.5h14'],
  trash: ['M5 7h14', 'M10 7V4.8h4V7', 'M6.8 7 8 20h8l1.2-13'],
  gear: [
    'M4 7.5h9', 'M17 7.5h3', 'M4 16.5h3', 'M11 16.5h9',
    { c: [15, 7.5, 2.2] }, { c: [8, 16.5, 2.2] },
  ],
  clock: [{ c: [12, 12, 8.6] }, 'M12 6.8V12l3.6 2.2'],
  zoom: [{ c: [10.8, 10.8, 6.6] }, 'M15.6 15.6 20.5 20.5', 'M10.8 8.2v5.2', 'M8.2 10.8h5.2'],
  flag: ['M6.5 21V4.2', 'M6.5 4.2h10.8l-2.4 3.9 2.4 3.9H6.5'],

  // ---- home tiles ----
  rings: [{ c: [12, 12, 8.6] }, { c: [12, 12, 4.8] }, { c: [12, 12, 1.3], fill: true }],
  mistakes: [{ c: [12, 12, 8.6] }, 'M9 9l6 6', 'M15 9l-6 6'],
  images: [
    'M3.5 5.5h17v13h-17z',
    'M3.5 15.5 8.5 10.5 12 14l3-3 5.5 5.5',
    { c: [8.6, 9.2, 1.3] },
  ],
  scroll: [
    'M7.5 4.5h10.5a1.6 1.6 0 0 1 1.6 1.6v13.4H9.1a1.6 1.6 0 0 1-1.6-1.6z',
    'M7.5 4.5A2.2 2.2 0 0 0 5.3 6.7v1.6h2.2',
    'M10.5 9.5h6', 'M10.5 13h6', 'M10.5 16.5h3.6',
  ],

  // ---- instruments & objects ----
  compass: [{ c: [12, 12, 8.6] }, { d: 'M15.8 8.2 13.4 13.4 8.2 15.8 10.6 10.6z', fill: true }],
  anchor: [{ c: [12, 4.6, 1.9] }, 'M12 6.5V20', 'M7.4 10h9.2', 'M4.8 13.2a7.2 7.2 0 0 0 14.4 0'],
  wheel: [
    { c: [12, 12, 6.4] }, { c: [12, 12, 2.1] },
    'M12 2.6v7.3', 'M12 14.1v7.3', 'M2.6 12h7.3', 'M14.1 12h7.3',
  ],
  light: [
    { c: [12, 8, 3.2] },
    'M12 11.4V19', 'M8.4 19.4h7.2',
    'M4.4 8h2.2', 'M17.4 8h2.2', 'M6.3 3.4 7.9 4.9', 'M17.7 3.4 16.1 4.9',
  ],
  stack: [{ c: [12, 5.4, 2.1] }, { c: [12, 12, 2.1] }, { c: [12, 18.6, 2.1] }],
  horn: [
    'M4 9.6h3.2L14 5v14L7.2 14.4H4z',
    'M16.8 9.2a4.2 4.2 0 0 1 0 5.6', 'M19.4 6.8a7.6 7.6 0 0 1 0 10.4',
  ],
  sign: ['M4 4.5h16v7.5H4z', 'M7.8 8.2h8.4', 'M12 12v7.4', 'M8.6 19.6h6.8'],
  crossing: ['M3 8.6h12', 'M12.4 5.6 15.4 8.6 12.4 11.6', 'M21 15.4H9', 'M11.6 12.4 8.6 15.4 11.6 18.4'],
  bridge: [
    'M2.4 9.6h19.2', 'M6.2 9.6v10.8', 'M12 9.6v10.8', 'M17.8 9.6v10.8',
    'M6.2 20.4a2.9 2.9 0 0 1 5.8 0', 'M12 20.4a2.9 2.9 0 0 1 5.8 0',
  ],
  fog: ['M3 7.6q2.6-2 5 0t5 0 5 0', 'M3 12q2.6-2 5 0t5 0 5 0', 'M3 16.4q2.6-2 5 0t5 0 5 0'],
  waves: ['M3 10q2.6-2.2 5 0t5 0 5 0', 'M3 15.4q2.6-2.2 5 0t5 0 5 0'],
  book: [
    'M12 6.6C10 5 7 4.4 4 5v12.4c3-.6 6 0 8 1.6',
    'M12 6.6C14 5 17 4.4 20 5v12.4c-3-.6-6 0-8 1.6',
    'M12 6.6V19',
  ],
  law: [
    'M12 4.4v15.2', 'M7 19.6h10', 'M6.4 7.2h11.2',
    'M6.4 7.2 3.8 13.2', 'M17.6 7.2 20.2 13.2',
    'M3.8 13.2a2.6 2.6 0 0 0 5.2 0', 'M15 13.2a2.6 2.6 0 0 0 5.2 0',
  ],
  clipboard: [
    'M8.6 5.2H6.4a1.6 1.6 0 0 0-1.6 1.6v12.4a1.6 1.6 0 0 0 1.6 1.6h11.2a1.6 1.6 0 0 0 1.6-1.6V6.8a1.6 1.6 0 0 0-1.6-1.6h-2.2',
    'M9 3.2h6v3.4H9z',
    'M8.6 11.4h6.8', 'M8.6 15.4h4.4',
  ],
  checklist: [
    'M8.6 5.2H6.4a1.6 1.6 0 0 0-1.6 1.6v12.4a1.6 1.6 0 0 0 1.6 1.6h11.2a1.6 1.6 0 0 0 1.6-1.6V6.8a1.6 1.6 0 0 0-1.6-1.6h-2.2',
    'M9 3.2h6v3.4H9z',
    'M8.8 13.4 10.8 15.4 15.2 11',
  ],
  firstaid: [{ c: [12, 12, 8.6] }, 'M12 7.6v8.8', 'M7.6 12h8.8'],
  sailboat: ['M12 3.2v12.4', 'M13.2 6 18.4 15.6h-5.2z', 'M10.8 8.6 6 15.6h4.8z', 'M3.4 17.6h17.2l-2.6 3.6H6z'],
  ship: ['M3.4 15.4h17.2l-2.6 5H6z', 'M6.4 15.4V8.6h6.8l3.2 6.8', 'M9.4 8.6V5.4h3.2'],
  wrench: ['M15.4 3.6a5 5 0 0 0-6 6.4L4 15.4l3.6 3.6 5.4-5.4a5 5 0 0 0 6-6.4l-2.8 2.8-2.6-2.6z'],
  hull: ['M4 12.4c1.6 5.2 14.4 5.2 16 0', 'M12 4v8.4', 'M7.4 7.6a8 8 0 0 1 9.2 0', 'M16.6 7.6h-2.4', 'M16.6 7.6V5.4'],
  wind: ['M3 8.4h9.4a2.8 2.8 0 1 0-2.8-2.8', 'M3 12.4h11.6a2.8 2.8 0 1 1-2.8 2.8', 'M3 16.4h6.6'],
  tack: ['M4 19.4 9.2 13 12.8 16.6 18.4 6', 'M14.6 6h4v4'],
  map: ['M3.4 6.6 9.2 4 14.8 6.6 20.6 4v13.4L14.8 20 9.2 17.4 3.4 20z', 'M9.2 4v13.4', 'M14.8 6.6V20'],
  buoy: [
    'M9.4 8.6h5.2v8.2H9.4z', 'M12 8.6V5.2', { c: [12, 3.8, 1.4] },
    'M3 19.4q2.6-2 5 0t5 0 5 0',
  ],
  cardinal: [
    'M12 3.2 14.6 7.6H9.4z', 'M12 8.8 14.6 13.2H9.4z', 'M12 13.2v3.6',
    'M3 19.4q2.6-2 5 0t5 0 5 0',
  ],
  weather: [
    'M7.4 15.6h8.8a3.2 3.2 0 0 0 .4-6.4 4.6 4.6 0 0 0-8.8-.4 3.2 3.2 0 0 0-.4 6.8z',
    'M8.6 18.4 7.8 20.8', 'M12.4 18.4 11.6 20.8', 'M16.2 18.4 15.4 20.8',
  ],
  lifering: [
    { c: [12, 12, 8.6] }, { c: [12, 12, 3.6] },
    'M12 3.4v2.6', 'M12 18v2.6', 'M3.4 12H6', 'M18 12h2.6',
  ],
  ruler: ['M3.4 9h17.2v6H3.4z', 'M7.4 9v2.8', 'M11 9v2.8', 'M14.6 9v2.8', 'M18.2 9v2.8'],
  distance: ['M3.4 7.4v9.2', 'M20.6 7.4v9.2', 'M5.6 12h12.8', 'M8.2 9.4 5.6 12 8.2 14.6', 'M15.8 9.4 18.4 12 15.8 14.6'],
  palette: [
    'M12 3.6a8.4 8.4 0 0 0 0 16.8c1.6 0 1.9-1.3 1.1-2.1-.8-.9-.3-2.2 1-2.2h1.6a4 4 0 0 0 3.9-4c0-4.8-3.5-8.5-7.6-8.5z',
    { c: [8.4, 8.6, 1.1], fill: true }, { c: [12.8, 7.2, 1.1], fill: true }, { c: [16, 10.4, 1.1], fill: true },
  ],
  sos: ['M12 3.8 2.6 20.2h18.8z', 'M12 10v4.2', 'M12 17.2v.6'],
  folder: ['M3.4 6.4h6l2.2 2.8h9v10.4h-17.2z'],
  bars: ['M4 20.6h16', 'M7 20.6v-5.2', 'M12 20.6v-9.2', 'M17 20.6v-13.2'],
  link: [
    'M10.2 14a4.2 4.2 0 0 1 0-5.9l1.5-1.5a4.2 4.2 0 0 1 5.9 5.9l-1 1',
    'M13.8 10a4.2 4.2 0 0 1 0 5.9l-1.5 1.5a4.2 4.2 0 0 1-5.9-5.9l1-1',
  ],
}

export const hasIcon = (name) => Object.hasOwn(ICONS, name)

export default function Icon({ name, size = 22, className = '', title }) {
  const shapes = ICONS[name]
  // an unknown name is almost certainly a leftover emoji – show it as-is
  if (!shapes)
    return (
      <span className={className} aria-hidden={title ? undefined : 'true'}>
        {name}
      </span>
    )

  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {shapes.map((s, i) =>
        typeof s === 'string' ? (
          <path key={i} d={s} />
        ) : s.c ? (
          <circle key={i} cx={s.c[0]} cy={s.c[1]} r={s.c[2]} fill={s.fill ? 'currentColor' : 'none'} />
        ) : (
          <path key={i} d={s.d} fill={s.fill ? 'currentColor' : 'none'} />
        )
      )}
    </svg>
  )
}
