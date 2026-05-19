# Doctor Project

This MERN project is split into separate frontend and backend apps for clean deployment.

## Folders

- `frontend/` - React + Vite app
- `backend/` - Node + Express API

## Local Setup

```bash
npm run install:all
```

Create local environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Set `MONGODB_URI` in `backend/.env`.

```bash
npm run dev:backend
npm run dev:frontend
```

## Environment Variables

- Frontend: `VITE_API_URL` must point to the backend API base, for example `https://your-api.onrender.com/api`.
- Backend: `MONGODB_URI`, `PORT`, and `CLIENT_ORIGIN` are used by the API. Set `CLIENT_ORIGIN` to your Vercel frontend URL in production.

## Deployment

Deploy `frontend/` to Vercel. Build command: `npm run build`; output directory: `dist`.

Deploy `backend/` to Render or Railway. Start command: `npm start`; health check: `/api/health`.
