# Fog of War — Complete API Documentation
**Version**: 1.0.0  
**Last Updated**: April 2026  
**Built by**: [@coder0214h](https://x.com/coder0214h)

---

## Table of Contents
1. [Overview](#overview)
2. [Deployed Endpoints](#deployed-endpoints)
3. [How This API Works (For REST Devs)](#how-this-api-works-for-rest-devs)
4. [Quick Setup](#quick-setup)
5. [Authentication](#authentication)
6. [Services & Methods](#services--methods)
7. [Object Schemas](#object-schemas)
8. [Complete Code Examples](#complete-code-examples)
9. [Error Codes](#error-codes)
10. [Smart Contract Info](#smart-contract-info)
11. [Testing with Postman](#testing-with-postman)

---

## 1. Overview

Fog of War is a real-time multiplayer extraction game. The backend is built in **Go** using **gRPC** — a high-performance alternative to REST. The game engine runs at **10Hz (10 ticks per second)**, pushing live game state to all connected players.

The backend handles:
- Player authentication via Solana wallet signatures
- Real-time game state streaming at 10Hz
- On-chain session creation and prize pool management (Arbitrum)
- Confidential loot verification (Arcium)
- Solana-based payouts

---

## 2. Deployed Endpoints

| Environment | URL | Protocol |
|-------------|-----|----------|
| **Production (gRPC-Web)** | `https://fog-of-war-v4y8.onrender.com` | gRPC-Web (HTTP/1.1) — use this in the browser |
| **Production (gRPC)** | `https://fog-of-war-v4y8.onrender.com` | gRPC (HTTP/2) — same URL, used by native clients |
| **Local (gRPC-Web)** | `http://localhost:8080` | gRPC-Web — use this for local frontend dev |
| **Local (gRPC)** | `http://localhost:50051` | gRPC — use this for Postman/grpcurl testing |

> **Note for frontend devs**: Both gRPC and gRPC-Web are served from the same URL on Render. In the browser, always use the `https://fog-of-war-v4y8.onrender.com` URL with the grpc-web library. Never use port numbers in production — Render handles routing automatically.

---

## 3. How This API Works (For REST Devs)

If you're used to REST APIs, here's how to think about this:

### Instead of `axios` or `fetch`, you use a generated client:
```javascript
// REST way
const res = await axios.post('/api/login', { public_key, signature, message });

// gRPC-Web way — almost the same, just a different client
const res = await client.login(req, {});
```

### The only truly different thing is streaming (Connect RPC):
```
Think of Connect() like a WebSocket the server controls.
Instead of polling GET /game-state every 100ms yourself,
you open ONE connection and the server pushes updates to
you automatically 10 times per second.
```

### Mental model:
| REST Concept | gRPC Equivalent |
|---|---|
| `POST /login` | `AuthService.Login()` |
| `POST /move` | `GameService.Move()` |
| `POST /collect-loot` | `GameService.CollectLoot()` |
| WebSocket / SSE | `GameService.Connect()` (streaming) |
| Request body (JSON) | Request message (Protobuf) |
| Response body (JSON) | Response message (Protobuf) |
| Authorization header | `authorization` metadata header |

---

## 4. Quick Setup

### Step 1 — Install dependencies
```bash
npm install grpc-web google-protobuf
npm install --save-dev protoc-gen-grpc-web
```

### Step 2 — Get the proto file
The proto file lives at `server/proto/game.proto` in the repo. This file defines all the API methods and message shapes — it's the equivalent of an OpenAPI/Swagger spec.

### Step 3 — Generate the JS/TS client
Run this from your frontend project root (adjust paths as needed):

```bash
npx protoc \
  --js_out=import_style=commonjs:./src/proto \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./src/proto \
  --proto_path=../server/proto \
  game.proto
```

This generates two files in `./src/proto/`:
- `game_pb.js` — all message classes (`LoginRequest`, `MoveRequest`, etc.)
- `game_grpc_web_pb.js` — the service clients (`AuthServiceClient`, `GameServiceClient`)

### Step 4 — Import and use
```javascript
import { AuthServiceClient, GameServiceClient } from './proto/game_grpc_web_pb';
import { LoginRequest, MoveRequest, ConnectRequest } from './proto/game_pb';

const BASE_URL = 'https://fog-of-war-v4y8.onrender.com'; // production
// const BASE_URL = 'http://localhost:8080'; // local dev

const authClient = new AuthServiceClient(BASE_URL);
const gameClient = new GameServiceClient(BASE_URL);
```

---

## 5. Authentication

The API uses **JWT (JSON Web Tokens)**. All requests except `Login` must include the token.

### How to pass the token:
```javascript
// Add to every request after login
const metadata = {
  'authorization': `Bearer ${token}`
};

// Use it like this
gameClient.move(req, metadata, callback);
```

### Token details:
- **Header key**: `authorization`
- **Format**: `Bearer <your_jwt_token>`
- **Contains**: `player_id` (UUID)
- **Expiry**: Check with backend team (default is usually 24h)

---

## 6. Services & Methods

---

### AuthService

#### `Login`
Authenticates a player via their Solana wallet signature and returns a JWT.

**Type**: Unary (like a normal POST request)

**Request — `LoginRequest`**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `public_key` | string | ✅ | Base58 encoded Solana wallet public key |
| `signature` | string | ✅ | Signature of the `message` signed by the wallet |
| `message` | string | ✅ | The plain text that was signed (e.g. `"login"`) |

**Response — `LoginResponse`**:
| Field | Type | Description |
|-------|------|-------------|
| `access_token` | string | JWT — store this and use in all future requests |
| `player_id` | string | UUID assigned to this player |

---

### GameService

#### `Connect`
Opens a persistent stream and receives live game state updates at 10Hz (every 100ms).

**Type**: Server-side Streaming — server pushes data to you continuously

**Request — `ConnectRequest`**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `game_id` | string | ✅ | UUID of the game session to join |

> **Where does `game_id` come from?**  
> Generate a UUID on the frontend. The first player to `Connect()` with that ID creates the session on-chain. Every other player who connects with the same ID joins that session.
> ```javascript
> import { v4 as uuidv4 } from 'uuid';
> const gameId = uuidv4(); // share this with other players
> ```

**Stream Response — `GameStateUpdate`** (arrives every 100ms):
| Field | Type | Description |
|-------|------|-------------|
| `game_id` | string | The session ID |
| `server_time` | int64 | Unix timestamp of this tick |
| `players` | Player[] | All players and their current state |
| `loot_items` | LootItem[] | Available loot on the map |
| `npcs` | NPC[] | NPC positions and health |
| `hazards` | Hazard[] | Active environmental hazards |
| `events` | GameEvent[] | Recent events (kills, loot collected, etc.) |

---

#### `Move`
Sets the player's target destination. The engine interpolates movement each tick.

**Type**: Unary (like a normal POST request)

**Request — `MoveRequest`**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `game_id` | string | ✅ | The active session ID |
| `target_x` | float | ✅ | Target X coordinate (0–128) |
| `target_y` | float | ✅ | Target Y coordinate (0–128) |

**Response — `MoveResponse`**:
| Field | Type | Description |
|-------|------|-------------|
| `success` | bool | `true` if the target was accepted |
| `error_message` | string | Reason for failure if `success` is false |

---

#### `CollectLoot`
Attempts to collect a loot item at the player's current position. Verified confidentially via Arcium.

**Type**: Unary (like a normal POST request)

**Request — `CollectLootRequest`**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `game_id` | string | ✅ | The active session ID |
| `loot_id` | string | ✅ | UUID of the loot item to collect |

**Response — `CollectLootResponse`**:
| Field | Type | Description |
|-------|------|-------------|
| `success` | bool | `true` if Arcium confirmed position match |
| `error_message` | string | Reason for failure if `success` is false |
| `new_encrypted_balance` | string | Player's updated loot balance (encrypted) |

---

## 7. Object Schemas

### `Player`
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Player UUID |
| `username` | string | Display name |
| `x` | float | Current X position on the grid |
| `y` | float | Current Y position on the grid |
| `health` | int32 | Current HP (0–100). 0 = eliminated |
| `status` | string | `"alive"`, `"extracted"`, or `"eliminated"` |
| `kills` | int32 | Number of players eliminated this session |

### `LootItem`
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Loot UUID — use this in `CollectLoot` |
| `item_type` | string | `"small"`, `"medium"`, `"large"`, `"final_chest"` |
| `x` | float | Approximate X position (exact position is encrypted) |
| `y` | float | Approximate Y position (exact position is encrypted) |
| `status` | string | `"available"` or `"collected"` |

### `NPC`
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | NPC UUID |
| `npc_type` | string | `"guard"`, `"patrol"`, `"sentinel"` |
| `x` | float | Current X position |
| `y` | float | Current Y position |
| `health` | int32 | Current HP |

### `Hazard`
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Hazard UUID |
| `hazard_type` | string | e.g. `"spike_trap"`, `"poison_gas"` |
| `x` | float | Center X position |
| `y` | float | Center Y position |
| `radius` | float | Danger radius in grid units |
| `is_active` | bool | Whether the hazard is currently active |

### `GameEvent`
| Field | Type | Description |
|-------|------|-------------|
| `event_type` | string | e.g. `"player_eliminated"`, `"loot_collected"` |
| `player_id` | string | UUID of the player who triggered the event |
| `target_id` | string | UUID of the target (another player or loot) |
| `data` | string | JSON string with extra event-specific data |

---

## 8. Complete Code Examples

### Login
```javascript
import { AuthServiceClient } from './proto/game_grpc_web_pb';
import { LoginRequest } from './proto/game_pb';

const authClient = new AuthServiceClient('https://fog-of-war-v4y8.onrender.com');

const req = new LoginRequest();
req.setPublicKey('your_wallet_public_key_base58');
req.setSignature('wallet_signature');
req.setMessage('login');

authClient.login(req, {}, (err, response) => {
  if (err) {
    console.error('Login failed:', err.message);
    return;
  }

  const token = response.getAccessToken();
  const playerId = response.getPlayerId();

  // Store the token — you'll need it for every other request
  localStorage.setItem('fog_token', token);
  localStorage.setItem('fog_player_id', playerId);

  console.log('Logged in as:', playerId);
});
```

---

### Connect & Stream Game State
```javascript
import { GameServiceClient } from './proto/game_grpc_web_pb';
import { ConnectRequest } from './proto/game_pb';
import { v4 as uuidv4 } from 'uuid';

const gameClient = new GameServiceClient('https://fog-of-war-v4y8.onrender.com');
const token = localStorage.getItem('fog_token');

// Generate or reuse a game ID — share this with other players
const gameId = uuidv4();

const req = new ConnectRequest();
req.setGameId(gameId);

const stream = gameClient.connect(req, {
  'authorization': `Bearer ${token}`
});

// This fires every 100ms automatically
stream.on('data', (update) => {
  const players = update.getPlayersList();
  const lootItems = update.getLootItemsList();
  const events = update.getEventsList();
  const serverTime = update.getServerTime();

  // Update your React state / canvas here
  console.log('Players:', players.map(p => ({
    id: p.getId(),
    x: p.getX(),
    y: p.getY(),
    health: p.getHealth(),
    status: p.getStatus(),
  })));
});

stream.on('error', (err) => {
  console.error('Stream error:', err);
  // Implement reconnect logic here
});

stream.on('end', () => {
  console.log('Game session ended');
});
```

---

### Move
```javascript
import { MoveRequest } from './proto/game_pb';

const token = localStorage.getItem('fog_token');

const req = new MoveRequest();
req.setGameId(gameId);
req.setTargetX(45.5);
req.setTargetY(72.0);

gameClient.move(req, { 'authorization': `Bearer ${token}` }, (err, response) => {
  if (err) {
    console.error('Move failed:', err);
    return;
  }

  if (!response.getSuccess()) {
    console.warn('Move rejected:', response.getErrorMessage());
  }
});
```

---

### Collect Loot
```javascript
import { CollectLootRequest } from './proto/game_pb';

const token = localStorage.getItem('fog_token');

const req = new CollectLootRequest();
req.setGameId(gameId);
req.setLootId('loot-item-uuid-from-game-state');

gameClient.collectLoot(req, { 'authorization': `Bearer ${token}` }, (err, response) => {
  if (err) {
    console.error('CollectLoot failed:', err);
    return;
  }

  if (response.getSuccess()) {
    console.log('Loot collected! New balance:', response.getNewEncryptedBalance());
  } else {
    console.warn('Could not collect loot:', response.getErrorMessage());
  }
});
```

---

### Full React Hook Example
```javascript
// hooks/useGameStream.js
import { useEffect, useRef, useState } from 'react';
import { GameServiceClient } from '../proto/game_grpc_web_pb';
import { ConnectRequest } from '../proto/game_pb';

const BASE_URL = 'https://fog-of-war-v4y8.onrender.com';

export function useGameStream(gameId) {
  const [players, setPlayers] = useState([]);
  const [lootItems, setLootItems] = useState([]);
  const [events, setEvents] = useState([]);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!gameId) return;

    const token = localStorage.getItem('fog_token');
    const client = new GameServiceClient(BASE_URL);

    const req = new ConnectRequest();
    req.setGameId(gameId);

    const stream = client.connect(req, {
      'authorization': `Bearer ${token}`
    });

    stream.on('data', (update) => {
      setPlayers(update.getPlayersList().map(p => ({
        id: p.getId(),
        username: p.getUsername(),
        x: p.getX(),
        y: p.getY(),
        health: p.getHealth(),
        status: p.getStatus(),
        kills: p.getKills(),
      })));

      setLootItems(update.getLootItemsList().map(l => ({
        id: l.getId(),
        type: l.getItemType(),
        x: l.getX(),
        y: l.getY(),
        status: l.getStatus(),
      })));

      setEvents(update.getEventsList().map(e => ({
        type: e.getEventType(),
        playerId: e.getPlayerId(),
        targetId: e.getTargetId(),
      })));
    });

    stream.on('error', (err) => {
      console.error('Stream disconnected:', err);
    });

    streamRef.current = stream;

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.cancel();
      }
    };
  }, [gameId]);

  return { players, lootItems, events };
}
```

---

## 9. Error Codes

| gRPC Code | gRPC Name | REST Equivalent | When it happens |
|-----------|-----------|-----------------|-----------------|
| `0` | OK | 200 | Success |
| `3` | INVALID_ARGUMENT | 400 | Bad UUID, invalid coordinates, malformed request |
| `5` | NOT_FOUND | 404 | Game session doesn't exist or already ended |
| `13` | INTERNAL | 500 | Server error — check backend logs |
| `16` | UNAUTHENTICATED | 401 | JWT missing, expired, or invalid |

### How errors come back:
```javascript
stream.on('error', (err) => {
  console.log(err.code);    // number e.g. 16
  console.log(err.message); // string e.g. "Invalid token: ..."
});

// For unary calls (Move, CollectLoot, Login):
gameClient.move(req, metadata, (err, response) => {
  if (err) {
    console.log(err.code);    // gRPC error code
    console.log(err.message); // human readable message
  }
});
```

---

## 10. Smart Contract Info

The prize pool and session lifecycle are managed on-chain.

### Arbitrum Sepolia (Testnet)
| Contract | Address |
|----------|---------|
| `FogSession` | `0xCF9D7db4d8b3039082c773229D690A9DBe91EF78` |

**View on explorer**: [https://sepolia.arbiscan.io/address/0xCF9D7db4d8b3039082c773229D690A9DBe91EF78](https://sepolia.arbiscan.io/address/0xCF9D7db4d8b3039082c773229D690A9DBe91EF78)

### Economy
| Action | Cost | Split |
|--------|------|-------|
| Create session | 0.5 ETH | → House (platform fee) |
| Join session | 1.0 ETH | → Prize pool (90%) + House (10%) |
| Win session | — | → 90% of total prize pool paid out automatically |

### Game Constants
| Constant | Value |
|----------|-------|
| Grid size | 128 × 128 |
| Tick rate | 10Hz (every 100ms) |
| Combat radius | 1.5 grid units |
| Player speed | 5.0 units/second |
| Fog radius | 5.0 grid units |

---

## 11. Testing with Postman

You can test all endpoints without writing any frontend code.

### Setup
1. Open Postman → **New** → **gRPC Request**
2. URL: `localhost:50051` (local) 
3. Click **Import .proto** → select `server/proto/game.proto`
4. Postman auto-discovers all methods

### Test sequence:

**Step 1 — Login**
- Method: `AuthService / Login`
- Message:
```json
{
  "public_key": "test_wallet_123",
  "signature": "mock_signature",
  "message": "login"
}
```
- Copy the `access_token` from the response

**Step 2 — Connect (Streaming)**
- Method: `GameService / Connect`
- Metadata: `authorization` → `Bearer <your_token>`
- Message:
```json
{
  "game_id": "550e8400-e29b-41d4-a716-446655440000"
}
```
- Click **Invoke** — you'll see game state stream in live

**Step 3 — Move**
- Method: `GameService / Move`
- Metadata: `authorization` → `Bearer <your_token>`
- Message:
```json
{
  "game_id": "550e8400-e29b-41d4-a716-446655440000",
  "target_x": 45.0,
  "target_y": 30.0
}
```

**Step 4 — Collect Loot**
- Method: `GameService / CollectLoot`
- Metadata: `authorization` → `Bearer <your_token>`
- Message:
```json
{
  "game_id": "550e8400-e29b-41d4-a716-446655440000",
  "loot_id": "any-uuid-from-game-state"
}
```

---

## Notes for the Frontend Dev

1. **Local dev**: Use `http://localhost:8080` as your BASE_URL
2. **Production**: Use `https://fog-of-war-v4y8.onrender.com`
3. **No port numbers in production** — Render handles routing
4. **Don't poll** — just open one `Connect()` stream and let it push to you
5. **Interpolate locally** — move the player sprite immediately on input, then correct to server position when the 100ms update arrives. This makes movement feel instant
6. **Reconnect on error** — implement a retry with exponential backoff on stream errors
7. **The proto file is the source of truth** — if anything in this doc conflicts with `game.proto`, trust the proto file

---

*Built with Go · gRPC · Arbitrum · Solana · Arcium*  
*[@coder0214h](https://x.com/coder0214h)*