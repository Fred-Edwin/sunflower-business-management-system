# Sunflower Events — Business Management System

Business management system for an events rental business in Nyeri, Kenya.
See [`CLAUDE.md`](./CLAUDE.md) for architecture, conventions, and the current
build phase.

## Getting started

```bash
pnpm install
docker compose up -d db
cp .env.example .env   # fill in DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL
pnpm db:reset
pnpm dev
```

Sign in at [http://localhost:3000/sign-in](http://localhost:3000/sign-in)
with the seeded account: `susan@sunflowerevents.example` /
`sunflower-dev-password`.

## Commands

```bash
pnpm dev           # Turbopack dev server
pnpm verify        # typecheck + lint + test — the gate; must pass
pnpm test          # unit + repository tests
pnpm test:watch    # inner loop
pnpm db:reset      # drop, migrate, seed (under 5s)
pnpm user:add      # create an additional user + membership, operator-only
```

Full command list in `CLAUDE.md`.
