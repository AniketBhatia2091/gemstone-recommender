import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from '../components/InputForm';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useRecommendation } from '../hooks/useRecommendation';

/**
 * Home — Landing page with astrological profile form
 */
export default function Home() {
  const navigate = useNavigate();
  const { recommend, loading, error, data, reset, rateLimited, cooldownSeconds } = useRecommendation();
  const [lastFormData, setLastFormData] = useState(null);

  const handleSubmit = async (formData) => {
    setLastFormData(formData);
    await recommend(formData);
  };

  // Navigate to result page when data arrives
  if (data) {
    // Use setTimeout to avoid setState during render
    setTimeout(() => {
      navigate('/result', { state: { recommendation: data, formData: lastFormData } });
    }, 0);
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <ErrorState onRetry={reset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <p
            className="text-sm font-semibold tracking-[0.2em] uppercase"
            style={{ color: '#c9a84c' }}
          >
            Humara Pandit
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs"
            style={{ color: '#9b8ea0' }}
            id="home-dash-link"
          >
            Dashboard →
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 px-4 sm:px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 animate-fade-in">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight"
              style={{ color: '#f5f0e8' }}
            >
              Discover Your Sacred Gemstone
            </h1>
            <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: '#9b8ea0' }}>
              Ancient Vedic wisdom meets modern clarity. Find the navaratna
              aligned with your graha and unlock your potential.
            </p>
            <hr className="divider-gold" />
          </div>

          {/* Disclaimer Banner */}
          <div
            style={{
              backgroundColor: 'rgba(201, 168, 76, 0.08)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
            }}
          >
            <span style={{ color: '#c9a84c', fontSize: '14px', flexShrink: 0 }}>◈</span>
            <p style={{ fontSize: '12px', color: '#9b8ea0', margin: 0 }}>
              Gemstone recommendations are for spiritual guidance only. Humara Pandit recommends consulting a certified Jyotish acharya before purchasing any remedy.
            </p>
          </div>

          {/* Form Card */}
          <div className="card-glass p-6 sm:p-8 animate-fade-in-up">
            {rateLimited ? (
              <div
                className="text-center py-6 animate-fade-in"
                style={{
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  padding: '24px',
                }}
              >
                <p style={{ color: '#f59e0b', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                  Please wait {cooldownSeconds}s before your next reading
                </p>
                <p style={{ fontSize: '12px', color: '#9b8ea0' }}>
                  Protecting your Gemini API free tier limit
                </p>
              </div>
            ) : (
              <InputForm onSubmit={handleSubmit} loading={loading} />
            )}
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center space-y-1">
            <p className="text-xs" style={{ color: '#9b8ea0' }}>
              Recommendations based on classical Vedic astrology (Parashari system)
            </p>
            <p className="text-xs" style={{ color: '#9b8ea0' }}>
              Not a substitute for consultation with a certified Jyotish acharya
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
