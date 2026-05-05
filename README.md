# CCTV Storage Calculator

Full-stack app: **Express.js** backend + **React** (Vite) frontend.

## Project Structure

```
cctv-calculator/
├── server/
│   ├── index.js              # Express entry point
│   └── routes/
│       └── calculator.js     # POST /api/calculator/calculate
├── client/
│   ├── index.html
│   ├── vite.config.js        # Proxies /api → localhost:3001
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── hooks/
│       │   └── useCalculator.js
│       └── components/
│           ├── InputPanel.jsx
│           └── ResultPanel.jsx
├── package.json              # Root scripts (concurrently)
└── .env.example
```

## Getting Started

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Run both server + client in dev mode
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API

### POST /api/calculator/calculate

**Request body:**
```json
{
  "cameras": 4,
  "days": 30,
  "resolution": 2,
  "codec": "h265",
  "fps": 15,
  "hoursPerDay": 24,
  "motionFactor": 50,
  "overhead": 20
}
```

**Response:**
```json
{
  "bitrateMbps": 0.933,
  "perCamPerDayGB": 10.08,
  "allCamsPerDayGB": 40.32,
  "rawTotalGB": 1209.6,
  "totalGB": 1451.52,
  "hddOptions": [...],
  "recommended": { "sizeGB": 2000, "count": 1 }
}
```

## Production Build

```bash
npm run build   # builds React into client/dist/
npm start       # serves everything from Express
```