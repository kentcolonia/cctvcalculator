import React from 'react';

function fmtGB(gb) {
  if (!gb && gb !== 0) return '—';
  if (gb >= 1000) return { val: (gb / 1000).toFixed(2), unit: 'TB' };
  return { val: Math.round(gb), unit: 'GB' };
}

function StorageDisplay({ gb, large }) {
  const f = fmtGB(gb);
  if (!f || f === '—') return <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>;
  return (
    <span>
      <span style={{ fontSize: large ? 36 : 22, fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' }}>
        {f.val}
      </span>
      <span style={{ fontSize: large ? 14 : 11, fontWeight: 500,
        color: 'rgba(255,255,255,0.45)', marginLeft: 4 }}>
        {f.unit}
      </span>
    </span>
  );
}

export default function ResultPanel({ result, loading }) {
  if (!result) return null;

  return (
    <div style={{
      background: 'var(--text)', borderRadius: 'var(--radius)',
      padding: '2rem', opacity: loading ? 0.75 : 1, transition: 'opacity 0.2s',
    }}>

      {/* Top label */}
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>
        Storage estimate
      </p>

      {/* Hero number */}
      <div style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
          Total storage required
        </p>
        <StorageDisplay gb={result.totalGB} large />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 12,
        overflow: 'hidden', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total cameras', value: result.totalCameras, mono: true, raw: true },
          { label: 'All cams / day', gb: result.allCamsPerDayGB },
          { label: 'Raw (no overhead)', gb: result.rawTotalGB },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 18px' }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
              {s.label}
            </p>
            {s.raw
              ? <span style={{ fontSize: 22, fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace", color: '#fff' }}>
                  {s.value}
                </span>
              : <StorageDisplay gb={s.gb} />
            }
          </div>
        ))}
      </div>

      {/* Group breakdown */}
      {result.cameraResults.length > 1 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
            By group
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {result.cameraResults.map((cam) => {
              const f = fmtGB(cam.groupTotalGB);
              return (
                <div key={cam.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      color: 'rgba(255,255,255,0.3)' }}>
                      ×{cam.count}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                      {cam.name || `Camera group ${cam.id}`}
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)',
                      fontFamily: "'JetBrains Mono', monospace" }}>
                      {cam.bitrateMbps} Mbps
                    </span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.7)' }}>
                    {f.val} {f.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HDD options */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
          Drive configuration
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {result.hddOptions.map((h) => {
            const isRec = h.sizeGB === result.recommended?.sizeGB;
            return (
              <div key={h.sizeGB} style={{
                padding: '8px 16px', borderRadius: 8,
                border: isRec ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.12)',
                background: isRec ? 'rgba(255,255,255,0.12)' : 'transparent',
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                  fontWeight: isRec ? 600 : 400, color: isRec ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {h.count} × {h.sizeGB >= 1000 ? `${h.sizeGB / 1000}TB` : `${h.sizeGB}GB`}
                </span>
                {isRec && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                    marginLeft: 8, letterSpacing: '0.06em' }}>
                    REC
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}