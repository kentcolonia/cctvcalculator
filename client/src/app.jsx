import React, { useEffect } from 'react';
import { useCalculator } from './hooks/useCalculator';
import CameraList from './components/CameraList';
import GlobalSettings from './components/GlobalSettings';
import ResultPanel from './components/ResultPanel';

export default function App() {
  const {
    cameras, days, overhead,
    setDays, setOverhead,
    addGroup, removeCamera, updateCamera,
    result, loading, error, calculate,
  } = useCalculator();

  useEffect(() => { calculate(cameras, days, overhead); }, [cameras, days, overhead]);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

      {/* Header */}
      <header className="fade-up" style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--green)', flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Storage calculator
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          CCTV Storage<br />Estimator
        </h1>
      </header>

      {/* Global */}
      <div className="fade-up delay-1">
        <GlobalSettings days={days} overhead={overhead} setDays={setDays} setOverhead={setOverhead} />
      </div>

      {/* Cameras */}
      <div className="fade-up delay-2">
        <CameraList cameras={cameras} onUpdate={updateCamera} onRemove={removeCamera} onAddGroup={addGroup} />
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 16 }}>{error}</p>
      )}

      {/* Results */}
      <div className="fade-up delay-3">
        <ResultPanel result={result} loading={loading} />
      </div>
    </div>
  );
}