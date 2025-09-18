# FocusFlow

A modern, minimalist study timer and session tracker built with the MERN stack (MongoDB, Express, React, Node.js).

## Monorepo layout

- `client/` – React app (Vite)
- `server/` – Node/Express API with MongoDB (Mongoose)

## Quick start

1. Install dependencies for both apps
2. Create `server/.env` with `MONGODB_URI` and optional `PORT` (defaults to 5000)
3. Start API, then start the client

### Environment

Create `server/.env`:

```
MONGODB_URI=mongodb://localhost:27017/focusflow
PORT=5000
```

### Scripts

From the repository root, you can run these once the sub-projects are installed:

- Server: `cd server && npm run dev`
- Client: `cd client && npm run dev`

The client will run at http://localhost:5173 and proxy API calls to http://localhost:5000 (once configured).

## Features (planned)

- Stopwatch and Pomodoro modes
- Minimal dark UI with Inter font and accent color
- Session logging to MongoDB
- Study history list (newest first)
