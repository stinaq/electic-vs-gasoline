# electic-vs-gasoline

Web app that tells you which car is cheaper to drive for a given trip: a gasoline car or an
electric car, based on the current gasoline and electricity prices.

Enter the trip distance (optionally round trip) and slide the gasoline and electricity prices.
The app shows live which car is cheaper and at what price the other one would take over.

Built with Vite, React, TypeScript and SCSS modules.

## Getting started

```sh
npm install
npm run dev     # start the dev server
npm run test    # unit tests (Vitest)
npm run lint    # ESLint, including the layer rules
npm run build   # type check + production build
```

## Deploy

Hosted on Netlify, which deploys every push to `main` automatically. Build settings live in
[netlify.toml](netlify.toml): lint, test and build, then publish `dist/`. Pull requests get a
deploy preview.

## Docs

For contributors and AI agents:

- [AGENTS.md](AGENTS.md): entry point and workflow
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the code is structured
- [docs/FEATURES.md](docs/FEATURES.md): what the app does
- [docs/DESIGN.md](docs/DESIGN.md): how it looks
