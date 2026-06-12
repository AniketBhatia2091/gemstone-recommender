import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';
import UpratnaCard from '../components/UpratnaCard';
import RudrakshaCard from '../components/RudrakshaCard';
import WearingRitualChecklist from '../components/WearingRitualChecklist';

/**
 * Result — Recommendation display page
 * Reads recommendation data from router location state.
 * Redirects to home if accessed directly without state.
 */
export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect if no state (direct URL access)
  useEffect(() => {
    if (!state?.recommendation) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.recommendation) {
    return null;
  }

  const { recommendation, formData } = state;

  // Derive gemstoneId from recommendation
  const gemstoneId = recommendation?.gemstone
    ?.toLowerCase().replace(/\s+/g, '-') || '';

  // Extract planet English name (handles "Sun (Surya)" or just "Sun")
  const planetName = recommendation?.planet?.split(' ')[0] || '';

  // WhatsApp share
  const gemName = recommendation?.gemstone || '';
  const gemSanskrit = recommendation?.sanskrit_name || '';
  const mantra = recommendation?.mantra || '';
  const shareText = encodeURIComponent(
    `My Vedic gemstone is ${gemName} (${gemSanskrit}).\n\n` +
    `${recommendation?.reason || ''}\n\n` +
    `Sacred mantra: ${mantra}\n\n` +
    `Get verified ${gemName} from Humara Pandit: ` +
    `https://humarapandit.com`
  );
  const whatsappUrl = `https://wa.me/?text=${shareText}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My gemstone: ${gemName}`,
          text: decodeURIComponent(shareText),
          url: 'https://humarapandit.com',
        });
      } catch {
        window.open(whatsappUrl, '_blank', 'noopener');
      }
    } else {
      window.open(whatsappUrl, '_blank', 'noopener');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Bar */}
      <header className="px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="btn-outline text-sm py-2 px-4"
            id="back-btn"
          >
            ← New Reading
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs"
              style={{ color: '#9b8ea0' }}
              id="dash-link"
            >
              Dashboard →
            </button>
            <p
              className="text-sm font-semibold tracking-[0.2em] uppercase"
              style={{ color: '#c9a84c' }}
            >
              Humara Pandit
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <ResultCard recommendation={recommendation} />

          {/* Upratna Card */}
          <UpratnaCard gemstoneId={gemstoneId} />

          {/* Rudraksha Cross-sell */}
          <RudrakshaCard planet={planetName} />

          {/* Wearing Ritual Checklist */}
          <WearingRitualChecklist
            gemstoneId={gemstoneId}
            storageKey={`ritual_${gemstoneId}_${formData?.rashi || 'x'}`}
          />

          {/* Tejas Bridge Card */}
          <div
            style={{
              backgroundColor: 'rgba(201, 168, 76, 0.06)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginTop: '2rem',
            }}
          >
            <span style={{ fontSize: '11px', color: '#9b8ea0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Powered by AI · Like Tejas
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f5f0e8', marginTop: '8px', marginBottom: '8px' }}>
              Want a deeper reading?
            </h3>
            <p style={{ fontSize: '13px', color: '#9b8ea0', lineHeight: 1.6, marginBottom: '16px' }}>
              This recommendation uses the same AI-Vedic reasoning behind Humara Pandit's Tejas — a personal AI Vedic astrologer trained on thousands of real Kundli charts. For a full birth chart analysis, personalized dasha predictions, and daily horoscope, try AskPandit.
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.humarapandit.askpandit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ display: 'inline-flex', fontSize: '13px', padding: '8px 16px' }}
              id="askpandit-cta"
            >
              Download AskPandit →
            </a>
            <p style={{ fontSize: '12px', color: '#9b8ea0', marginTop: '12px' }}>
              4.7★ · 100K+ downloads · Kundli · AI Tarot · Daily Predictions
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-10 space-y-4 text-center animate-fade-in">
            <a
              href="https://humarapandit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full sm:w-auto inline-flex"
              id="buy-cta"
            >
              Buy Verified {recommendation.gemstone} on Humara Pandit →
            </a>

            {/* WhatsApp Share */}
            <div>
              <button
                onClick={handleShare}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-white py-3.5 px-7 rounded-xl"
                style={{ backgroundColor: '#25D366', fontSize: '15px' }}
                id="whatsapp-share-btn"
              >
                Share on WhatsApp
              </button>
            </div>

            <div>
              <button
                onClick={() => navigate('/')}
                className="btn-outline"
                id="new-reading-btn"
              >
                Get Another Reading
              </button>
            </div>

            <p className="text-xs max-w-md mx-auto" style={{ color: '#9b8ea0' }}>
              Humara Pandit provides verified, authentic gemstones with certification.
              All spiritual remedies are fulfilled through our trusted astrologer network.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
