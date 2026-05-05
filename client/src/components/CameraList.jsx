import React from 'react';
import CameraRow from './CameraRow';

export default function CameraList({ cameras, onUpdate, onRemove, onAddGroup }) {
  const totalCams = cameras.reduce((s, c) => s + (c.count || 1), 0);

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-3)' }}>
          Camera groups &mdash; {totalCams} camera{totalCams !== 1 ? 's' : ''}
        </p>
        <button onClick={onAddGroup} style={{
          background: 'var(--accent)', color: 'var(--accent-text)',
          border: 'none', borderRadius: 8, padding: '8px 18px',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
          cursor: 'pointer', transition: 'opacity 0.15s',
        }}
          onMouseOver={e => e.target.style.opacity = 0.8}
          onMouseOut={e => e.target.style.opacity = 1}
        >
          + Add group
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cameras.map((cam, idx) => (
          <CameraRow key={cam.id} cam={cam} index={idx}
            onUpdate={onUpdate} onRemove={onRemove} canRemove={cameras.length > 1} />
        ))}
      </div>
    </div>
  );
}