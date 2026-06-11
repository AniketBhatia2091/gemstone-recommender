/**
 * ErrorState — Full-page error display with retry option
 * @param {Object} props
 * @param {Function} props.onRetry - Callback for retry button
 */
export default function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '2px solid rgba(239, 68, 68, 0.3)' }}
      >
        <span className="text-3xl" style={{ color: '#ef4444' }}>✗</span>
      </div>

      <h2 className="text-xl font-semibold mb-2" style={{ color: '#f5f0e8' }}>
        Something went wrong
      </h2>

      <p className="text-sm mb-8 max-w-sm" style={{ color: '#9b8ea0' }}>
        We couldn&apos;t reach our recommendation service. Please try again.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="btn-gold"
          id="retry-btn"
        >
          Try Again
        </button>
        <a href="/" className="btn-outline">
          Go back home
        </a>
      </div>
    </div>
  );
}
