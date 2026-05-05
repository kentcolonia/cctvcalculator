import React, { useState } from 'react';

const RESOLUTIONS = [
  { value: 0.5, label: 'D1 / CIF (0.5 MP)' },
  { value: 1,   label: '720p HD (1 MP)' },
  { value: 2,   label: '1080p FHD (2 MP)' },
  { value: 4,   label: '4 MP' },
  { value: 5,   label: '3K (5 MP)' },
  { value: 8,   label: '4K UHD (8 MP)' },
  { value: 12,  label: '4K+ (12 MP)' },
];

const CODECS = [
  { value: 'mjpeg',    label: 'MJPEG' },
  { value: 'h264',     label: 'H.264' },
  { value: 'h265',     label: 'H.265 / HEVC' },
  { value: 'h265plus', label: 'H.265+ / Smart' },
];

const field = {
  display: 'flex', flexDirection: 'column', gap: 6,
};
const labelStyle = {
  fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--text-3)',
};
const inputStyle = {
  border: '1px solid var(--border)', borderRadius: 8,
  padding: '10px 12px', fontSize: 14, fontWeight: 500,
  outline: 'none', background: 'var(--bg)', color: 'var(--text)',
  fontFamily: 'inherit', width: '100%',
};
const selectStyle = {
  ...inputStyle, cursor: 'pointer',
};

export default function AddCameraModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '',
    count: 1,
    resolution: 2,
    codec: 'h265',
    fps: 15,
    hoursPerDay: 24,
    motionFactor: 50,
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  function handleSubmit() {
    onAdd({ ...form, id: Date.now() });
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(15,15,13,0.45)',
        backdropFilter: 'blur(4px)', zIndex: 100,
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff', borderRadius: 20,
        padding: '2rem', width: 'min(520px, 90vw)',
        zIndex: 101, boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Add camera
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
              Configure specs for this camera or group
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--bg)', border: 'none', borderRadius: 8,
            width: 32, height: 32, fontSize: 18, cursor: 'pointer',
            color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Name + Count */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
            <div style={field}>
              <label style={labelStyle}>Camera name</label>
              <input style={inputStyle} placeholder="e.g. Outdoor entrance"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div style={field}>
              <label style={labelStyle}>Quantity</label>
              <input type="number" min="1" max="256" style={{ ...inputStyle, width: 80, textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
                value={form.count} onChange={e => set('count', +e.target.value)} />
            </div>
          </div>

          {/* Resolution + Codec */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={field}>
              <label style={labelStyle}>Resolution</label>
              <select style={selectStyle} value={form.resolution}
                onChange={e => set('resolution', +e.target.value)}>
                {RESOLUTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div style={field}>
              <label style={labelStyle}>Codec</label>
              <select style={selectStyle} value={form.codec}
                onChange={e => set('codec', e.target.value)}>
                {CODECS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* FPS + Hours + Motion */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { label: 'FPS', key: 'fps', min: 1, max: 60 },
              { label: 'Hrs / day', key: 'hoursPerDay', min: 1, max: 24 },
              { label: 'Motion %', key: 'motionFactor', min: 1, max: 100 },
            ].map(({ label, key, min, max }) => (
              <div key={key} style={field}>
                <label style={labelStyle}>{label}</label>
                <input type="number" min={min} max={max} style={{
                  ...inputStyle, textAlign: 'center',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16,
                }}
                  value={form[key]} onChange={e => set(key, +e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, marginTop: '1.75rem' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'transparent',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-2)',
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{
            flex: 2, padding: '12px', borderRadius: 10,
            border: 'none', background: 'var(--accent)', color: 'var(--accent-text)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Add camera
          </button>
        </div>
      </div>
    </>
  );
}