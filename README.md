# Shaw Innovations — public design preview

A Vite, React 19, and TypeScript single-page application exploring a
Discord-style medical-device collaboration experience built around six fixed,
private groups. New users submit onboarding requests, and an administrator
approves each member and controls group access.

This repository has no backend, API, database, server actions, secrets, or
environment variables. The login offers Admin, Advisor, and Engineer demo
personas stored in `sessionStorage`. Messages, onboarding requests, group
memberships, direct messages, and dummy group calls are stored in `localStorage`
so the walkthrough survives a refresh. These controls simulate product
behavior; they are not authentication, authorization, secure storage, email
delivery, Zoom integration, or real-time multi-user chat.

## Preview flows

- Submit the onboarding form, then enter as Admin to approve and assign access.
- Enter as an approved member to see only the group or groups assigned by Admin.
- Admin remains in all six groups and can add or remove member access.
- Admin can prepare invitations in the local email app and direct-message users.
- Admin can start a dummy call inside a group; assigned members can join there.
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
SPA deep links such as `/app/group/sonography-advisors`, `/app/direct/advisor-1`,
and `/admin`.
