import React, { useState } from 'react';

const RESOLUTIONS = [
  { value: 0.5, label: 'D1 / CIF', sub: '0.5 MP' },
  { value: 1,   label: '720p HD',  sub: '1 MP' },
  { value: 2,   label: '1080p',    sub: '2 MP' },
  { value: 4,   label: '4 MP',     sub: '4 MP' },
  { value: 5,   label: '3K',       sub: '5 MP' },
  { value: 8,   label: '4K UHD',   sub: '8 MP' },
  { value: 12,  label: '4K+',      sub: '12 MP' },
];

const CODECS = [
  { value: 'mjpeg',    label: 'MJPEG' },
  { value: 'h264',     label: 'H.264' },
  { value: 'h265',     label: 'H.265' },
  { value: 'h265plus', label: 'H.265+' },
];

const monoInput = {
  border: 'none', outline: 'none', background: 'transparent',
  fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 500,
  color: 'var(--text)', width: '100%', letterSpacing: '-0.01em',
};
const cellLabel = {
  fontSize: 10, fontWeight: 600, letterSpacing: '0.09em',
  textTransform: 'uppercase', color: 'var(--text-3)',
  display: 'block', marginBottom: 8,
};
const selectStyle = {
  border: 'none', outline: 'none', background: 'transparent',
  fontSize: 14, fontWeight: 500, color: 'var(--text)', cursor: 'pointer',
  width: '100%', fontFamily: 'inherit',
};

export default function CameraRow({ cam, index, onUpdate, onRemove, canRemove }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 20px',
        borderBottom: open ? '1px solid var(--border)' : 'none',
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-3)', minWidth: 20,
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <input placeholder="Group name (e.g. Outdoor 4K)"
          value={cam.name} onChange={e => onUpdate(cam.id, 'name', e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15,
            fontWeight: 600, background: 'transparent', color: 'var(--text)',
            fontFamily: 'inherit' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>qty</span>
          <input type="number" min="1" max="256" value={cam.count}
            onChange={e => onUpdate(cam.id, 'count', +e.target.value)}
            style={{ width: 52, border: '1px solid var(--border)', borderRadius: 8,
              padding: '5px 8px', fontSize: 14, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace", textAlign: 'center',
              outline: 'none', background: 'var(--bg)' }} />
        </div>

        <button onClick={() => setOpen(x => !x)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-3)', fontSize: 11, padding: '4px 6px',
          fontFamily: 'inherit', fontWeight: 600, letterSpacing: '0.05em',
        }}>
          {open ? 'HIDE' : 'EDIT'}
        </button>

        {canRemove && (
          <button onClick={() => onRemove(cam.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', fontSize: 18, lineHeight: 1,
            padding: '2px 4px', opacity: 0.5,
          }}
            onMouseOver={e => e.target.style.opacity = 1}
            onMouseOut={e => e.target.style.opacity = 0.5}
          >×</button>
        )}
      </div>

      {/* Specs grid */}
      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            {
              label: 'Resolution',
              content: (
                <select style={selectStyle} value={cam.resolution}
                  onChange={e => onUpdate(cam.id, 'resolution', +e.target.value)}>
                  {RESOLUTIONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label} ({r.sub})</option>
                  ))}
                </select>
              ),
            },
            {
              label: 'Codec',
              content: (
                <select style={selectStyle} value={cam.codec}
                  onChange={e => onUpdate(cam.id, 'codec', e.target.value)}>
                  {CODECS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              ),
            },
            {
              label: 'FPS',
              content: <input type="number" min="1" max="60" value={cam.fps} style={monoInput}
                onChange={e => onUpdate(cam.id, 'fps', +e.target.value)} />,
            },
            {
              label: 'Hrs / day',
              content: <input type="number" min="1" max="24" value={cam.hoursPerDay} style={monoInput}
                onChange={e => onUpdate(cam.id, 'hoursPerDay', +e.target.value)} />,
            },
            {
              label: 'Motion %',
              content: <input type="number" min="1" max="100" value={cam.motionFactor} style={monoInput}
                onChange={e => onUpdate(cam.id, 'motionFactor', +e.target.value)} />,
            },
          ].map((cell, i, arr) => (
            <div key={cell.label} style={{
              padding: '16px 20px',
              borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={cellLabel}>{cell.label}</span>
              {cell.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}