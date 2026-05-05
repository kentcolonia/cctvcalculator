import React, { useState } from 'react';
import CameraRow from './CameraRow';
import AddCameraModal from './AddCameraModal';

export default function CameraList({ cameras, onUpdate, onRemove, onAddGroup }) {
  const [showModal, setShowModal] = useState(false);
  const totalCams = cameras.reduce((s, c) => s + (c.count || 1), 0);

  function handleAdd(cam) {
    onAddGroup(cam);
    setShowModal(false);
  }

  return (
    <div style={{ marginBottom: '2.5rem' }}>

      {/* Header */}
      {cameras.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--text-3)' }}>
            Cameras &mdash; {totalCams} total
          </p>
          <button onClick={() => setShowModal(true)} style={{
            background: 'var(--accent)', color: 'var(--accent-text)',
            border: 'none', borderRadius: 8, padding: '8px 18px',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer',
          }}>
            + Add camera
          </button>
        </div>
      )}

      {/* Empty state */}
      {cameras.length === 0 && (
        <div style={{
          border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius)',
          padding: '3rem 2rem', textAlign: 'center',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', fontSize: 22,
          }}>
            📷
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No cameras yet</p>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '1.5rem' }}>
            Add your first camera to calculate storage requirements
          </p>
          <button onClick={() => setShowModal(true)} style={{
            background: 'var(--accent)', color: 'var(--accent-text)',
            border: 'none', borderRadius: 10, padding: '11px 24px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.03em',
          }}>
            + Add your first camera
          </button>
        </div>
      )}

      {/* Camera rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cameras.map((cam, idx) => (
          <CameraRow key={cam.id} cam={cam} index={idx}
            onUpdate={onUpdate} onRemove={onRemove} canRemove={true} />
        ))}
      </div>

      {showModal && (
        <AddCameraModal onAdd={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}