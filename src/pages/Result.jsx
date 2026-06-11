import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';

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

  const { recommendation } = state;

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
          <p
            className="text-sm font-semibold tracking-[0.2em] uppercase"
            style={{ color: '#c9a84c' }}
          >
            Humara Pandit
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <ResultCard recommendation={recommendation} />

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
