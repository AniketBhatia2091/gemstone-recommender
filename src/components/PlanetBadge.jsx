/**
 * PlanetBadge — Colored pill badge displaying planet/graha info
 * @param {Object} props
 * @param {string} props.planet - English planet name
 * @param {string} props.graha - Sanskrit graha name
 * @param {string} props.colorHex - Color for the badge
 */
export default function PlanetBadge({ planet, graha, colorHex = '#c9a84c' }) {
  return (
    <span
      className="inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide"
      style={{
        backgroundColor: `${colorHex}26`,
        border: `1px solid ${colorHex}99`,
        color: colorHex,
      }}
    >
      {planet} ({graha})
    </span>
  );
}
