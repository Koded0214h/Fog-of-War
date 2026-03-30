package engine

import (
	"context"
	"sync"

	"github.com/google/uuid"
)

type GameManager struct {
	Engines map[uuid.UUID]*GameEngine
	Mu      sync.RWMutex
}

func NewGameManager() *GameManager {
	return &GameManager{
		Engines: make(map[uuid.UUID]*GameEngine),
	}
}

func (m *GameManager) GetEngine(gameID uuid.UUID) (*GameEngine, bool) {
	m.Mu.RLock()
	defer m.Mu.RUnlock()
	e, ok := m.Engines[gameID]
	return e, ok
}

func (m *GameManager) CreateEngine(gameID uuid.UUID) *GameEngine {
	m.Mu.Lock()
	defer m.Mu.Unlock()
	
	if e, ok := m.Engines[gameID]; ok {
		return e
	}
	
	e := NewGameEngine(gameID)
	m.Engines[gameID] = e
	return e
}

func (m *GameManager) StartEngine(ctx context.Context, gameID uuid.UUID) {
	if e, ok := m.GetEngine(gameID); ok {
		e.Start(ctx)
	}
}

func (m *GameManager) StopEngine(gameID uuid.UUID) {
	m.Mu.Lock()
	defer m.Mu.Unlock()
	
	if e, ok := m.Engines[gameID]; ok {
		close(e.Done)
		delete(m.Engines, gameID)
	}
}
