package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User model
type User struct {
	ID                    uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Username              string    `gorm:"uniqueIndex;not null"`
	Email                 string    `gorm:"uniqueIndex"`
	WalletAddress         string    `gorm:"uniqueIndex;size:44"`
	SolBalance            float64   `gorm:"type:decimal(18,9);default:0"`
	TotalGamesPlayed      int       `gorm:"default:0"`
	TotalSolExtracted     float64   `gorm:"type:decimal(18,9);default:0"`
	SuccessfulExtractions int       `gorm:"default:0"`
	Eliminations          int       `gorm:"default:0"`
	AvatarURL             string
	CreatedAt             time.Time
	UpdatedAt             time.Time
	DeletedAt             gorm.DeletedAt `gorm:"index"`
}

// GameSession model
type GameSession struct {
	ID                  uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name                string    `gorm:"size:100;not null"`
	MapType             string    `gorm:"size:50;not null"` // dungeon_alpha, sector_7_ruins, etc.
	Status              string    `gorm:"size:20;default:'waiting'"` // waiting, active, completed, cancelled
	MaxPlayers          int       `gorm:"default:50"`
	EntryFee            float64   `gorm:"type:decimal(18,9);not null"`
	PrizePool           float64   `gorm:"type:decimal(18,9);default:0"`
	DurationMinutes     int       `gorm:"default:5"`
	StartTime           *time.Time
	EndTime             *time.Time
	EncryptedLootData   string `gorm:"type:text"`
	ArciumSessionID     string `gorm:"size:100"`
	CreatedAt           time.Time
	UpdatedAt           time.Time
	Players             []PlayerSession `gorm:"foreignKey:GameSessionID"`
	LootItems           []LootItem      `gorm:"foreignKey:GameSessionID"`
	NPCs                []NPC           `gorm:"foreignKey:GameSessionID"`
	Hazards             []Hazard        `gorm:"foreignKey:GameSessionID"`
	Events              []GameEvent     `gorm:"foreignKey:GameSessionID"`
}

// PlayerSession model
type PlayerSession struct {
	ID                     uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID                 uuid.UUID `gorm:"type:uuid;not null"`
	User                   User      `gorm:"foreignKey:UserID"`
	GameSessionID          uuid.UUID `gorm:"type:uuid;not null"`
	Status                 string    `gorm:"size:20;default:'alive'"` // alive, extracted, eliminated
	PositionX              float64   `gorm:"default:0"`
	PositionY              float64   `gorm:"default:0"`
	Health                 int       `gorm:"default:100"`
	EncryptedLootBalance   string    `gorm:"type:text"`
	Kills                  int       `gorm:"default:0"`
	EntryTransactionHash   string    `gorm:"size:100"`
	PayoutTransactionHash  string    `gorm:"size:100"`
	FinalPayout            float64   `gorm:"type:decimal(18,9);default:0"`
	JoinedAt               time.Time `gorm:"autoCreateTime"`
}

// LootItem model
type LootItem struct {
	ID                 uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	GameSessionID      uuid.UUID `gorm:"type:uuid;not null"`
	ItemType           string    `gorm:"size:20;not null"` // small, medium, large, final_chest
	SolValue           float64   `gorm:"type:decimal(18,9);not null"`
	EncryptedPositionX string    `gorm:"type:text"`
	EncryptedPositionY string    `gorm:"type:text"`
	ArciumReference    string    `gorm:"size:100"`
	CollectedByID      *uuid.UUID `gorm:"type:uuid"`
	CollectedBy        *PlayerSession `gorm:"foreignKey:CollectedByID"`
	CollectedAt        *time.Time
}

// NPC model
type NPC struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	GameSessionID  uuid.UUID `gorm:"type:uuid;not null"`
	NPCType        string    `gorm:"size:20;not null"` // guard, patrol, sentinel
	Name           string    `gorm:"size:50"`
	PositionX      float64   `gorm:"default:0"`
	PositionY      float64   `gorm:"default:0"`
	PatrolPath     string    `gorm:"type:json"` // Store as JSON string in Go
	PatrolIndex    int       `gorm:"default:0"`
	Speed          float64   `gorm:"default:1.0"`
	Health         int       `gorm:"default:100"`
	Damage         int       `gorm:"default:15"`
	DetectionRange float64   `gorm:"default:10.0"`
	AttackRange    float64   `gorm:"default:2.0"`
	IsActive       bool      `gorm:"default:true"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime"`
}

// Hazard model
type Hazard struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	GameSessionID  uuid.UUID `gorm:"type:uuid;not null"`
	HazardType     string    `gorm:"size:20;not null"` // spike_trap, poison_gas, etc.
	PositionX      float64   `gorm:"default:0"`
	PositionY      float64   `gorm:"default:0"`
	Radius         float64   `gorm:"default:3.0"`
	Damage         int       `gorm:"default:25"`
	IsActive       bool      `gorm:"default:true"`
	ActivationTime *time.Time
	Duration       int `gorm:"default:10"`
}

// GameEvent model
type GameEvent struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	GameSessionID uuid.UUID `gorm:"type:uuid;not null"`
	EventType     string    `gorm:"size:50;not null"`
	PlayerID      *uuid.UUID `gorm:"type:uuid"`
	TargetPlayerID *uuid.UUID `gorm:"type:uuid"`
	LootItemID    *uuid.UUID `gorm:"type:uuid"`
	Data          string    `gorm:"type:json"` // Flexible event data
	CreatedAt     time.Time `gorm:"autoCreateTime"`
}

// Transaction model
type Transaction struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID          uuid.UUID `gorm:"type:uuid;not null"`
	GameSessionID   *uuid.UUID `gorm:"type:uuid"`
	TransactionType string    `gorm:"size:20;not null"` // entry_fee, payout, transfer
	SolAmount       float64   `gorm:"type:decimal(18,9);not null"`
	TransactionHash string    `gorm:"size:100;uniqueIndex"`
	Status          string    `gorm:"size:20;default:'pending'"` // pending, confirmed, failed
	CreatedAt       time.Time `gorm:"autoCreateTime"`
	ConfirmedAt     *time.Time
}
