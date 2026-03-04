# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui

**Single-page app** — `app/page.tsx` is the only route. It renders a `<Tabs>` layout with six tabs: Design Requests, Marketing Assets, Gift Cards, Store Hours Change, Price Change, and Evergreen Order Form.

### Data Flow

- **Client state** is persisted in `localStorage` via `lib/store.ts` (CRUD helpers for `DesignRequest`, `StoreHoursChange`, `PriceChange`, `LsmRequest`).
- **Form submissions** POST to Next.js API routes (`app/api/*/route.ts`), which forward the payload to Microsoft Power Automate webhook URLs stored in environment variables.
- **Types** are defined in `lib/types.ts`.

### API Routes → Power Automate

| Route | Env Var |
|---|---|
| `/api/design-requests` | `POWER_AUTOMATE_DESIGN_REQUEST_URL` |
| `/api/price-changes` | `POWER_AUTOMATE_PRICE_CHANGE_URL` |
| `/api/store-hours-changes` | `POWER_AUTOMATE_STORE_HOURS_URL` |
| `/api/lsm-requests` | `POWER_AUTOMATE_LSM_REQUEST_URL` |

The Evergreen Order Form tab embeds a JotForm via `<iframe>` using `NEXT_PUBLIC_JOTFORM_URL`.

### Component Structure

- `components/header.tsx` — top nav bar with logo, store info, and Sign Out button
- `components/design-requests.tsx` — table view with modal for submitting/viewing design requests
- `components/store-hours-changes.tsx` / `components/price-changes.tsx` — similar table+modal pattern
- `components/*-form-modal.tsx` — form dialogs for each request type
- `components/*-details-modal.tsx` — read-only detail views
- `components/ui/` — shadcn/ui primitives (Button, Dialog, Input, Table, Tabs, etc.)

### Environment Variables

Create a `.env.local` file with:
```
POWER_AUTOMATE_DESIGN_REQUEST_URL=
POWER_AUTOMATE_PRICE_CHANGE_URL=
POWER_AUTOMATE_STORE_HOURS_URL=
POWER_AUTOMATE_LSM_REQUEST_URL=
NEXT_PUBLIC_JOTFORM_URL=
```
