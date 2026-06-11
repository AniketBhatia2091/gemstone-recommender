import PlanetBadge from './PlanetBadge';
import MantraBlock from './MantraBlock';
import FallbackBanner from './FallbackBanner';

const PLANET_COLORS = {
  Sun: '#FFD700', Moon: '#C0C0C0', Mars: '#CC0000',
  Mercury: '#50C878', Jupiter: '#FF8C00', Venus: '#FFB6C1',
  Saturn: '#4169E1', Rahu: '#708090', Ketu: '#8B7355',
};

/**
 * ResultCard — Full gemstone recommendation display
 * @param {Object} props
 * @param {Object} props.recommendation - Recommendation data (AI or fallback)
 */
export default function ResultCard({ recommendation }) {
  const r = recommendation;
  if (!r) return null;

  const planetColor = PLANET_COLORS[r.planet] || '#c9a84c';
  const confidenceColor =
    r.confidence_score >= 80 ? '#22c55e' :
    r.confidence_score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Fallback banner */}
      {r.source === 'fallback' && <FallbackBanner />}

      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold" style={{ color: '#f5f0e8' }}>
          {r.gemstone}
        </h1>
        <p className="text-lg font-serif italic" style={{ color: '#c9a84c' }}>
          {r.sanskrit_name} ({r.hindi_name})
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <PlanetBadge planet={r.planet} graha={r.graha} colorHex={planetColor} />
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${confidenceColor}20`,
              border: `1px solid ${confidenceColor}60`,
              color: confidenceColor,
            }}
          >
            {r.confidence_score}% Match
          </span>
        </div>
      </div>

      {/* Reason */}
      <div className="card-glass p-6 sm:p-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#c9a84c' }}>
          Why this gemstone for you
        </h2>
        <p className="leading-relaxed mb-3" style={{ color: '#f5f0e8', lineHeight: 1.8 }}>
          {r.reason}
        </p>
        {r.vedic_logic && (
          <p className="text-sm italic" style={{ color: '#9b8ea0' }}>
            ⟡ {r.vedic_logic}
          </p>
        )}
      </div>

      {/* Benefits */}
      <div className="card-glass p-6 sm:p-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#c9a84c' }}>
          Benefits <span className="text-sm font-normal italic" style={{ color: '#9b8ea0' }}>(Phal)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(r.benefits || []).map((benefit, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#c9a84c' }} />
              <span className="text-sm" style={{ color: '#f5f0e8' }}>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wearing Instructions */}
      <div className="card-glass p-6 sm:p-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#c9a84c' }}>
          Wearing Instructions <span className="text-sm font-normal italic" style={{ color: '#9b8ea0' }}>(Dhāran Vidhi)</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9b8ea0' }}>Metal (Dhātu)</p>
            <p className="text-sm font-medium" style={{ color: '#f5f0e8' }}>{r.wearing_instructions?.metal}</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9b8ea0' }}>Day (Vāsara)</p>
            <p className="text-sm font-medium" style={{ color: '#f5f0e8' }}>{r.wearing_instructions?.day}</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9b8ea0' }}>Finger (Anguli)</p>
            <p className="text-sm font-medium" style={{ color: '#f5f0e8' }}>{r.wearing_instructions?.finger}</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9b8ea0' }}>Auspicious Time</p>
            <p className="text-sm font-medium" style={{ color: '#f5f0e8' }}>{r.wearing_instructions?.time}</p>
          </div>
        </div>
        {r.wearing_instructions?.activation_ritual && (
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#9b8ea0' }}>Activation Ritual (Prāṇ Pratiṣṭhā)</p>
            <p className="text-sm leading-relaxed" style={{ color: '#f5f0e8' }}>
              {r.wearing_instructions.activation_ritual}
            </p>
          </div>
        )}
      </div>

      {/* Mantra */}
      <MantraBlock mantra={r.mantra} beejMantra={r.beej_mantra} />

      {/* Upratna */}
      {r.upratna && (
        <div className="card-glass p-6 sm:p-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#c9a84c' }}>
            Upratna <span className="text-sm font-normal italic" style={{ color: '#9b8ea0' }}>(Substitute Gemstone)</span>
          </h2>
          <p className="font-medium mb-1" style={{ color: '#f59e0b' }}>{r.upratna}</p>
          {r.upratna_note && (
            <p className="text-sm" style={{ color: '#9b8ea0' }}>{r.upratna_note}</p>
          )}
        </div>
      )}

      {/* Caution */}
      {r.caution && (
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#1a0f00',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">⚠</span>
            <div>
              <p className="text-sm leading-relaxed mb-2" style={{ color: '#f59e0b' }}>
                {r.caution}
              </p>
              <p className="text-xs" style={{ color: '#9b8ea0' }}>
                Always consult a qualified Jyotish before wearing a gemstone
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confidence */}
      <div className="card-glass p-6 sm:p-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium" style={{ color: '#c9a84c' }}>
            Recommendation Confidence
          </h2>
          <span className="text-lg font-bold" style={{ color: confidenceColor }}>
            {r.confidence_score}%
          </span>
        </div>
        <div className="confidence-bar">
          <div
            className="confidence-bar-fill"
            style={{
              width: `${r.confidence_score || 0}%`,
              backgroundColor: confidenceColor,
            }}
          />
        </div>
        {r.confidence_reasoning && (
          <p className="text-sm mt-3" style={{ color: '#9b8ea0' }}>
            {r.confidence_reasoning}
          </p>
        )}
      </div>

      {/* Weight */}
      {r.weight_ratti && (
        <div className="card-glass p-4 flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#9b8ea0' }}>
            Recommended Weight:
          </span>
          <span className="text-sm font-medium" style={{ color: '#f5f0e8' }}>
            {r.weight_ratti}
          </span>
        </div>
      )}
    </div>
  );
}
