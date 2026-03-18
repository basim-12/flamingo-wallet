# Flamingo Wallet

Bitcoin Lightning Network wallet — the main entry point for the Flamingo stack.

## Quick Start

```bash
npm install && npm start
```

This will:
1. **Start the backend** — installs Docker if needed, builds and runs the Flamingo node container
2. **Start the frontend** — launches a budo dev server with live reload

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start backend + frontend together |
| `npm run dev` | Start frontend only (new wallet UI) |
| `npm run dev-legacy` | Start frontend only (legacy dev dashboard) |
| `npm run build` | Build production bundles |
| `npm run node` | Start backend only (Docker) |
| `npm run run` | Initialize network from `scenario.json` |

## Architecture

```
flamingo-wallet/          ← You are here (app entry point)
  ├── flamingo-node/      ← Backend (installed via npm)
  ├── flamingo-ui/        ← UI components (installed via npm)
  └── flamingo-docker/    ← Docker config (pulled by flamingo-node)
```

## Pages

| File | URL | Description |
|------|-----|-------------|
| `index.html` | `http://localhost:9966` | New wallet UI |
| `debug.html` | (open manually) | Legacy dev dashboard |

## Network Scenarios

Edit `scenario.json` to customize the Lightning Network topology, then run:

```bash
npm run run
```

See [flamingo-node README](https://github.com/basim-12/flamingo-node#network-scenarios) for the scenario JSON format.

## License

MIT
