import gemstones from '../data/gemstones.json';

export default function UpratnaCard({ gemstoneId }) {
  const gem = gemstones.find(g => g.id === gemstoneId);
  if (!gem) return null;

  return (
    <div
      style={{
        borderLeft: '4px solid #c9a84c',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        background: 'rgba(255,255,255,0.04)',
        marginTop: '2rem',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '11px', color: '#9b8ea0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Upratna (Substitute)
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
          {gem.upratna_effect_percent}% effective
        </span>
      </div>

      {/* Name */}
      <p style={{ fontSize: '18px', fontWeight: 500, color: '#c9a84c', margin: '0 0 2px' }}>
        {gem.upratna_name}
      </p>
      <p style={{ fontSize: '13px', color: '#9b8ea0', fontStyle: 'italic', margin: '0 0 12px' }}>
        {gem.upratna_hindi}
      </p>

      {/* Price */}
      <p style={{ fontSize: '13px', color: '#9b8ea0', margin: '0 0 8px' }}>
        ◆ From {gem.upratna_price_range}
      </p>

      {/* Buy note */}
      <p style={{ fontSize: '12px', color: '#9b8ea0', fontStyle: 'italic', margin: '0 0 16px' }}>
        "{gem.upratna_buy_note}"
      </p>

      {/* CTA */}
      <a
        href={`https://humarapandit.com/search?q=${gem.shopify_search_query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline"
        style={{ display: 'inline-flex', fontSize: '13px', padding: '8px 16px' }}
        id={`buy-upratna-${gem.id}`}
      >
        Buy {gem.upratna_hindi} on Humara Pandit →
      </a>

      {/* Disclaimer */}
      <p style={{ fontSize: '12px', color: '#9b8ea0', marginTop: '12px' }}>
        Upratna gives partial benefit at lower cost. Consult an astrologer before substituting.
      </p>
    </div>
  );
}
