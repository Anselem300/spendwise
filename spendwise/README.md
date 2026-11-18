# SpendWise application

SpendWise is a personal finance web app built with Next.js (App Router), React,
TypeScript, Tailwind CSS, Mongoose/MongoDB, and JWT-based authentication.

## Quick start

1. Install Node.js **22** (recommended for the included standalone calculation tests).
2. From this `spendwise/` directory, run `npm ci`.
3. Copy `.env.example` to `.env.local` and replace `MONGODB_URI` and `JWT_SECRET`.
   The JWT secret must be at least 32 characters. Do not commit `.env.local`.
4. Run `npm run dev` and visit http://localhost:3000.
5. Sign up, add income and expenses, and open `/dashboard` to see the chart.

## Checks

```bash
npm run test:insights  # pure finance calculations, Node.js 22
npm run lint           # requires npm ci
npx tsc --noEmit       # requires npm ci
npm run build          # requires npm ci and valid configuration
```

The `/api/health` endpoint additionally checks the live MongoDB connection.
For end-to-end login and transaction testing, provide a working MongoDB
instance and the environment variables above.

## Features

- Register, log in, and log out (HTTP-only cookie, JWT, bcrypt password hashing)
- Create, edit, delete, and view personal income/expense transactions
- Filter transaction history by type, category, and relative date range
- View all-time income, expenses, and balance
- **Week 3:** See an all-time, accessible expense-category breakdown with
  percentage bars and totals. The chart updates when transactions change.

Amounts are currently presented as **NGN (₦)**, carried forward from the
original application. Currency selection/multicurrency support is not yet
implemented; the team should confirm their target currency before release.

See `../WEEK3_CHANGELOG.md` for details of the sprint increment, test results,
and next steps.
