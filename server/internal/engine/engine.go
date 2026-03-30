package engine

import (
	"context"
	"math"
	"sync"
	"time"

	"github.com/google/uuid"
	pb "github.com/koded/fog-of-war/server/proto"
)

const (
	TickRate      = 10 // 10Hz
	TickDuration  = time.Second / TickRate
	GridSize      = 128 // Max grid size
	FogRadius     = 5.0
	CombatRadius  = 1.5
	CombatDamage  = 5
	FootprintDecay = 0.1 // Decay per tick
)

type PlayerState struct {
	ID        uuid.UUID
	Username  string
	X         float64
	Y         float64
	Health    int
	Status    string
	Kills     int
	TargetX   float64
	TargetY   float64
	Speed     float64
	LastMoved time.Time
}

type Tile struct {
	Heat      float64
	LastSeen  time.Time
}

type GameEngine struct {
	GameID    uuid.UUID
	Players   map[uuid.UUID]*PlayerState
	NPCs      []*pb.NPC
	Hazards   []*pb.Hazard
	Grid      [GridSize][GridSize]Tile
	Mu        sync.RWMutex
	Ticker    *time.Ticker
	Done      chan struct{}
	Broadcast chan *pb.GameStateUpdate
}

func NewGameEngine(gameID uuid.UUID) *GameEngine {
	return &GameEngine{
		GameID:    gameID,
		Players:   make(map[uuid.UUID]*PlayerState),
		Done:      make(chan struct{}),
		Broadcast: make(chan *pb.GameStateUpdate, 100),
	}
}

func (e *GameEngine) Start(ctx context.Context) {
	e.Ticker = time.NewTicker(TickDuration)
	go func() {
		for {
			select {
			case <-e.Ticker.C:
				e.Tick()
			case <-e.Done:
				e.Ticker.Stop()
				return
			case <-ctx.Done():
				e.Ticker.Stop()
				return
			}
		}
	}()
}

func (e *GameEngine) Tick() {
	e.Mu.Lock()
	defer e.Mu.Unlock()

	// 1. Process Movement
	for _, p := range e.Players {
		if p.Status != "alive" {
			continue
		}
		e.updatePlayerPosition(p)
		e.updateHeatmap(p)
	}

	// 2. Process Combat
	e.resolveCombat()

	// 3. Update NPC Behavior
	e.updateNPCs()

	// 4. Update Hazards
	e.updateHazards()

	// 5. Broadcast State
	e.broadcastState()
}

func (e *GameEngine) updatePlayerPosition(p *PlayerState) {
	dx := p.TargetX - p.X
	dy := p.TargetY - p.Y
	dist := math.Sqrt(dx*dx + dy*dy)

	if dist > 0.1 {
		moveDist := p.Speed * TickDuration.Seconds()
		if moveDist > dist {
			moveDist = dist
		}
		p.X += (dx / dist) * moveDist
		p.Y += (dy / dist) * moveDist
		p.LastMoved = time.Now()
	}
}

func (e *GameEngine) updateHeatmap(p *PlayerState) {
	gx := int(p.X)
	gy := int(p.Y)

	if gx >= 0 && gx < GridSize && gy >= 0 && gy < GridSize {
		e.Grid[gx][gy].Heat = 1.0 // Reset heat to max
		e.Grid[gx][gy].LastSeen = time.Now()
	}

	// Decay heatmap
	for x := 0; x < GridSize; x++ {
		for y := 0; y < GridSize; y++ {
			if e.Grid[x][y].Heat > 0 {
				e.Grid[x][y].Heat -= FootprintDecay / TickRate
				if e.Grid[x][y].Heat < 0 {
					e.Grid[x][y].Heat = 0
				}
			}
		}
	}
}

func (e *GameEngine) resolveCombat() {
	players := make([]*PlayerState, 0, len(e.Players))
	for _, p := range e.Players {
		if p.Status == "alive" {
			players = append(players, p)
		}
	}

	for i := 0; i < len(players); i++ {
		for j := i + 1; j < len(players); j++ {
			p1 := players[i]
			p2 := players[j]

			dx := p1.X - p2.X
			dy := p1.Y - p2.Y
			dist := math.Sqrt(dx*dx + dy*dy)

			if dist <= CombatRadius {
				p1.Health -= CombatDamage
				p2.Health -= CombatDamage

				if p1.Health <= 0 {
					p1.Status = "eliminated"
					p2.Kills++
				}
				if p2.Health <= 0 {
					p2.Status = "eliminated"
					p1.Kills++
				}
			}
		}
	}
}

func (e *GameEngine) updateNPCs() {
	// NPC Logic implementation
}

func (e *GameEngine) updateHazards() {
	// Hazard Logic implementation
}

func (e *GameEngine) broadcastState() {
	pbPlayers := make([]*pb.Player, 0, len(e.Players))
	for _, p := range e.Players {
		pbPlayers = append(pbPlayers, &pb.Player{
			Id:       p.ID.String(),
			Username: p.Username,
			X:        float32(p.X),
			Y:        float32(p.Y),
			Health:   int32(p.Health),
			Status:   p.Status,
			Kills:    int32(p.Kills),
		})
	}

	update := &pb.GameStateUpdate{
		GameId:     e.GameID.String(),
		ServerTime: time.Now().Unix(),
		Players:    pbPlayers,
		Npcs:       e.NPCs,
		Hazards:    e.Hazards,
	}

	select {
	case e.Broadcast <- update:
	default:
		// Broadcast channel full, skip update
	}
}

func (e *GameEngine) AddPlayer(id uuid.UUID, username string, x, y float64) {
	e.Mu.Lock()
	defer e.Mu.Unlock()
	e.Players[id] = &PlayerState{
		ID:       id,
		Username: username,
		X:        x,
		Y:        y,
		Health:   100,
		Status:   "alive",
		Speed:    5.0, // Default speed units per second
	}
}

func (e *GameEngine) SetTarget(id uuid.UUID, x, y float64) {
	e.Mu.Lock()
	defer e.Mu.Unlock()
	if p, ok := e.Players[id]; ok {
		p.TargetX = x
		p.TargetY = y
	}
}

func (e *GameEngine) CollectLoot(playerID uuid.UUID, lootID uuid.UUID) (bool, string, error) {
	e.Mu.Lock()
	defer e.Mu.Unlock()

	// In production, verify position match using Arcium
	// This would involve calling Arcium with player's position and encrypted loot position
	return true, "mock_new_encrypted_balance", nil
}
