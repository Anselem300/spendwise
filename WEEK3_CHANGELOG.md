# SpendWise — Week 3 Increment (5-week project)

## Objective and scope

Extend the existing SpendWise personal finance dashboard with one focused,
user-visible feature: **expenses by category**. Preserve the project's existing
Next.js, React, TypeScript, Tailwind CSS, and MongoDB/Mongoose implementation.
No additional production packages or database migrations are required.

## Features added

### Expenses by Category chart

- Added `src/components/dashboard/ExpenseBreakdown.tsx`, a responsive,
  accessible horizontal bar chart showing how recorded expenses are spread
  across categories.
- Groups transactions by expense category, adds amounts within each group,
  sorts categories from highest to lowest spend, and displays each category's
  percentage of total spending.
- Shows the grand total of expenses and clear loading/empty states.
- Shows **all-time** spending (matching existing dashboard cards); transaction
  history filters do not alter the dashboard-level chart.
- Updates after the existing add, edit, and delete workflows update the
  transaction list. No new database endpoint or external chart library.

### Shared, tested financial computations

- Added `src/lib/transactionInsights.ts` with `getFinancialSummary()` and
  `getExpenseBreakdown()`; both operate only on authenticated transaction data
  already loaded by the dashboard.
- Calculations sum currency in integer cents to reduce floating-point drift.
- Existing income, expense and balance cards now use the shared computation
  rather than maintaining a separate calculation from the chart.
- Defensively ignores non-finite/negative values in the insight calculations;
  the transaction API remains responsible for input validation.

## Improvements to existing code

- Updated `src/components/dashboard/TransactionManager.tsx` to render the chart
  below the financial summary and use the shared calculations.
- Replaced the ineffective unmount flag in its initial data-loading effect
  with an `AbortController`, so cleanup aborts an outstanding initial fetch.
- Used a stable `useCallback` loader and `cache: 'no-store'` for transaction
  requests to reduce stale client responses.
- Refreshed project README documentation for a **five-week**, rather than
  four-week, schedule; added a setup guide, `.env.example` placeholders,
  and a test command. No real secrets are included.
- Added `tests/transactionInsights.test.mjs` and an npm script named
  `test:insights` (no new npm dependencies).

## Verification performed in this environment

| Check | Result | Scope |
|---|---|---|
| ZIP inspection | PASS | Original archive opened and extracted safely; project files inspected |
| Finance unit tests | **PASS: 5/5** | Empty input, income excluded, category grouping/sorting, decimal cents, invalid amounts |
| Strict TypeScript check | **PASS** | New standalone `transactionInsights.ts` module |
| TypeScript/JSX syntax check | **PASS** | Modified component files and finance module |
| Full ESLint check | NOT RUN SUCCESSFULLY | `eslint` unavailable after npm dependencies could not be downloaded |
| Full project typecheck/build | NOT VERIFIED | Required local node modules unavailable; package registry resolution failed |
| Live MongoDB / browser E2E tests | NOT VERIFIED | No database credentials or browser runtime supplied |

**Important:** Passing the calculations and syntax checks does not mean a full
Next.js build, database integration, or browser flow has been verified. Run
`npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run test:insights`, and
`npm run build` on a connected development machine before pushing or deploying.

## Existing functionality retained

- Account registration, login and logout with existing authentication code.
- MongoDB transaction storage and current create/view/edit/delete API routes.
- Dashboard totals and transaction history filters for type, category and date.
- Existing responsive pages and styling.

## Known limitations / next sprint

- Original app formats amounts as Nigerian naira (`NGN`, ₦). The project brief
  did not specify a target currency; confirm the team's currency requirement
  before deployment. This increment does not add multi-currency conversion.
- Chart currently gives an **all-time** overview; the table filters apply only
  to transaction history, which is labelled accordingly.
- Next steps for Weeks 4–5: complete app/database integration tests,
  validate input and ownership edge cases, refine UX/accessibility, and deploy
  to Vercel with securely configured environment variables.

## Recommended GitHub commit subject

`feat(dashboard): add Week 3 spending insights and finance tests`

Use your own Git account and push this change through your normal team branch
workflow. Your sprint submission should link to the **actual commit SHA** on
GitHub, not merely to the repository URL. The ZIP does not create or push a
GitHub commit.
