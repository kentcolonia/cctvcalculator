import React from 'react';

function fmtGB(gb) {
  if (gb === undefined || gb === null) return { val: '—', unit: '' };
  if (gb >= 1000) return { val: (gb / 1000).toFixed(2), unit: 'TB' };
  return { val: Math.round(gb), unit: 'GB' };
}

const CODEC_LABELS = { mjpeg: 'MJPEG', h264: 'H.264', h265: 'H.265', h265plus: 'H.265+' };
const RES_LABELS = { 0.5: 'D1', 1: '720p', 2: '1080p', 4: '4MP', 5: '3K', 8: '4K', 12: '4K+' };

function Card({ icon, label, value, unit, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--text)' : 'var(--surface)',
      border: accent ? 'none' : '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '20px 22px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: accent ? 'rgba(255,255,255,0.45)' : 'var(--text-3)' }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em',
          fontFamily: "'JetBrains Mono', monospace",
          color: accent ? '#fff' : 'var(--text)' }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 14, fontWeight: 500,
            color: accent ? 'rgba(255,255,255,0.45)' : 'var(--text-3)' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ResultPanel({ result, loading }) {
  if (!result) return null;

  const total = fmtGB(result.totalGB);
  const perDay = fmtGB(result.allCamsPerDayGB);
  const raw = fmtGB(result.rawTotalGB);

  return (
    <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>

      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
        Storage estimate
      </p>

      {/* Top cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Card icon="💾" label="Total storage" value={total.val} unit={total.unit} accent />
        <Card icon="📅" label="Daily usage" value={perDay.val} unit={perDay.unit} />
        <Card icon="📷" label="Total cameras" value={result.totalCameras} unit="cams" />
      </div>

      {/* Secondary row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Card icon="📦" label="Raw (no overhead)" value={raw.val} unit={raw.unit} />
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '20px 22px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>🖴</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-3)' }}>
              Recommended drive
            </span>
          </div>
          {result.recommended && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em',
                fontFamily: "'JetBrains Mono', monospace", color: 'var(--text)' }}>
                {result.recommended.count}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-3)' }}>
                × {result.recommended.sizeGB >= 1000
                  ? `${result.recommended.sizeGB / 1000}TB`
                  : `${result.recommended.sizeGB}GB`} HDD
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Per camera breakdown */}
      {result.cameraResults.length > 0 && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>📋</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-3)' }}>
              Breakdown by camera
            </span>
          </div>
          {result.cameraResults.map((cam, i) => {
            const g = fmtGB(cam.groupTotalGB);
            return (
              <div key={cam.id} style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                alignItems: 'center', padding: '14px 20px',
                borderBottom: i < result.cameraResults.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
                    {cam.name || `Camera ${i + 1}`}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {cam.count}× · {RES_LABELS[cam.resolution] || cam.resolution + 'MP'} ·{' '}
                    {CODEC_LABELS[cam.codec]} · {cam.fps}fps · {cam.hoursPerDay}h/day · {cam.bitrateMbps} Mbps
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 18, fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace", color: 'var(--text)' }}>
                    {g.val}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 4 }}>{g.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All HDD options */}
      {result.hddOptions?.length > 0 && (
        <div style={{ marginTop: 12, padding: '16px 20px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
            🖥️ &nbsp;All drive options
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {result.hddOptions.map((h) => {
              const isRec = h.sizeGB === result.recommended?.sizeGB;
              return (
                <div key={h.sizeGB} style={{
                  padding: '7px 14px', borderRadius: 8,
                  border: isRec ? '1.5px solid var(--text)' : '1px solid var(--border)',
                  background: isRec ? 'var(--text)' : 'transparent',
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    fontWeight: isRec ? 600 : 400,
                    color: isRec ? '#fff' : 'var(--text-2)' }}>
                    {h.count} × {h.sizeGB >= 1000 ? `${h.sizeGB / 1000}TB` : `${h.sizeGB}GB`}
                  </span>
                  {isRec && (
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)',
                      marginLeft: 6, fontWeight: 600, letterSpacing: '0.06em' }}>
                      REC
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}