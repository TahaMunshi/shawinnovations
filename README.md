# Shaw Innovations — public design preview

A Vite, React 19, and TypeScript single-page application exploring a future
medical-device collaboration experience.

This repository has no backend, API, database, server actions, secrets, or
environment variables. The login is a browser-only staging gate: any non-empty
username and password succeeds, the username is held in `sessionStorage` for
the tab session, and the password is never stored. It is not authorization.

## Local development

Requires Node.js 20.19 or newer (below Node 25).

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

Vercel uses `vercel.json` to rewrite all paths to `index.html`, allowing direct
SPA deep links such as `/admin/meetings`.
