# Project Report: toastmaster-

**Overview**
- **Purpose:** A Next.js (App Router) TypeScript web app for managing clubs/meetings (Toastmaster-style).
- **Key tech:** Next.js, TypeScript, Tailwind CSS, pnpm.

## Quick Facts
- Root package: `package.json`
- Framework config: `next.config.ts`
- TypeScript config: `tsconfig.json`
- Styling: `tailwind.config.js`, `postcss.config.mjs`

## Top-level layout
- `app/` — Next.js App Router (pages and routes)
- `components/` — UI and feature components
- `lib/` — API client, hooks, schemas, stores, utils
- `public/` — static assets

---

## Original starter README

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Frontend vs Backend (what lives where)

- **Frontend (this repo):** UI, pages and client logic live in `app/`, `components/`, and `lib/` (hooks, api client, stores, utils). React components and the Next.js App Router render the interface and call the API.
- **Backend (external):** This project expects an external REST API that implements endpoints such as `/auth/*`, `/meetings/*`, `/clubs/*` used by `lib/api/hooks/*`. There is no backend source code in this repository.

### If you do have a backend in the same project
- Next.js can host API routes under `app/api` or `pages/api`. This repo currently uses an external API by default (see `lib/api/axios.ts`).

## Environment variables (.env)

- Primary variable used by the frontend is `NEXT_PUBLIC_API_URL`.
	- Example: `NEXT_PUBLIC_API_URL=http://localhost:8000/api` or `https://api.example.com`
	- Fallback behavior: if `NEXT_PUBLIC_API_URL` is not defined the client will use `window.location.origin + '/api'` and the server fallback is `http://localhost:8000/api`.

Create a file named `.env.local` in the project root with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Notes:
- Only put public-safe values in `NEXT_PUBLIC_` variables (they're visible in client bundles).
- Keep sensitive backend-only secrets (DB URLs, JWT secrets) on the backend; do not expose them with `NEXT_PUBLIC_`.

## How to run

1. Install dependencies:

```bash
pnpm install
# or
npm install
```

2. Start dev server (hot reload):

```bash
pnpm dev
# or
npm run dev
```

3. Build & run production server:

```bash
pnpm build
pnpm start
# or
npm run build
npm run start
```

4. Make sure `.env.local` exists before running so `NEXT_PUBLIC_API_URL` is available.

## Authentication / Tokens

- Auth tokens from the backend are stored in the client `useAuthStore` and attached as `Authorization: Bearer <token>` by `lib/api/axios.ts`.
- The frontend expects endpoints like `/auth/login`, `/auth/signup`, and other REST endpoints under `/meetings` and `/clubs`.

## Next steps I can help with
- Generate a `.env.example` file.
- Add a CONTRIBUTING/developer README with debug tips.
- Create a visual tree of the repository.

---
Generated on: December 24, 2025
