# Doctor Tracker

A responsive care workspace built with Next.js 16, TypeScript, Tailwind, shadcn/ui and TanStack Query. The separate Express backend in `../backend` supplies cookie-authenticated doctor/patient records and analytics.

## Run locally

Install the frontend dependencies:

```sh
npm install
```

Create `.env` from `.env.example` if needed, and configure the existing API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the backend using its existing setup, then run:

```sh
npm run dev
```

Open http://localhost:3000 and sign in with your backend administrator account. Account creation is managed by the backend; this frontend does not seed users or change backend configuration.

## Pages

- `/`: summary cards, registration timeline, patient load by doctor, condition distribution.
- `/doctors`: doctor directory, URL filters, pagination and create/edit/delete.
- `/doctors/[id]`: doctor profile and assigned patients.
- `/patients`: patient directory, create/edit/delete and doctor reassignment.
- `/login`: responsive sign-in page using the existing auth flow.

## Checks and production

```sh
npx tsc --noEmit
npm run lint
npm run build
npm run start
```

The application reuses Lexend/Raleway through `next/font`, the existing query/theme providers, cookie auth, route proxy and session recovery. All newly added server data requests go through API functions and TanStack Query hooks/options. List filters live in the URL; form validation uses Zod with React Hook Form.

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for phase-wise files, packages, assumptions, verification and the live API manual checklist.
