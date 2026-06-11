import { useState } from 'react';

/**
 * MantraBlock — Styled display for sacred mantras with copy functionality
 * @param {Object} props
 * @param {string} props.mantra - Main activation mantra
 * @param {string} props.beejMantra - Beej (seed) mantra
 */
export default function MantraBlock({ mantra, beejMantra }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mantra || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = mantra || '';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative rounded-xl p-6 border-l-4" style={{ backgroundColor: 'rgba(201, 168, 76, 0.06)', borderLeftColor: '#c9a84c' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" style={{ color: '#c9a84c' }}>ॐ</span>
          <span className="text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a84c' }}>
            Sacred Mantra (Mantra Jaap)
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="btn-outline text-xs px-3 py-1.5"
          id="copy-mantra-btn"
          aria-label="Copy mantra to clipboard"
        >
          {copied ? 'Copied! ✓' : 'Copy Mantra'}
        </button>
      </div>

      <p
        className="text-center text-lg font-serif tracking-wider mb-3"
        style={{ color: '#c9a84c', letterSpacing: '0.05em', lineHeight: 1.8 }}
      >
        {mantra}
      </p>

      {beejMantra && (
        <p className="text-center text-sm" style={{ color: '#9b8ea0' }}>
          Beej Mantra: {beejMantra}
        </p>
      )}
    </div>
  );
}
