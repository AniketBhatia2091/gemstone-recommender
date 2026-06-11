import { useState } from 'react';

/**
 * FallbackBanner — Dismissible notice shown when AI is unavailable
 * and recommendation comes from local classical database.
 */
export default function FallbackBanner() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-3 mb-6 animate-slide-down"
      style={{ backgroundColor: '#1c1000', border: '1px solid rgba(217, 119, 6, 0.3)' }}
      role="alert"
    >
      <p className="text-sm" style={{ color: '#d97706' }}>
        Showing traditional Vedic recommendation (AI temporarily unavailable — data from our classical database)
      </p>
      <button
        onClick={() => setHidden(true)}
        className="ml-4 text-lg leading-none hover:opacity-70 transition-opacity flex-shrink-0"
        style={{ color: '#d97706' }}
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
}
