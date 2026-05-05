const express = require('express');
const router = express.Router();

const BASE_BITRATE = { 0.5: 0.5, 1: 1.5, 2: 4, 4: 6, 5: 8, 8: 12, 12: 20 };
const CODEC_FACTOR = { mjpeg: 1.0, h264: 0.55, h265: 0.35, h265plus: 0.25 };

function calcCameraGB(cam, days) {
  const baseMbps = BASE_BITRATE[cam.resolution] || 4;
  const codecFactor = CODEC_FACTOR[cam.codec] || 0.35;
  const fpsFactor = (cam.fps || 15) / 15;
  const motionDecimal = Math.min(100, Math.max(1, cam.motionFactor || 50)) / 100;
  const hoursPerDay = Math.min(24, Math.max(1, cam.hoursPerDay || 24));
  const count = Math.max(1, cam.count || 1);
  const bitrateMbps = baseMbps * codecFactor * fpsFactor * motionDecimal;
  const perCamPerDayGB = (bitrateMbps * 3600 * hoursPerDay) / (8 * 1024);
  return {
    bitrateMbps: +bitrateMbps.toFixed(3),
    perCamPerDayGB: +perCamPerDayGB.toFixed(4),
    totalGB: +(perCamPerDayGB * count * days).toFixed(4),
    count,
  };
}

// POST /api/calculator/calculate
router.post('/calculate', (req, res) => {
  const { cameras = [], days = 30, overhead = 20 } = req.body;
  if (!cameras.length) return res.status(400).json({ error: 'No cameras provided' });

  const overheadDecimal = Math.min(50, Math.max(0, overhead)) / 100;

  const cameraResults = cameras.map((cam, i) => {
    const result = calcCameraGB(cam, days);
    return {
      id: cam.id || i,
      name: cam.name || 'Camera ' + (i + 1),
      resolution: cam.resolution,
      codec: cam.codec,
      fps: cam.fps,
      hoursPerDay: cam.hoursPerDay,
      motionFactor: cam.motionFactor,
      count: result.count,
      bitrateMbps: result.bitrateMbps,
      perCamPerDayGB: result.perCamPerDayGB,
      groupTotalGB: result.totalGB,
    };
  });

  const rawTotalGB = cameraResults.reduce((sum, c) => sum + c.groupTotalGB, 0);
  const totalGB = rawTotalGB * (1 + overheadDecimal);
  const totalCameras = cameraResults.reduce((sum, c) => sum + c.count, 0);
  const allCamsPerDayGB = cameraResults.reduce((sum, c) => sum + c.perCamPerDayGB * c.count, 0);

  const hddSizes = [500, 1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000];
  const hddOptions = hddSizes
    .map((size) => ({ sizeGB: size, count: Math.ceil(totalGB / size) }))
    .filter((x) => x.count >= 1 && x.count <= 8)
    .slice(0, 5);
  const recommended = hddOptions.find((x) => x.count <= 2) || hddOptions[hddOptions.length - 1];

  res.json({
    cameraResults,
    totalCameras,
    allCamsPerDayGB: +allCamsPerDayGB.toFixed(4),
    rawTotalGB: +rawTotalGB.toFixed(2),
    totalGB: +totalGB.toFixed(2),
    hddOptions,
    recommended,
  });
});

// POST /api/calculator/days-from-storage
// Given existing storage and cameras, how many days can they record?
router.post('/days-from-storage', (req, res) => {
  const { cameras = [], storageGB = 0, overhead = 20 } = req.body;
  if (!cameras.length) return res.status(400).json({ error: 'No cameras provided' });
  if (!storageGB || storageGB <= 0) return res.status(400).json({ error: 'Invalid storage size' });

  const overheadDecimal = Math.min(50, Math.max(0, overhead)) / 100;

  // Usable storage after overhead
  const usableGB = storageGB / (1 + overheadDecimal);

  const cameraDetails = cameras.map((cam, i) => {
    const r = calcCameraGB(cam, 1); // per day
    return {
      id: cam.id || i,
      name: cam.name || 'Camera ' + (i + 1),
      resolution: cam.resolution,
      codec: cam.codec,
      fps: cam.fps,
      hoursPerDay: cam.hoursPerDay,
      motionFactor: cam.motionFactor,
      count: r.count,
      bitrateMbps: r.bitrateMbps,
      perCamPerDayGB: r.perCamPerDayGB,
      groupPerDayGB: +(r.perCamPerDayGB * r.count).toFixed(4),
    };
  });

  const totalPerDayGB = cameraDetails.reduce((sum, c) => sum + c.groupPerDayGB, 0);
  const recordingDays = totalPerDayGB > 0 ? Math.floor(usableGB / totalPerDayGB) : 0;

  // Breakdown: how many days each group contributes to filling storage
  const storageBreakdown = cameraDetails.map(c => ({
    ...c,
    daysUntilFull: totalPerDayGB > 0 ? Math.floor(usableGB / c.groupPerDayGB) : 0,
    percentOfDaily: +((c.groupPerDayGB / totalPerDayGB) * 100).toFixed(1),
  }));

  res.json({
    storageGB,
    usableGB: +usableGB.toFixed(2),
    totalPerDayGB: +totalPerDayGB.toFixed(4),
    recordingDays,
    recordingWeeks: +(recordingDays / 7).toFixed(1),
    recordingMonths: +(recordingDays / 30).toFixed(1),
    storageBreakdown,
  });
});

module.exports = router;