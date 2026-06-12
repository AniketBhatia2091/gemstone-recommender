/**
 * RudrakshaCard — Cross-sell component for Rudraksha beads
 * Maps the ruling planet (graha) of the recommended gemstone
 * to the corresponding Mukhi Rudraksha from Humara Pandit's catalogue.
 *
 * Prices and product data sourced from humarapandit.com (June 2026).
 */

const RUDRAKSHA_MAP = {
  Sun:     { mukhi: 1,  name: "Ek Mukhi",    benefit: "Self-realisation and soul connection",        price: "₹15,000+", note: "Rarest and most powerful — verify authenticity carefully" },
  Moon:    { mukhi: 2,  name: "Do Mukhi",     benefit: "Emotional balance and relationships",         price: "₹15,000",  note: "Nepal variety preferred for Vedic use" },
  Mars:    { mukhi: 3,  name: "Teen Mukhi",   benefit: "Confidence and removal of past karma",        price: "₹499",     note: "Also effective as Teen Mukhi mala" },
  Mercury: { mukhi: 4,  name: "Char Mukhi",   benefit: "Intelligence, communication, education",      price: "₹349",     note: "Ideal for students and speakers" },
  Jupiter: { mukhi: 5,  name: "Panch Mukhi",  benefit: "Wisdom, prosperity and spiritual growth",     price: "₹199",     note: "Most common and safe for all" },
  Venus:   { mukhi: 6,  name: "Chhe Mukhi",   benefit: "Creativity, luxury and relationships",        price: "₹449",     note: "Wear on right hand wrist as bracelet" },
  Saturn:  { mukhi: 7,  name: "Saat Mukhi",   benefit: "Financial stability and relief from hardship", price: "₹599",    note: "Especially powerful during Sade Sati" },
  Rahu:    { mukhi: 8,  name: "Aath Mukhi",   benefit: "Protection from negative energies",           price: "₹799",     note: "Wear only after consulting an astrologer" },
  Ketu:    { mukhi: 9,  name: "Nau Mukhi",    benefit: "Spiritual liberation and fearlessness",       price: "₹899",     note: "Associated with Goddess Durga" },
};

export default function RudrakshaCard({ planet }) {
  const data = RUDRAKSHA_MAP[planet];
  if (!data) return null;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '11px', color: '#9b8ea0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Complementary remedy
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: '#1a1000',
            color: '#c9a84c',
          }}
        >
          {data.mukhi} Mukhi
        </span>
      </div>

      {/* Name */}
      <p style={{ fontSize: '18px', fontWeight: 500, color: '#c9a84c', margin: '0 0 6px' }}>
        {data.name} Rudraksha
      </p>

      {/* Benefit */}
      <p style={{ fontSize: '13px', color: '#9b8ea0', margin: '0 0 8px' }}>
        {data.benefit}
      </p>

      {/* Price */}
      <p style={{ fontSize: '13px', color: '#c9a84c', margin: '0 0 8px' }}>
        From {data.price} on Humara Pandit
      </p>

      {/* Note */}
      <p style={{ fontSize: '12px', color: '#9b8ea0', fontStyle: 'italic', margin: '0 0 16px' }}>
        ◆ {data.note}
      </p>

      {/* CTA */}
      <a
        href="https://humarapandit.com/collections/rudraksha"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline"
        style={{ display: 'inline-flex', fontSize: '13px', padding: '8px 16px' }}
        id={`buy-rudraksha-${data.mukhi}`}
      >
        Buy {data.name} Rudraksha →
      </a>

      {/* Disclaimer */}
      <p style={{ fontSize: '12px', color: '#9b8ea0', marginTop: '12px' }}>
        Prices from Humara Pandit catalogue. Consult an astrologer before combining gemstone and Rudraksha remedies.
      </p>
    </div>
  );
}
