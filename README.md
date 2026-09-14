# Shaw Innovations — public design preview

A Vite, React 19, and TypeScript single-page application exploring a
Discord-style medical-device collaboration experience. Advisors and engineers
have permanent role communities, and any member can create a cross-functional
project team from people in the platform directory.

This repository has no backend, API, database, server actions, secrets, or
environment variables. The login offers Admin, Advisor, and Engineer demo
personas stored in `sessionStorage`. Messages, created teams, memberships, and
archive state are stored in `localStorage` so the walkthrough survives a
refresh. These controls simulate product behavior; they are not authentication,
authorization, secure storage, or real-time multi-user chat.

## Preview flows

- Enter as an Advisor or Engineer to see the appropriate permanent community.
- Move between focused text channels and add locally persisted demo messages.
- Search the platform directory and create a mixed-role project team.
- Team creators manage their roster; Admin can inspect and manage all teams.
- Use “Reset all local demo data” in Admin oversight to restore seeded content.

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
SPA deep links such as `/app/community/advisors/channel/advisor-general` and
`/admin/teams`.
