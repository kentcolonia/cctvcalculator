import { useState, useCallback } from 'react';

export function useCalculator() {
  const [cameras, setCameras] = useState([]);
  const [days, setDays] = useState(30);
  const [overhead, setOverhead] = useState(20);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addGroup = useCallback((cam) => {
    setCameras((prev) => [...prev, cam]);
  }, []);

  const removeCamera = useCallback((id) => {
    setCameras((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) setResult(null);
      return next;
    });
  }, []);

  const updateCamera = useCallback((id, key, value) => {
    setCameras((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  }, []);

  const calculate = useCallback(async (cams, d, o) => {
    if (!cams.length) { setResult(null); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/calculator/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cameras: cams, days: d, overhead: o }),
      });
      if (!res.ok) throw new Error('Calculation failed');
      setResult(await res.json());
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