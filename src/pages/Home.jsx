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
  const { recommend, loading, error, data, reset } = useRecommendation();

  const handleSubmit = async (formData) => {
    await recommend(formData);
  };

  // Navigate to result page when data arrives
  if (data) {
    // Use setTimeout to avoid setState during render
    setTimeout(() => {
      navigate('/result', { state: { recommendation: data } });
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
        <div className="max-w-2xl mx-auto">
          <p
            className="text-sm font-semibold tracking-[0.2em] uppercase"
            style={{ color: '#c9a84c' }}
          >
            Humara Pandit
          </p>
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

          {/* Form Card */}
          <div className="card-glass p-6 sm:p-8 animate-fade-in-up">
            <InputForm onSubmit={handleSubmit} loading={loading} />
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
