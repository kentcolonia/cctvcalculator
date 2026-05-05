import React, { useState } from 'react';

const STORAGE_PRESETS = [
  { label: '500 GB', value: 500 },
  { label: '1 TB', value: 1000 },
  { label: '2 TB', value: 2000 },
  { label: '4 TB', value: 4000 },
  { label: '6 TB', value: 6000 },
  { label: '8 TB', value: 8000 },
];

export default function ExistingStorage({ cameras, overhead, disabled }) {
  const [storageGB, setStorageGB] = useState('');
  const [unit, setUnit] = useState('TB');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function getGB() {
    const val = parseFloat(storageGB);
    if (!val || val <= 0) return 0;
    return unit === 'TB' ? val * 1000 : val;
  }

  async function calculate() {
    const gb = getGB();
    if (!gb) return;
    if (!cameras.length) { setError('Add cameras first'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/calculator/days-from-storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cameras, storageGB: gb, overhead }),
      });
      if (!res.ok) throw new Error('Calculation failed');
      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fmt(gb) {
    if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`;
    return `${Math.round(gb)} GB`;
  }

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
        Existing storage check
      </p>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}>
        {/* Input area */}
        <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--border)' }}>
          {disabled && (
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
              Add cameras above to use this feature
            </p>
          )}
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
            Enter your current HDD size to see how many days your cameras can record.
          </p>

          {/* Presets */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {STORAGE_PRESETS.map(p => {
              const presetGB = p.value;
              const selected = getGB() === presetGB;
              return (
                <button key={p.label} onClick={() => {
                  if (p.value >= 1000) { setStorageGB(String(p.value / 1000)); setUnit('TB'); }
                  else { setStorageGB(String(p.value)); setUnit('GB'); }
                }} style={{
                  padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                  border: selected ? '1.5px solid var(--text)' : '1px solid var(--border)',
                  background: selected ? 'var(--text)' : 'transparent',
                  color: selected ? '#fff' : 'var(--text-2)',
                  fontSize: 13, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom input */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--text-3)', display: 'block', marginBottom: 8 }}>
                Custom size
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" min="1" placeholder="e.g. 3"
                  value={storageGB} onChange={e => setStorageGB(e.target.value)}
                  style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 8,
                    padding: '10px 12px', fontSize: 16, fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace", outline: 'none',
                    background: 'var(--bg)', color: 'var(--text)' }} />
                <select value={unit} onChange={e => setUnit(e.target.value)} style={{
                  border: '1px solid var(--border)', borderRadius: 8,
                  padding: '10px 12px', fontSize: 14, fontWeight: 600,
                  outline: 'none', background: 'var(--bg)', color: 'var(--text)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <option value="TB">TB</option>
                  <option value="GB">GB</option>
                </select>
              </div>
            </div>
            <button onClick={calculate} disabled={!storageGB || loading} style={{
              background: loading ? 'var(--border)' : 'var(--text)',
              color: loading ? 'var(--text-3)' : '#fff',
              border: 'none', borderRadius: 8, padding: '10px 22px',
              fontSize: 13, fontWeight: 600, cursor: storageGB ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}>
              {loading ? 'Calculating...' : 'Calculate days'}
            </button>
          </div>
          {error && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 8 }}>{error}</p>}
        </div>

        {/* Result */}
        {result && (
          <div style={{ padding: '20px 22px' }}>

            {/* Hero */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { icon: '📅', label: 'Recording days', value: result.recordingDays, unit: 'days' },
                { icon: '📆', label: 'Recording weeks', value: result.recordingWeeks, unit: 'wks' },
                { icon: '🗓️', label: 'Recording months', value: result.recordingMonths, unit: 'mo' },
              ].map(c => (
                <div key={c.label} style={{
                  background: 'var(--bg)', borderRadius: 12, padding: '16px',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span>{c.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: 'var(--text-3)' }}>{c.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em',
                      fontFamily: "'JetBrains Mono', monospace", color: 'var(--text)' }}>
                      {c.value}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{c.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Meta */}
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
              Storage: <strong style={{ color: 'var(--text-2)' }}>{fmt(result.storageGB)}</strong>
              &nbsp;·&nbsp; Usable: <strong style={{ color: 'var(--text-2)' }}>{fmt(result.usableGB)}</strong>
              &nbsp;·&nbsp; Daily usage: <strong style={{ color: 'var(--text-2)' }}>{fmt(result.totalPerDayGB)}</strong>
            </p>

            {/* Per camera usage bar */}
            {result.storageBreakdown.length > 1 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
                  Daily usage by camera
                </p>
                {result.storageBreakdown.map((cam) => (
                  <div key={cam.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>
                        {cam.name || `Camera ${cam.id}`}
                        <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 6 }}>
                          ×{cam.count}
                        </span>
                      </span>
                      <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                        color: 'var(--text-2)' }}>
                        {fmt(cam.groupPerDayGB)}/day · {cam.percentOfDaily}%
                      </span>
                    </div>
                    <div style={{ background: 'var(--border)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 4,
                        background: 'var(--text)',
                        width: `${cam.percentOfDaily}%`,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}