/**
 * Decorative compass rose, drawn the way an old chart draws one: a ring of
 * degree ticks, eight points with a lit and a shaded half, and the cardinal
 * letters. Pure geometry — no image file, so it costs nothing offline and
 * takes its colour from `currentColor`.
 *
 * Purely ornamental: `aria-hidden`, and nothing in the app depends on it.
 */

const C = 100 // centre of the 200×200 viewBox

/** Chart bearing (0° = north, clockwise) → a point on the circle of radius r. */
const at = (deg, r) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))]
}

const round = (n) => Math.round(n * 100) / 100

/** One arm: a filled half and an outlined half, so it reads as engraved. */
function Point({ angle, len, width }) {
  const [tx, ty] = at(angle, len)
  const [lx, ly] = at(angle - 90, width)
  const [rx, ry] = at(angle + 90, width)
  return (
    <>
      <path d={`M${tx},${ty} L${lx},${ly} L${C},${C} Z`} fill="currentColor" opacity="0.85" />
      <path
        d={`M${tx},${ty} L${rx},${ry} L${C},${C} Z`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </>
  )
}

const CARDINALS = [0, 90, 180, 270]
const INTERCARDINALS = [45, 135, 225, 315]
// every 11.25° — a 32-point card, long tick on each named point
const TICKS = Array.from({ length: 32 }, (_, i) => i * 11.25)

export default function CompassRose({ className, compact = false }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor">
        <circle cx={C} cy={C} r="96" strokeWidth={compact ? 5 : 1} opacity={compact ? 1 : 0.55} />
        {!compact && <circle cx={C} cy={C} r="92" strokeWidth="0.7" opacity="0.4" />}
        {!compact && <circle cx={C} cy={C} r="84" strokeWidth="0.7" opacity="0.4" />}
        {!compact && <circle cx={C} cy={C} r="30" strokeWidth="0.7" opacity="0.4" />}
        {!compact && <circle cx={C} cy={C} r="5" strokeWidth="1" />}
        {!compact && TICKS.map((deg) => {
          const long = deg % 45 === 0
          const [x1, y1] = at(deg, long ? 84 : 88)
          const [x2, y2] = at(deg, 92)
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={long ? 1.4 : 0.7}
              opacity={long ? 0.8 : 0.5}
            />
          )
        })}
      </g>

      {INTERCARDINALS.map((deg) => (
        <Point key={deg} angle={deg} len={compact ? 52 : 46} width={compact ? 11 : 7} />
      ))}
      {CARDINALS.map((deg) => (
        <Point key={deg} angle={deg} len={compact ? 84 : 68} width={compact ? 15 : 11} />
      ))}

      {/* Czech cardinals, seated between the arms and the tick ring. The serif
          face comes from CSS – `var()` in a presentation attribute is not
          substituted. The compact mark has no room for them. */}
      {!compact && (
        <g fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle">
          <text x={C} y="29">
            S
          </text>
          <text x="176" y="105">
            V
          </text>
          <text x={C} y="181">
            J
          </text>
          <text x="24" y="105">
            Z
          </text>
        </g>
      )}
    </svg>
  )
}
