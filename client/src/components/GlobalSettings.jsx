import React from 'react';

export default function GlobalSettings({ days, overhead, setDays, setOverhead }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text-3)', marginBottom: 14 }}>
        Recording settings
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Retention period', value: days, set: setDays, unit: 'days', min: 1, max: 365 },
          { label: 'Overhead buffer', value: overhead, set: setOverhead, unit: '%', min: 0, max: 50 },
        ].map(({ label, value, set, unit, min, max }) => (
          <div key={label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px 22px',
          }}>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-3)', display: 'block', marginBottom: 12 }}>
              {label}
            </label>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <input type="number" min={min} max={max} value={value}
                onChange={e => set(+e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 32, fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace", background: 'transparent',
                  color: 'var(--text)', width: '100%', letterSpacing: '-0.02em' }} />
              <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}