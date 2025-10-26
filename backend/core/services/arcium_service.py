import os
import json
import requests
from decimal import Decimal
from django.conf import settings
import base64

class ArciumService:
    def __init__(self):
        self.api_key = os.getenv('ARCIUM_API_KEY', 'mock_key_development')
        self.base_url = os.getenv('ARCIUM_BASE_URL', 'https://api.arcium.com/v1')
        self.is_mock = os.getenv('USE_MOCK_SERVICES', 'True').lower() == 'true'
    
    def _make_request(self, endpoint, data=None, method='POST'):
        if self.is_mock:
            return self._mock_response(endpoint, data)
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            if method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            else:
                response = requests.get(url, headers=headers)
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Arcium API error: {e}")
            raise Exception(f"Arcium service unavailable: {e}")
    
    def _mock_response(self, endpoint, data):
        """Mock responses for development"""
        print(f"Mock Arcium: {endpoint} with data {data}")
        
        if endpoint == 'session/create':
            return {'sessionId': f'mock_session_{data.get("gameId", "unknown")}'}
        elif endpoint == 'compute/encrypt':
            return {'encryptedData': f'encrypted_{data.get("data", "unknown")}'}
        elif endpoint == 'compute/decrypt':
            return {'decryptedData': {'amount': '5.5', 'currency': 'SOL'}}
        elif endpoint == 'compute/transfer':
            return {
                'killerBalance': 'increased_balance',
                'victimBalance': 'zero_balance'
            }
        else:
            return {'status': 'success', 'mock': True}
    
    def create_encrypted_session(self, game_id, loot_distribution):
        """Create an encrypted session for loot distribution"""
        return self._make_request('session/create', {
            'gameId': game_id,
            'lootData': loot_distribution,
            'type': 'loot_distribution'
        })
    
    def encrypt_loot_distribution(self, game_session_id, loot_data):
        """Encrypt loot distribution using MPC"""
        session_result = self.create_encrypted_session(str(game_session_id), loot_data)
        
        # Store encrypted positions
        encrypted_positions = {}
        for loot_item in loot_data.get('loot_items', []):
            encrypted_x = self.encrypt_value(str(loot_item['position_x']))
            encrypted_y = self.encrypt_value(str(loot_item['position_y']))
            encrypted_positions[f"{loot_item['item_type']}_{len(encrypted_positions)}"] = {
                'x': encrypted_x,
                'y': encrypted_y,
                'value': str(loot_item['sol_value'])
            }
        
        return {
            'session_id': session_result['sessionId'],
            'encrypted_positions': encrypted_positions
        }
    
    def encrypt_value(self, value):
        """Encrypt a single value"""
        result = self._make_request('compute/encrypt', {'data': value})
        return result['encryptedData']
    
    def decrypt_loot_balance(self, encrypted_balance):
        """Decrypt player's loot balance"""
        result = self._make_request('compute/decrypt', {'encryptedData': encrypted_balance})
        return result['decryptedData']
    
    def transfer_loot_on_kill(self, killer_encrypted_balance, victim_encrypted_balance):
        """Transfer loot between players using private computation"""
        result = self._make_request('compute/transfer', {
            'killerBalance': killer_encrypted_balance,
            'victimBalance': victim_encrypted_balance
        })
        return {
            'killer_new_balance': result['killerBalance'],
            'victim_new_balance': result['victimBalance']
        }
    
    def add_to_encrypted_balance(self, current_balance, amount_to_add):
        """Add to encrypted balance without revealing the amount"""
        result = self._make_request('compute/add', {
            'currentBalance': current_balance,
            'amountToAdd': str(amount_to_add)
        })
        return result['newBalance']
    
    def verify_position_match(self, encrypted_position, player_position, threshold=2.0):
        """Verify if player position matches encrypted loot position without revealing exact location"""
        result = self._make_request('compute/verify-position', {
            'encryptedPosition': encrypted_position,
            'playerPosition': player_position,
            'threshold': threshold
        })
        return result.get('matches', False)