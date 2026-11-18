# Week 3 GitHub Submission — SpendWise

**Commit title:** `feat(dashboard): add Week 3 spending insights and finance tests`

## Commit / pull request description (copy into GitHub)

During Week 3 of our five-week SpendWise project, I extended the existing
personal finance dashboard with an expense-category breakdown. Users can now
see their total spending grouped by category and the percentage that each
category contributes to their overall expenses. The visualisation updates
when existing income and expense records change, supports an empty state,
and uses accessible labelled bars without introducing a new chart package.

I also extracted shared financial calculations into a reusable TypeScript
module, updated the dashboard's income/expense/balance cards to use this
module, and made initial transaction loading more reliable by cancelling
in-flight requests when the dashboard unmounts and requesting fresh data.
I added five automated tests covering the category calculations, empty data,
income exclusion, repeated categories, decimal rounding, and malformed
amounts. Finally, I updated the README to reflect our five-week plan and
included example environment variable settings for local setup.

**Files changed:** dashboard transaction manager, README files, app `.gitignore`,
package scripts. **Files added:** expense chart, finance utility, five unit
tests, `.env.example`, and sprint documentation.

**Verification:** All five new calculation tests pass; the new computation
module passes strict TypeScript checking and updated TSX files pass a syntax
check. Full Next.js lint/build and live MongoDB tests still need to be run on a
machine with npm dependencies installed and database configuration.

## Before submitting to the instructor

1. Extract this ZIP and copy the modified project files into your existing,
   locally cloned team GitHub repository (do **not** replace or erase `.git`).
2. Check `git status` and review the change list with `git diff`.
3. Run `npm ci`, `npm run test:insights`, `npm run lint`, `npx tsc --noEmit`,
   and `npm run build` from the nested `spendwise/` app directory. Investigate
   and fix any failures before merging.
4. From the repository root, use your own Git account to commit and push the
   changes through your team's workflow.
5. Copy the URL of your actual commit from GitHub. Its shape is:
   `https://github.com/Anselem300/spendwise/commit/<YOUR_COMMIT_SHA>`.
   **Do not submit a fabricated or another teammate's commit SHA.**
