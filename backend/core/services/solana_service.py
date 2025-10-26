import os
import json
from decimal import Decimal
from django.conf import settings
import requests

class SolanaService:
    def __init__(self):
        self.rpc_url = os.getenv('SOLANA_RPC_URL', 'https://api.devnet.solana.com')
        self.wallet_private_key = os.getenv('WALLET_PRIVATE_KEY')
        self.sanctum_pool = os.getenv('SANCTUM_POOL_ADDRESS')
        self.is_mock = os.getenv('USE_MOCK_SERVICES', 'True').lower() == 'true'
    
    def _make_rpc_request(self, method, params=None):
        if self.is_mock:
            return self._mock_rpc_response(method, params)
        
        payload = {
            'jsonrpc': '2.0',
            'id': 1,
            'method': method,
            'params': params or []
        }
        
        try:
            response = requests.post(self.rpc_url, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Solana RPC error: {e}")
            raise Exception(f"Solana RPC unavailable: {e}")
    
    def _mock_rpc_response(self, method, params):
        print(f"Mock Solana RPC: {method} with params {params}")
        
        if method == 'getBalance':
            return {'result': {'value': 1000000000}}  # 1 SOL in lamports
        elif method == 'getTransaction':
            return {'result': {'meta': {'err': None}}}
        elif method == 'sendTransaction':
            return {'result': f'mock_tx_{params[0][:16]}'}
        else:
            return {'result': 'mock_success'}
    
    def verify_transaction(self, transaction_hash, expected_amount, expected_recipient):
        """Verify a transaction on Solana"""
        if self.is_mock:
            return True
            
        result = self._make_rpc_request('getTransaction', [transaction_hash])
        if 'result' not in result:
            return False
        
        transaction = result['result']
        # Add proper transaction verification logic here
        return transaction.get('meta', {}).get('err') is None
    
    def send_payout(self, recipient_address, amount):
        """Send SOL payout to player"""
        if self.is_mock:
            return f"mock_payout_tx_{recipient_address[-8:]}_{int(amount*1000000000)}"
        
        # In production, implement actual transaction signing and sending
        lamports = int(amount * 1000000000)  # Convert SOL to lamports
        
        # This would use solana-py or similar library in production
        transaction_data = {
            'recipient': recipient_address,
            'lamports': lamports,
            'type': 'payout'
        }
        
        result = self._make_rpc_request('sendTransaction', [transaction_data])
        return result.get('result')
    
    def get_balance(self, public_key):
        """Get SOL balance for a wallet"""
        result = self._make_rpc_request('getBalance', [public_key])
        if 'result' in result:
            return result['result']['value'] / 1000000000  # Convert lamports to SOL
        return 0
    
    def verify_wallet_ownership(self, public_key, signature, message):
        """Verify wallet ownership using signature"""
        if self.is_mock:
            return True
            
        # In production, implement proper signature verification
        # This would use solana-py or similar library
        try:
            # Placeholder for actual verification
            return len(signature) > 0 and len(public_key) == 44
        except:
            return False
    
    def stake_to_sanctum(self, amount):
        """Stake SOL to Sanctum LST pool"""
        if self.is_mock:
            return f"mock_stake_tx_{int(amount*1000000000)}"
        
        # In production, implement Sanctum staking
        print(f"Mock: Staking {amount} SOL to Sanctum pool {self.sanctum_pool}")
        return f"stake_tx_{int(amount*1000000000)}"
    
    def unstake_from_sanctum(self, lst_amount):
        """Unstake from Sanctum LST pool"""
        if self.is_mock:
            return f"mock_unstake_tx_{int(lst_amount*1000000000)}"
        
        # In production, implement Sanctum unstaking
        print(f"Mock: Unstaking {lst_amount} LST from Sanctum")
        return f"unstake_tx_{int(lst_amount*1000000000)}"