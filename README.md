# CCTV Storage Calculator

A full-stack web application for estimating CCTV storage requirements. Built with **Express.js** backend and **React** (Vite) frontend.

---

## Features

- **Camera management** — Add multiple cameras or camera groups with individual specs
- **Storage estimator** — Calculate total storage needed based on retention period
- **Existing storage check** — Input your current HDD size and see how many days it can record
- **HDD recommendations** — Get suggested drive configurations for your setup
- **Per-camera breakdown** — See daily usage and storage share per camera group
- **Mixed camera support** — Each camera can have different resolution, codec, FPS, and schedule

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, Vite 5        |
| Backend  | Node.js, Express 5      |
| Styling  | CSS Variables, Inline   |
| Fonts    | Syne, JetBrains Mono    |

---

## Project Structure

```
cctvcalculator/
├── server/
│   ├── index.js                        # Express entry point (port 3001)
│   └── routes/
│       └── calculator.js               # API routes
├── client/
│   ├── index.html                      # HTML entry point
│   ├── vite.config.js                  # Vite config + API proxy
│   └── src/
│       ├── app.jsx                     # Root component
│       ├── main.jsx                    # React DOM entry
│       ├── index.css                   # (optional) global styles
│       ├── hooks/
│       │   └── useCalculator.js        # State + API logic
│       └── components/
│           ├── GlobalSettings.jsx      # Retention days + overhead
│           ├── CameraList.jsx          # Camera list + empty state
│           ├── CameraRow.jsx           # Individual camera row
│           ├── AddCameraModal.jsx      # Add camera modal
│           ├── ExistingStorage.jsx     # Existing HDD checker
│           └── ResultPanel.jsx         # Storage estimate cards
├── package.json                        # Root scripts
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v8 or higher

### Installation

```bash
# 1. Install root dependencies (Express, nodemon, concurrently)
npm install

# 2. Install client dependencies (React, Vite)
cd client
npm install
cd ..
```

### Running in Development

```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:3001

### Production Build

```bash
# Build React into client/dist
npm run build

# Serve everything from Express
npm start
```

---

## API Reference

### `POST /api/calculator/calculate`

Calculate total storage needed for a set of cameras over a retention period.

**Request body:**
```json
{
  "cameras": [
    {
      "id": 1,
      "name": "Outdoor entrance",
      "count": 2,
      "resolution": 2,
      "codec": "h265",
      "fps": 15,
      "hoursPerDay": 24,
      "motionFactor": 50
    }
  ],
  "days": 30,
  "overhead": 20
}
```

**Resolution values:**
| Value | Resolution |
|-------|------------|
| 0.5   | D1 / CIF   |
| 1     | 720p HD    |
| 2     | 1080p FHD  |
| 4     | 4 MP       |
| 5     | 3K (5 MP)  |
| 8     | 4K UHD     |
| 12    | 4K+ (12MP) |

**Codec values:** `mjpeg` · `h264` · `h265` · `h265plus`

**Response:**
```json
{
  "cameraResults": [...],
  "totalCameras": 2,
  "allCamsPerDayGB": 14.7656,
  "rawTotalGB": 442.97,
  "totalGB": 531.56,
  "hddOptions": [
    { "sizeGB": 1000, "count": 1 }
  ],
  "recommended": { "sizeGB": 1000, "count": 1 }
}
```

---

### `POST /api/calculator/days-from-storage`

Given an existing HDD size and camera setup, calculate how many days can be recorded.

**Request body:**
```json
{
  "cameras": [...],
  "storageGB": 2000,
  "overhead": 20
}
```

**Response:**
```json
{
  "storageGB": 2000,
  "usableGB": 1666.67,
  "totalPerDayGB": 14.7656,
  "recordingDays": 112,
  "recordingWeeks": 16.0,
  "recordingMonths": 3.7,
  "storageBreakdown": [
    {
      "name": "Outdoor entrance",
      "count": 2,
      "groupPerDayGB": 14.7656,
      "percentOfDaily": 100.0
    }
  ]
}
```

---

## Camera Specs Reference

| Spec         | Options                              |
|--------------|--------------------------------------|
| Resolution   | D1, 720p, 1080p, 4MP, 3K, 4K, 4K+  |
| Codec        | MJPEG, H.264, H.265, H.265+          |
| FPS          | 1 – 60                               |
| Hours/day    | 1 – 24                               |
| Motion %     | 1 – 100 (how often motion occurs)    |
| Overhead     | 0 – 50% (filesystem + NVR buffer)    |

---

## Scripts

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start both frontend and backend      |
| `npm run server`| Start Express server only            |
| `npm run client`| Start Vite dev server only           |
| `npm run build` | Build React for production           |
| `npm start`     | Run production server                |

---

## License

MIT