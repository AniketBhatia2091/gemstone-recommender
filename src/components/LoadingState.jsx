import { useState, useEffect } from 'react';

const MESSAGES = [
  'Consulting the stars...',
  'Analyzing your rashi and lagna...',
  'Aligning planetary energies...',
  'Cross-referencing navaratna compatibility...',
  'Preparing your sacred recommendation...',
];

/**
 * LoadingState — Full viewport loading indicator with rotating messages
 */
export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div
        className="w-20 h-20 rounded-full animate-pulse-glow mb-8"
        style={{
          backgroundColor: 'rgba(201, 168, 76, 0.15)',
          border: '2px solid rgba(201, 168, 76, 0.4)',
        }}
      />

      <p
        className="text-lg font-medium text-center transition-opacity duration-300"
        style={{
          color: '#c9a84c',
          opacity: visible ? 1 : 0,
          minHeight: '28px',
        }}
      >
        {MESSAGES[messageIndex]}
      </p>

      <p className="text-sm mt-4" style={{ color: '#9b8ea0' }}>
        This usually takes 3–5 seconds
      </p>
    </div>
  );
}
