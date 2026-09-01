# Shaw Innovations — Medical Device Collaboration Platform

Secure collaboration hub for clinicians, engineers, advisors, and administrators working on medical device innovation.

## Features

- Public marketing site themed from the Shaw Innovations reference design
- Password-protected member areas with role-based section access
- Sonographer Advisors dashboard and 12+ collaboration panels from the project brief
- Centralized Admin panel to view users, profiles, and exact section permissions
- Grant / revoke access at user and section level
- Zoom meeting management (live API when credentials are set; local demo mode otherwise)
- Directory fields for organization, title, headshot URL, and sonographer certifications
- Milestones with CAD / prototype cross-references and meeting minutes

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Auth.js (NextAuth v5) credentials auth with JWT sessions
- Prisma + SQLite (swap `DATABASE_URL` to PostgreSQL for production)
- Zoom Server-to-Server OAuth integration hooks

## Quick start

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@shawinnovations.com` | `ShawDemo2026!` |
| Sonographer Advisor | `advisor@shawinnovations.com` | `ShawDemo2026!` |
| Engineer | `engineer@shawinnovations.com` | `ShawDemo2026!` |

## Environment

Copy `.env.example` to `.env`:

- `DATABASE_URL` — SQLite by default (`file:./dev.db`)
- `AUTH_SECRET` — required for sessions
- `ZOOM_ACCOUNT_ID` / `ZOOM_CLIENT_ID` / `ZOOM_CLIENT_SECRET` — optional Zoom credentials

## Protected panels (seeded)

Sonography Advisors, Advent Health Orlando, Orlando Regional Health, HCA Florida, Sonographers Outside Florida, Shared Design / Prototypes, Engineering Collaborative, University Faculty Partners, Prospective Partners, Clinical Advisors, Ideas Board, IP / Legal, plus 4 reserved blank future panels.

## Project notes

Source requirements live in `docs/Fred-Shae-Doc.docx`. Design reference image is at `public/design-reference.jpg`.
