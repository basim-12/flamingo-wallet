# Flamingo Wallet

Bitcoin Lightning Network wallet — the main entry point for the Flamingo stack.

## Quick Start

```bash
npm install && npm start
```

This will:
1. **Start the backend** — runs `fw up` (installs Docker if needed, auto-creates `env.json`, builds and runs the container)
2. **Start the frontend** — launches a budo dev server with live reload

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start backend + frontend together |
| `npm run dev` | Start frontend only (new wallet UI) |
| `npm run dev-debug` | Start frontend only (legacy dev dashboard) |
| `npm run build` | Build production bundles |
| `npm run node` | Start backend only (Docker) |
| `npm run node-setup` | Initialize network from `scenario.json` |

## Dev Setup

To work on `flamingo-ui` and `flamingo-wallet` in parallel, use `npm link`:

```bash
cd ../flamingo-ui && npm link
cd ../flamingo-wallet && npm link flamingo-ui
```

This makes `flamingo-wallet` use your local `flamingo-ui` instead of the one from GitHub.

## Pages

| File | URL | Description |
|------|-----|-------------|
| `index.html` | `http://localhost:9966` | New wallet UI |
| `debug.html` | (open manually) | Legacy dev dashboard |

## Network Scenarios

Edit `scenario.json` to customize the Lightning Network topology, then run:

```bash
npm run node-setup
```

See [flamingo-node README](https://github.com/playproject-io/flamingo-node#network-scenarios) for the scenario JSON format.

## License

MIT

## Related Repositories

- [flamingo-node](https://github.com/playproject-io/flamingo-node) — Backend: bitcoind, lightningd, WebSocket bridge
- [flamingo-docker](https://github.com/playproject-io/flamingo-docker) — Docker environment for the stack
- [flamingo-wallet](https://github.com/playproject-io/flamingo-wallet) — Main entry point & orchestration
- [flamingo-ui](https://github.com/playproject-io/flamingo-ui) — Reusable UI component library
