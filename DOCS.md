# Fog of War: Backend User Flow & Integration Documentation

## 1. Architecture Overview
The backend is a high-performance Go server designed for real-time multiplayer interaction, utilizing **gRPC** for low-latency communication and **gRPC-Web** for frontend compatibility.

- **Communication**: gRPC (Protobuf) for state streaming and actions.
- **Engine**: A 10Hz authoritative game engine (`internal/engine`).
- **Persistence**: GORM with PostgreSQL for user and session data.
- **Web3**: Arbitrum (Session management), Solana (Payouts), and Arcium (Confidential loot verification).

---

## 2. Detailed User Flows

### A. Authentication Flow (Solana-based)
Users do not use passwords; they authenticate via their Solana wallet.
1.  **Frontend**: Requests the user to sign a "Login" message using their Solana wallet.
2.  **Frontend**: Calls `AuthService.Login` with the `PublicKey`, `Signature`, and `Message`.
3.  **Backend (`api.AuthServer`)**:
    - Verifies the signature against the public key.
    - Retrieves or creates a `User` in the database.
    - Generates a **JWT Access Token** containing the `PlayerID`.
4.  **Result**: Frontend stores the JWT and uses it in the gRPC metadata for subsequent calls.

### B. Game Creation & Joining (On-Chain)
This flow synchronizes the server engine with the Arbitrum smart contract.
1.  **Creator**: Triggers a game creation. The backend `GameManager` calls `ArbitrumService.CreateSession`.
    - *Blockchain*: A `createSession` transaction is sent to Arbitrum (0.5 ETH fee).
2.  **Player**: Joins a specific `GameId`.
    - **Backend (`GameServer.Connect`)**:
        - Validates the JWT.
        - Calls `ArbitrumService.JoinSession` (Player pays 1.0 ETH entry fee).
        - Adds the player to the `GameEngine` state.
3.  **Stream Initialization**: The `Connect` RPC opens a persistent server-streaming channel.

### C. Active Gameplay Loop
Once the engine starts, it runs at **10 Ticks Per Second (10Hz)**.
1.  **Movement**: 
    - Frontend calls `GameService.Move(target_x, target_y)`.
    - Backend updates the player's `TargetX/Y`. The engine interpolates the position based on `Speed` during each tick.
2.  **Authoritative State**: Every 100ms, the `GameEngine` broadcasts a `GameStateUpdate` to all connected clients via the `Connect` stream.
3.  **Fog of War / Heatmap**: The engine maintains a `Grid` where player movement leaves "Heat" (footprints) that decays over time, which the frontend uses to render the map.

### D. Confidential Loot Collection (Arcium)
Loot values and precise positions are protected by Arcium.
1.  **Player**: Moves near a loot item and calls `CollectLoot(LootId)`.
2.  **Backend (`engine.CollectLoot`)**:
    - Queries **Arcium** to verify if the player's current (confidential) position matches the loot's (encrypted) position.
    - If verified, Arcium provides an updated **Encrypted Balance**.
3.  **Result**: The player receives a `Success` response and their new encrypted balance.

### E. Game Conclusion & Payout
1.  **Engine**: Detects the end condition (time limit or last player standing).
2.  **GameManager**: Calls `ArbitrumService.EndSession(winner_address)`.
3.  **Blockchain**: The smart contract releases the prize pool to the winner on Arbitrum, while the server may trigger secondary Solana-based rewards via `SolanaService.SendPayout`.

---

## 3. Frontend Integration Guide

### Connectivity (gRPC-Web)
Since the browser cannot speak raw gRPC, the frontend must use the `@improbable-eng/grpc-web` library or the official `grpc-web` plugin to talk to the backend on port `8080`.

```javascript
// Example: Connecting to the Game Stream
const request = new ConnectRequest();
request.setGameId("uuid-string");

const client = new GameServiceClient("http://localhost:8080");
const stream = client.connect(request, { "authorization": "Bearer <JWT>" });

stream.on("data", (update) => {
  // Update React/Vue state with GameStateUpdate
  const players = update.getPlayersList();
});
```

### State Management Strategy
1.  **Interpolation**: Do not wait for the 100ms update to move the player locally. Move the player's sprite immediately upon input and "snap" to the server's authoritative position when the `GameStateUpdate` arrives to keep movement feeling fluid.
2.  **JWT Handling**: All requests except `Login` must include the `authorization` header in the metadata.
3.  **Heatmap Rendering**: Use the `Grid` data in the update to render "footprint" particles or fog-of-war transparency on the canvas.

### Important Protocol Constants
- **Tick Rate**: 10Hz (Update arriving every 100ms).
- **Grid Size**: 128x128.
- **Combat Radius**: 1.5 units (Visualized as the "danger zone" around players).

---

## 4. Technical Requirements for Frontend
- **Protobuf Generation**: Run `protoc` with the `grpc-web` plugin on `server/proto/game.proto` to generate the Javascript/Typescript classes.
- **CORS**: The server is configured to allow `*` origins in development (`cmd/server/main.go`), but ensure your production domain is added to `cors.Options`.
- **Wallet Interaction**: You must use `@solana/web3.js` to sign the initial login message.
