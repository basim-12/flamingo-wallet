# Flamingo Wallet

Orchestration layer for **flamingo-node** (backend APIs) and **flamingo-ui** (frontend).
Everything runs via Docker — no local Bitcoin/Lightning installation needed.

## Prerequisites

- Node.js
- Docker & Docker Compose
- All repos cloned as siblings:
  ```
  Bitcoin-Lightning/
  ├── flamingo-node/
  ├── flamingo-ui/
  ├── flamingo-wallet/     # you are here
  └── flamingo-docker/
  ```

## Running

From `flamingo-wallet/`:

| Command | What it does |
|---------|-------------|
| `npm run dev-legacy` | Docker: backend + **legacy UI** (monolith) |
| `npm run dev` | Docker: backend + **new UI** (component system) |
| `npm run init-network` | Fund nodes & open channels (run after services are up) |

Or directly from `flamingo-docker/`:

```bash
docker compose up --build                    # legacy UI (default)
UI_MODE=start docker compose up --build      # new UI
```

## Ports

| Port | Service |
|------|---------|
| 9966 | Frontend (budo dev server) |
| 8080 | Backend WebSocket |
