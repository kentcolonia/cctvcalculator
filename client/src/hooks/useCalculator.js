import { useState, useCallback } from 'react';

const newCamera = (id) => ({
  id,
  name: '',
  count: 1,
  resolution: 2,
  codec: 'h265',
  fps: 15,
  hoursPerDay: 24,
  motionFactor: 50,
});

export function useCalculator() {
  const [cameras, setCameras] = useState([newCamera(1)]);
  const [days, setDays] = useState(30);
  const [overhead, setOverhead] = useState(20);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addGroup = useCallback(() => {
    setCameras((prev) => [...prev, newCamera(Date.now())]);
  }, []);

  const removeCamera = useCallback((id) => {
    setCameras((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCamera = useCallback((id, key, value) => {
    setCameras((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  }, []);

  const calculate = useCallback(async (cams, d, o) => {
    if (!cams.length) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/calculator/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cameras: cams, days: d, overhead: o }),
      });
      if (!res.ok) throw new Error('Calculation failed');
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cameras, days, overhead,
    setCameras, setDays, setOverhead,
    addGroup, removeCamera, updateCamera,
    result, loading, error, calculate,
  };
}