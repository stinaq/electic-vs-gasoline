# AGENTS.md

Entry point for AI agents (and humans) working in this repo. Read all of it before writing code.

## Purpose

A small web app that answers one question: **for this trip, is it cheaper to take the
gasoline car or the electric car?** You can also slide the prices and see where one car
overtakes the other.

## Where things are defined

| Document | Answers | Change it when |
|---|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | **How** the code is structured: layers, folders, rules, conventions, testing | the structure or a rule changes |
| [docs/FEATURES.md](docs/FEATURES.md) | **What** the app does: features, inputs, outputs, domain formulas, acceptance criteria | behavior changes |

Keep them separate. Architecture docs never describe specific features, and feature docs never
prescribe structure (they may name the core module a feature lives in).

## Workflow for agents

1. Find the feature in `docs/FEATURES.md`. If it is not there, stop and ask. Do not invent features.
2. Implement it following `docs/ARCHITECTURE.md`. If a rule gets in the way, stop and ask.
   Don't work around it.
3. Pure logic first, with tests. Then the hook. Then dumb components and the wiring in `App.tsx`.
4. If behavior changed, update `docs/FEATURES.md` in the same change. If structure changed,
   update `docs/ARCHITECTURE.md`.
5. Never invent real-world data (car consumption, prices). Ask the project owner.

## Definition of done

1. `npm run lint` passes (including layer rules)
2. `npm run test` passes, and new core logic has tests
3. `npm run build` passes (type check included)
4. No logic was added to `components/` or `App.tsx`
5. Docs updated if behavior or structure changed
