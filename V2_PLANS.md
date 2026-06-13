---
  Codebase Audit — Fog of War

  What You Have

  Architecture: React + Phaser 3 (dungeon crawler, top-down) → Go gRPC server → Solana devnet payments. Smart contracts (Solidity, FogSession + FogVault) sit in /blockchain/ configured for Arbitrum Sepolia in
  hardhat.config.ts but are not deployed and not connected to anything.

  ---
  Critical Issues (fix these first)

  1. Arbitrum contracts exist but are completely disconnected
  The entire frontend is Solana-only (@solana/wallet-adapter, Connection, SystemProgram.transfer). Your Solidity contracts have never been deployed. The landing page footer literally says "Powered by Solana". This
  is the #1 thing to fix for the Arbitrum grant.

  2. endSession has a broken winner condition
  require(block.timestamp >= s.startTime + s.duration, "Session still running");
  This means even if one player eliminates all others, the game can't end early — nobody gets paid until the timer expires. In the Go server, the game probably calls endSession before the contract allows it.

  3. No draw/disconnect handler — funds get stuck
  If all players disconnect mid-session, the ETH in FogVault is permanently locked. No refund path, no timeout release, no drain. Judges will ask about this.

  4. House fee hardcoded at 0.5 ETH creation + 1 ETH entry
  These are enormous for a testnet demo. They're constant so you can't change them without a new deploy. Should be constructor params.

  5. Frontend has no Arbitrum wallet support
  No wagmi, no viem, no MetaMask integration. You'd need to add EVM wallet connection to actually use the contracts.

  ---
  Game Edge Cases

  6. Camera lerp from wrong position on first spawn
  The _cameraSnapped logic partially handles this but it's a band-aid — if myPos arrives before the scene's first update() frame, the camera lerps from SPAWN_X/Y to the real position visibly.

  7. No walkable-tile validation on spawn in Go server
  The client does BFS (nearestWalkable) but if the server places a player inside a wall, the client is correcting server-side logic.

  8. Fog stays fully revealed after Blood Hunt ends
  Once Blood Hunt reveals the leader, there's no cleanup path visible in the store that restores proper fog on the leader's position.

  9. endSession on the contract is onlyOwner
  Only the contract deployer can declare a winner. If your Go server isn't the same wallet, it can't call this function. Centralization risk judges will flag.

  10. Results screen doesn't show on-chain tx
  payoutTx exists in the store but only used for Solana. No on-chain proof for Arbitrum.

  ---
  On the Platformer Idea

  I'd strongly advise against it before July 10. Here's why:

  The current game's fog-of-war + heatmap mechanic is genuinely unique and is your core pitch. A platformer changes the entire spatial logic — gravity, jump physics, platform tile collision — and would break your
  multiplayer sync (Go server uses a 2D grid, not a physics sim). You'd be rebuilding the game engine 4 weeks before the deadline.

  What you could do instead: add vertical dungeon levels (floors) within the existing top-down system. Player finds a staircase → loads a new procedurally generated floor. Keeps the mechanic intact, adds
  progression, and is ~2 days of work vs 2-3 weeks for a true platformer.

  ---
  Deployment

  Your render.yaml has USE_MOCK_SERVICES: "true" and SOLANA_RPC_URL — Arbitrum isn't configured at all. The client presumably deploys to Vercel but there's no vercel.json. The ALLOWED_ORIGINS still points to a
  placeholder fog-of-war.vercel.app.

  ---
  Priority Order for Arbitrum Grant (deadline July 10)
  
  ┌──────────┬──────────────────────────────────────────────────────────────────────┬───────────┐
  │ Priority │                                 Task                                 │ Time est. │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🔴 P0    │ Deploy contracts to Arbitrum Sepolia                                 │ 2h        │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🔴 P0    │ Fix endSession to allow early winner + add refund/timeout path       │ 3h        │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🔴 P0    │ Add wagmi/MetaMask support to frontend, wire join/create to contract │ 1-2d      │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🔴 P0    │ Make fees constructor params, redeploy                               │ 1h        │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🟠 P1    │ Update landing page copy to say Arbitrum, update footer              │ 30m       │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🟠 P1    │ Wire endSession call from Go server (needs server wallet key)        │ 4h        │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🟠 P1    │ Show on-chain tx link in Results screen                              │ 2h        │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🟡 P2    │ Camera snap fix (properly, not band-aid)                             │ 1h        │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🟡 P2    │ Dungeon levels / floors (staircase mechanic)                         │ 2d        │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🟢 P3    │ Blood Hunt fog cleanup                                               │ 1h        │
  ├──────────┼──────────────────────────────────────────────────────────────────────┼───────────┤
  │ 🟢 P3    │ Vercel deploy config + update render.yaml for Arbitrum               │ 1h        │
  └──────────┴──────────────────────────────────────────────────────────────────────┴───────────┘

  ---
  The honest answer on the platformer: save it for V2. Your current dungeon + fog mechanic is more original than most platformers. Polish what's there, get Arbitrum wired, fix the contract bugs, and you'll have a
  much stronger application than if you half-finish a game engine rewrite.
  
  Want me to start on the Arbitrum integration first — deploy the contracts, fix the endSession issue, and add wagmi to the frontend?