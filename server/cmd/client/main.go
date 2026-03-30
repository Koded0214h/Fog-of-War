package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/google/uuid"
	pb "github.com/koded/fog-of-war/server/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

func main() {
	// 1. Parse command line flags
	serverAddr := flag.String("addr", "localhost:50051", "The server address in the format of host:port")
	walletAddr := flag.String("wallet", "MySolanaWalletAddress_"+uuid.New().String()[:4], "Solana wallet address to use for login")
	gameIDStr := flag.String("game", "", "Existing Game ID to join (UUID). If empty, a new one is created.")
	flag.Parse()

	// 2. Setup Game ID
	var gameID string
	if *gameIDStr == "" {
		gameID = uuid.New().String()
		fmt.Printf("Creating new game session: %s\n", gameID)
	} else {
		gameID = *gameIDStr
		fmt.Printf("Joining existing game session: %s\n", gameID)
	}

	// 3. Connect to the gRPC server
	// Use NewClient for modern gRPC-Go
	conn, err := grpc.NewClient(*serverAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()

	authClient := pb.NewAuthServiceClient(conn)
	gameClient := pb.NewGameServiceClient(conn)

	// 4. Login to get JWT
	fmt.Println("--- Testing Login ---")
	loginRes, err := authClient.Login(context.Background(), &pb.LoginRequest{
		PublicKey: *walletAddr,
		Signature: "mock_sig",
		Message:   "auth_me",
	})
	if err != nil {
		log.Fatalf("could not login: %v", err)
	}
	fmt.Printf("Login Successful! PlayerID: %s\n", loginRes.PlayerId)

	// 5. Setup Auth Metadata
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	authCtx := metadata.AppendToOutgoingContext(ctx, "authorization", loginRes.AccessToken)

	// 6. Connect to Game Stream
	fmt.Println("\n--- Testing Game Connection ---")
	stream, err := gameClient.Connect(authCtx, &pb.ConnectRequest{
		GameId: gameID,
	})
	if err != nil {
		log.Fatalf("could not connect to game: %v", err)
	}

	// Listen for updates in a goroutine
	go func() {
		for {
			update, err := stream.Recv()
			if err != nil {
				fmt.Printf("\nStream closed: %v\n", err)
				return
			}
			// Use \r to keep the output on one line for cleaner status
			fmt.Printf("\r[Update] Time: %d | Players: %d | My Health: ", update.ServerTime, len(update.Players))
			for _, p := range update.Players {
				if p.Id == loginRes.PlayerId {
					fmt.Printf("%d | Pos: (%.1f, %.1f)   ", p.Health, p.X, p.Y)
				}
			}
		}
	}()

	// 7. Test Movement & Actions
	time.Sleep(1 * time.Second)
	fmt.Println("\n\n--- Testing Movement (Moving to 75, 80) ---")
	moveRes, err := gameClient.Move(authCtx, &pb.MoveRequest{
		GameId:  gameID,
		TargetX: 75.5,
		TargetY: 80.0,
	})
	if err != nil {
		log.Fatalf("movement failed: %v", err)
	}
	if moveRes.Success {
		fmt.Println("Movement command accepted.")
	}

	// 8. Test Loot Collection
	time.Sleep(2 * time.Second)
	fmt.Println("\n--- Testing Loot Collection ---")
	// In the mock engine, any loot ID is accepted
	mockLootID := uuid.New().String()
	lootRes, err := gameClient.CollectLoot(authCtx, &pb.CollectLootRequest{
		GameId: gameID,
		LootId: mockLootID,
	})
	if err != nil {
		fmt.Printf("Loot collection request failed: %v\n", err)
	} else if lootRes.Success {
		fmt.Printf("Loot collection successful! New Balance: %s\n", lootRes.NewEncryptedBalance)
	}

	// 9. Wait for interrupt to exit
	fmt.Println("\nPress Ctrl+C to stop the client and exit...")
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	fmt.Println("\nShutting down client.")
}
