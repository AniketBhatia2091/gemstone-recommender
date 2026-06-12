import { useState, useEffect } from 'react';
import gemstones from '../data/gemstones.json';

export default function WearingRitualChecklist({ gemstoneId, storageKey }) {
  const gem = gemstones.find(g => g.id === gemstoneId);
  const steps = gem?.wearing_ritual_steps;
  if (!steps || steps.length === 0) return null;

  const [completed, setCompleted] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(completed));
    } catch { /* sessionStorage unavailable */ }
  }, [completed, storageKey]);

  const completedCount = Object.values(completed).filter(Boolean).length;
  const allDone = completedCount === steps.length;

  const toggleStep = (step) => {
    setCompleted(prev => ({ ...prev, [step]: !prev[step] }));
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Title */}
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#c9a84c', marginBottom: '4px' }}>
        Your Wearing Ritual
      </h2>
      <p style={{ fontSize: '13px', color: '#9b8ea0', marginBottom: '16px' }}>
        Complete these steps before wearing your gemstone
      </p>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: '#1a1228', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(completedCount / steps.length) * 100}%`,
              height: '100%',
              borderRadius: '2px',
              backgroundColor: '#c9a84c',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <span style={{ fontSize: '12px', color: '#9b8ea0', whiteSpace: 'nowrap' }}>
          {completedCount} of {steps.length} steps
        </span>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {steps.map((s) => {
          const isDone = completed[s.step];
          return (
            <div
              key={s.step}
              onClick={() => toggleStep(s.step)}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  minWidth: '22px',
                  borderRadius: '4px',
                  border: `2px solid ${isDone ? '#c9a84c' : 'rgba(201,168,76,0.3)'}`,
                  backgroundColor: isDone ? 'rgba(201,168,76,0.15)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  transition: 'all 0.2s',
                }}
              >
                {isDone && <span style={{ color: '#c9a84c', fontSize: '14px', fontWeight: 700 }}>✓</span>}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#9b8ea0' }}>Step {s.step}</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isDone ? '#9b8ea0' : '#f5f0e8',
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}
                  >
                    {s.title}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#9b8ea0', marginTop: '4px', lineHeight: 1.5 }}>
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {allDone && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.25)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#c9a84c', marginBottom: '8px' }}>
            ✦ Ritual complete — your gemstone is ready to wear
          </p>
          {gem?.activation_mantra && (
            <p style={{ fontSize: '13px', color: '#c9a84c', fontStyle: 'italic' }}>
              {gem.activation_mantra}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
