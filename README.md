# Ledger — Budget Tracker Frontend

A minimalist React frontend for the Personalized Budget Tracker backend. Built
with Vite + React + React Router, plain CSS (no UI framework), and Recharts
for the trend chart.

## Setup

```bash
cd budget-tracker-frontend
npm install
cp .env.example .env
# edit .env if your backend isn't at http://127.0.0.1:8000/api/v1
npm run dev
```

Opens at http://localhost:5173. Make sure the backend is running first
(`uvicorn app.main:app --reload --port 8000` from the backend project).

## What's here

```
src/
├── api/client.js          fetch wrapper — attaches JWT, throws ApiError with backend's detail message
├── context/AuthContext.jsx login/register/logout, persists token in localStorage
├── pages/
│   ├── AuthPage.jsx        sign in / create account toggle
│   ├── DashboardPage.jsx   savings rate, bucket allocation bars, 6-month trend, insight card
│   ├── TransactionsPage.jsx month-scoped list + add/edit/delete
│   └── SettingsPage.jsx    manage buckets (create + inline target % edit) and categories
├── components/             BucketBar, TrendChart, TransactionForm, BucketForm, CategoryForm, InsightCard, NavBar
└── utils/format.js         money/percent/date formatting
```

## Notes

- Auth: register creates the account then immediately logs in (matches the
  backend's local JWT auth from `/auth/register` + `/auth/login`).
- The transactions list defaults to whichever month is selected on the page
  (calendar month, matching the backend's `?from=&to=` date-range contract).
- The dashboard always shows the last 6 months of trend data regardless of
  the selected month, per `/analytics/trend?months=6`.
- "Generate insight" is a manual button rather than automatic, since the
  backend caches one insight per user per month — no reason to call it
  automatically on every dashboard load.
- No global state library or data-fetching library (no Redux/React Query) —
  kept intentionally minimal with plain `useState`/`useEffect` per page.

## Build for production

```bash
npm run build
```

Outputs static files to `dist/` — serve with any static host (the FastAPI
backend can also serve it directly if you want a single deployable unit,
though that's not wired up here since the LLD specifies Vercel for the
frontend).
