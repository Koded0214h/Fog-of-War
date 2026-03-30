# ⬡ Fog of War

> **High-stakes Extraction Royale built on Solana & Arbitrum.**  
> Pay to enter. Hunt for treasure. Survive the Blood Hunt. Winner takes all.

---

## What is Fog of War?

Fog of War is a session-based, real-time extraction game where players pay a fixed entry fee in SOL to join a communal prize pool. Each session drops multiple operators onto a dynamic heatmap grid. You explore, collect treasure, fight enemies, and try to be the last one standing — or the richest when the clock runs out.

The map is a living **GitHub-style commit heatmap**. Every tile tells a story: fresh footprints glow orange, cold trails fade to blue, combat zones blaze red. You only see the world within your fog radius. Everything else is darkness — until the final 5 minutes.

---

## How to Play

### Movement
| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |

### Objective
- Collect **treasure chests** scattered across the map (cyan glow)
- Eliminate other operators to remove competition
- Survive until the session ends with the highest treasure count

### Winning
The player with the most treasures when time expires claims the prize pool. If you eliminate all other players, you win instantly.

---

## The Heatmap

The grid is the core mechanic. Color is information.

| Color | Meaning |
|-------|---------|
| ⬛ Dark (`#0a0d14`) | Unexplored fog — nobody has been here |
| 🟦 Cold blue | Explored, no recent activity |
| 🟨 Warm yellow | Footprint trail — someone passed through 3–6s ago |
| 🟧 Hot orange | Fresh trail — someone was here under 2s ago |
| 🟥 Red / pulsing | Active combat on this tile |
| 💎 Cyan glow | Loot chest — uncollected treasure |
| 🏆 Gold pulse | Blood Hunt — the leading player is revealed here |

Footprints decay over time. You can read direction, speed, and convergence points from the heat signature alone — making the map itself a tactical layer.

---

## Blood Hunt Mode

**5 minutes before the session ends**, Blood Hunt activates.

- The leading player (most treasures) is **revealed to the entire map** — their position pulses gold through all fog
- Their trail stays bright for 10 seconds, showing exact movement
- A leaderboard slides in showing the top 3 operators and treasure counts
- The map border bleeds red — all players receive a movement speed bonus
- The storm ring begins closing inward every 60 seconds

The leader knows they're marked. The hunter becomes the hunted.

---

## Game Sessions

| Players | Grid Size | Notes |
|---------|-----------|-------|
| 2–10    | 32 × 32   | ~100 cells per player |
| 11–30   | 64 × 64   | ~136 cells per player |
| 31–80   | 96 × 96   | ~115 cells per player |
| 81–200  | 128 × 128 | ~82 cells per player |

Grid size is locked at session creation based on the max player count. Sessions have a fixed duration. The session creator pays a creation fee; players pay an entry fee. All fees flow into the prize pool.

---

## Economy

| Action | Cost | Pool Split |
|--------|------|------------|
| Join session | 1 SOL | 90% prize pool / 10% house |
| Buy weapon | 0.1–1.0 SOL | 70% prize pool / 30% house |
| Create session | 0.5 SOL | Platform fee |
| Win session | — | 90% of total pool |

Weapons are purchased mid-game and take effect immediately. Higher-tier weapons deal more damage per combat tick.

---

## Weapons

| Weapon | Cost | Damage | Notes |
|--------|------|--------|-------|
| KNIFE  | 0.1 SOL | 5 / tick | Default melee |
| PISTOL | 0.2 SOL | 8 / tick | Mid-range |
| RIFLE  | 0.5 SOL | 12 / tick | High damage |
| SNIPER | 1.0 SOL | 20 / tick | Highest damage |

Combat triggers automatically when two players occupy adjacent tiles. Both take damage simultaneously.

---

## Architecture

Fog of War is built in two phases.

### Phase 1 — Web Game
```
Client (React + Canvas)
        │
   Load Balancer (NGINX / HTTP2)
        ├── REST API (Fastify)        ← sessions, auth, shop, leaderboards
        └── gRPC Game Server (Go)    ← authoritative tick loop, movement, combat
                │
            Redis                    ← live state cache, pub/sub
                │
            PostgreSQL               ← players, sessions, match history
```

### Phase 2 — dApp Layer
```
Wallet Auth (Phantom / MetaMask)
        │
Solana Program (Anchor / Rust)       ← entry fee vault, prize pool escrow, payouts
Arbitrum Contract (Solidity)         ← ETH/USDC bridge, weapon NFT marketplace
        │
Wormhole / LayerZero                 ← cross-chain value bridging
```

### Tech Stack

**Frontend**
- React + Vite
- Canvas API (60fps grid renderer)
- Zustand (game state)
- WebSocket / gRPC-Web (real-time sync)
- TailwindCSS (UI chrome)

**Backend**
- Go — gRPC game server (authoritative tick at 10Hz)
- Fastify (Node.js) — REST API
- Redis — session state, pub/sub broadcast
- PostgreSQL — persistent storage
- NGINX — load balancer with HTTP/2 passthrough

**Web3**
- Anchor (Rust) — Solana smart contracts
- Solidity — Arbitrum contracts
- Phantom + MetaMask — wallet authentication

---

## Development Roadmap

- [x] **Phase 1A** — Grid renderer with heatmap, fog of war, footprint decay
- [ ] **Phase 1B** — gRPC game server (movement, combat, session lifecycle)
- [ ] **Phase 1C** — REST API + load balancer wiring
- [ ] **Phase 1D** — Full playable web game (no crypto)
- [ ] **Phase 2A** — Wallet auth + Solana devnet entry fees
- [ ] **Phase 2B** — Arbitrum bridge + weapon economy
- [ ] **Phase 2C** — Mainnet launch

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/Koded0214h/fog-of-war.git
cd fog-of-war

# Install frontend deps
cd client
npm install
npm run dev

# Run game server (Go)
cd ../server
go mod tidy
go run main.go

# Start Redis (required)
redis-server

# Start REST API
cd ../api
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`  
REST API on `http://localhost:3000`  
gRPC game server on `localhost:50051`

---

## Environment Variables

```env
# REST API
DATABASE_URL=postgresql://user:pass@localhost:5432/fogofwar
REDIS_URL=redis://localhost:6379
GRPC_SERVER=localhost:50051
JWT_SECRET=your_secret_here

# Phase 2 (Web3)
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=your_program_id
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
ARBITRUM_CONTRACT=your_contract_address
```

---

## Contributing

This project is in active development. If you want to contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes
4. Open a PR with a clear description

---

## License

MIT © [Koded](https://github.com/Koded0214h)

---

<div align="center">
  <sub>Built by <a href="https://x.com/coder0214h">@coder0214h</a> · Powered by Solana & Arbitrum</sub>
</div>