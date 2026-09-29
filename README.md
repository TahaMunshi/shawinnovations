# Shaw Solutions — public design preview

A Vite, React 19, and TypeScript single-page application exploring a
Slack-style medical-device collaboration experience built around six community
tabs (user types). Applicants e-sign an NDA during onboarding; an administrator
approves access, can also add people who signed in person, and can filter users
by tab.

This repository has no backend, API, database, server actions, secrets, or
environment variables. Demo personas live in `sessionStorage`. Messages,
onboarding/NDA requests, memberships, admin DMs, and portal Zoom meetings are
stored in `localStorage`. These controls simulate product behavior; they are
not authentication, authorization, secure storage, email delivery, real Zoom
integration, or multi-user chat.

## Preview flows

- Complete onboarding with canvas e-sign NDA, then enter as Admin to approve.
- Admin can email-invite applicants or add members directly (in-person NDA).
- Members talk only inside their assigned community tab—no peer DMs.
- Admin can DM any individual and filter the user directory by community tab.
- Admin can suspend or remove profiles, and start a Zoom meeting per community.
- Use “Reset all local demo data” in Admin to restore seeded content.

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
