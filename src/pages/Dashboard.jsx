import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(sessionStorage.getItem('hp_recommendation_history') || '[]');
      setHistory(data);
    } catch { setHistory([]); }
  }, []);

  const clearHistory = () => {
    if (window.confirm('Clear all session history?')) {
      try { sessionStorage.removeItem('hp_recommendation_history'); } catch {}
      setHistory([]);
    }
  };

  // Stats
  const total = history.length;
  const aiCount = history.filter(h => h.source === 'ai').length;
  const aiRate = total > 0 ? Math.round((aiCount / total) * 100) + '%' : '—';
  const avgConf = total > 0
    ? (history.reduce((sum, h) => sum + (h.confidence_score || 0), 0) / total).toFixed(1)
    : '—';

  // Most recommended
  const gemCounts = {};
  history.forEach(h => { if (h.gemstone) gemCounts[h.gemstone] = (gemCounts[h.gemstone] || 0) + 1; });
  const topGem = Object.entries(gemCounts).sort((a, b) => b[1] - a[1])[0];
  const mostRecommended = topGem ? topGem[0] : '—';

  const formatTime = (ts) => {
    try { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch { return '—'; }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="btn-outline text-sm py-2 px-4" id="dash-back-btn">
            ← Back to Home
          </button>
          <p className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#c9a84c' }}>
            Humara Pandit
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: '#f5f0e8' }}>
              Recommendation Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: '#9b8ea0' }}>
              Session history — resets on tab close
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Readings', value: total },
              { label: 'AI Success Rate', value: aiRate },
              { label: 'Avg Confidence', value: avgConf },
              { label: 'Most Recommended', value: mostRecommended },
            ].map((stat) => (
              <div key={stat.label} className="card-glass p-4 text-center">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#9b8ea0' }}>{stat.label}</p>
                <p className="text-xl font-bold" style={{ color: '#c9a84c' }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Table or empty state */}
          {total === 0 ? (
            <div className="card-glass p-8 text-center animate-fade-in">
              <p className="text-lg mb-2" style={{ color: '#f5f0e8' }}>No recommendations yet.</p>
              <p className="text-sm mb-6" style={{ color: '#9b8ea0' }}>Go to Home to get your first reading.</p>
              <button onClick={() => navigate('/')} className="btn-gold" id="dash-home-btn">Get Your First Reading</button>
            </div>
          ) : (
            <div className="card-glass overflow-hidden">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                      {['Time', 'Rashi', 'Lagna', 'Concern', 'Gemstone', 'Confidence', 'Source', 'Speed'].map((col, i) => (
                        <th
                          key={col}
                          style={{
                            padding: '12px 14px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#9b8ea0',
                            textAlign: 'left',
                            fontWeight: 500,
                          }}
                          className={i === 2 || i === 7 ? 'hidden sm:table-cell' : ''}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row) => {
                      const confColor = (row.confidence_score || 0) >= 80 ? '#22c55e' : (row.confidence_score || 0) >= 60 ? '#f59e0b' : '#ef4444';
                      return (
                        <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: '#f5f0e8' }}>{formatTime(row.timestamp)}</td>
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: '#f5f0e8' }}>{row.rashi}</td>
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: '#f5f0e8' }} className="hidden sm:table-cell">{row.lagna}</td>
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: '#9b8ea0', textTransform: 'capitalize' }}>{row.issue?.replace('_', ' ')}</td>
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: '#c9a84c', fontWeight: 500 }}>{row.gemstone}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
                              backgroundColor: `${confColor}20`, color: confColor,
                            }}>
                              {row.confidence_score || 0}%
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
                              backgroundColor: row.source === 'ai' ? 'rgba(20,184,166,0.15)' : 'rgba(245,158,11,0.15)',
                              color: row.source === 'ai' ? '#14b8a6' : '#f59e0b',
                            }}>
                              {row.source === 'ai' ? 'AI' : 'Fallback'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: '#9b8ea0' }} className="hidden sm:table-cell">
                            {((row.response_time_ms || 0) / 1000).toFixed(1)}s
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clear button */}
          {total > 0 && (
            <div className="mt-4 text-right">
              <button
                onClick={clearHistory}
                className="text-sm px-4 py-2 rounded-lg"
                style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                id="clear-history-btn"
              >
                Clear history
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
