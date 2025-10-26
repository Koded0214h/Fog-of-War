import random
import asyncio
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from ..models import GameSession, LootItem, GameEvent
from .arcium_service import ArciumService
from .solana_service import SolanaService

class GameInitializer:
    def __init__(self):
        self.arcium_service = ArciumService()
        self.solana_service = SolanaService()
    
    def initialize_game_session(self, game_session):
        """Initialize a game session with complete setup"""
        
        # Calculate advanced loot distribution
        total_prize_pool = game_session.prize_pool
        final_chest_amount = total_prize_pool * Decimal('0.4')  # 40% to final chest
        distributed_loot = total_prize_pool - final_chest_amount
        
        # Create sophisticated loot distribution
        loot_items = self._generate_loot_distribution(
            distributed_loot, 
            final_chest_amount,
            game_session.map_type
        )
        
        # Encrypt loot distribution using Arcium
        try:
            encrypted_data = self.arcium_service.encrypt_loot_distribution(
                str(game_session.id),
                {'loot_items': loot_items}
            )
            
            game_session.encrypted_loot_data = json.dumps(encrypted_data)
            game_session.arcium_session_id = encrypted_data.get('session_id', '')
            game_session.save()
            
            # Create LootItem records with encrypted positions
            self._create_loot_items(game_session, loot_items, encrypted_data)
            
            # Initialize Sanctum staking for yield generation
            self._initialize_sanctum_staking(game_session)
            
            # Set up MagicBlock game state
            self._initialize_magicblock_state(game_session)
            
            # Create game start event
            GameEvent.objects.create(
                game_session=game_session,
                event_type='game_initialized',
                data={'loot_items_count': len(loot_items), 'prize_pool': str(total_prize_pool)}
            )
            
            return loot_items
            
        except Exception as e:
            print(f"Game initialization error: {e}")
            raise
    
    def _generate_loot_distribution(self, distributed_loot, final_chest_amount, map_type):
        """Generate sophisticated loot distribution based on map type"""
        loot_items = []
        
        # Final chest - always in a strategic location
        final_chest_position = self._get_final_chest_position(map_type)
        loot_items.append({
            'item_type': 'final_chest',
            'sol_value': final_chest_amount,
            'position_x': final_chest_position[0],
            'position_y': final_chest_position[1],
            'difficulty': 'extreme'
        })
        
        # Map-specific loot distribution
        if map_type == 'dungeon_alpha':
            loot_items.extend(self._generate_dungeon_loot(distributed_loot))
        elif map_type == 'sector_7_ruins':
            loot_items.extend(self._generate_urban_loot(distributed_loot))
        elif map_type == 'station_omega':
            loot_items.extend(self._generate_station_loot(distributed_loot))
        else:
            loot_items.extend(self._generate_jungle_loot(distributed_loot))
        
        return loot_items
    
    def _get_final_chest_position(self, map_type):
        """Get strategic final chest position based on map type"""
        positions = {
            'dungeon_alpha': (50, 50),  # Center of dungeon
            'sector_7_ruins': (85, 15),  # Hard-to-reach corner
            'station_omega': (50, 90),   # Top center
            'jungle_temple': (15, 85)    # Hidden corner
        }
        return positions.get(map_type, (50, 50))
    
    def _generate_dungeon_loot(self, distributed_loot):
        """Generate loot for dungeon map"""
        loot_items = []
        num_rooms = random.randint(8, 15)
        
        for i in range(num_rooms):
            room_x = random.uniform(10 + (i % 3) * 30, 30 + (i % 3) * 30)
            room_y = random.uniform(10 + (i // 3) * 30, 30 + (i // 3) * 30)
            
            # Room contains 1-3 loot piles
            room_loot_count = random.randint(1, 3)
            room_loot_value = distributed_loot * Decimal('0.7') / num_rooms / room_loot_count
            
            for j in range(room_loot_count):
                loot_x = room_x + random.uniform(-8, 8)
                loot_y = room_y + random.uniform(-8, 8)
                
                loot_items.append({
                    'item_type': random.choices(
                        ['small', 'medium', 'large'],
                        weights=[0.6, 0.3, 0.1]
                    )[0],
                    'sol_value': room_loot_value * Decimal(random.uniform(0.8, 1.2)),
                    'position_x': max(5, min(95, loot_x)),
                    'position_y': max(5, min(95, loot_y))
                })
        
        # Remaining loot as corridor loot
        corridor_loot_value = distributed_loot * Decimal('0.3')
        num_corridor_loot = random.randint(5, 10)
        
        for i in range(num_corridor_loot):
            loot_items.append({
                'item_type': 'small',
                'sol_value': corridor_loot_value / num_corridor_loot,
                'position_x': random.uniform(5, 95),
                'position_y': random.uniform(5, 95)
            })
        
        return loot_items
    
    def _generate_urban_loot(self, distributed_loot):
        """Generate loot for urban ruins map"""
        # Similar sophisticated distribution for other map types
        loot_items = []
        num_buildings = random.randint(10, 20)
        
        for i in range(num_buildings):
            building_x = random.uniform(5, 95)
            building_y = random.uniform(5, 95)
            
            loot_value = distributed_loot / num_buildings * Decimal(random.uniform(0.5, 1.5))
            loot_items.append({
                'item_type': random.choice(['small', 'medium']),
                'sol_value': loot_value,
                'position_x': building_x,
                'position_y': building_y
            })
        
        return loot_items
    
    def _generate_station_loot(self, distributed_loot):
        """Generate loot for space station map"""
        loot_items = []
        # Implementation for station map
        return loot_items
    
    def _generate_jungle_loot(self, distributed_loot):
        """Generate loot for jungle temple map"""
        loot_items = []
        # Implementation for jungle map
        return loot_items
    
    def _create_loot_items(self, game_session, loot_items, encrypted_data):
        """Create LootItem records in database"""
        encrypted_positions = encrypted_data.get('encrypted_positions', {})
        
        for i, loot_data in enumerate(loot_items):
            position_key = f"{loot_data['item_type']}_{i}"
            encrypted_position = encrypted_positions.get(position_key, {})
            
            LootItem.objects.create(
                game_session=game_session,
                item_type=loot_data['item_type'],
                sol_value=loot_data['sol_value'],
                encrypted_position_x=encrypted_position.get('x', 'encrypted_x'),
                encrypted_position_y=encrypted_position.get('y', 'encrypted_y'),
                arcium_reference=encrypted_data.get('session_id', '')
            )
    
    def _initialize_sanctum_staking(self, game_session):
        """Initialize Sanctum LST staking for the prize pool"""
        try:
            # Stake 80% of prize pool to generate yield
            stake_amount = game_session.prize_pool * Decimal('0.8')
            if stake_amount > Decimal('0.1'):  # Minimum stake amount
                tx_hash = self.solana_service.stake_to_sanctum(stake_amount)
                print(f"Staked {stake_amount} SOL to Sanctum for game {game_session.id}: {tx_hash}")
        except Exception as e:
            print(f"Sanctum staking failed: {e}")
    
    def _initialize_magicblock_state(self, game_session):
        """Initialize MagicBlock game state"""
        # This would integrate with MagicBlock SDK for real-time game state
        magicblock_state = {
            'game_id': str(game_session.id),
            'map_type': game_session.map_type,
            'player_count': game_session.players.count(),
            'start_time': game_session.start_time.isoformat() if game_session.start_time else None,
            'status': game_session.status
        }
        
        # In production, this would push to MagicBlock
        print(f"MagicBlock state initialized: {magicblock_state}")