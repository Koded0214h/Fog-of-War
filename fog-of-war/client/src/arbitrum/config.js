import { createConfig, http } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const CONTRACT_ADDRESS = '0xA234a8D716cB592E9a39668821cca8f382213fD9';

export const CREATION_FEE = BigInt('1000000000000000');   // 0.001 ETH
export const ENTRY_FEE    = BigInt('10000000000000000');  // 0.01 ETH

export const FOG_SESSION_ABI = [
  {
    "inputs": [{"internalType": "uint256","name": "maxPlayers","type": "uint256"},{"internalType": "uint256","name": "durationSeconds","type": "uint256"}],
    "name": "createSession",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "sessionId","type": "uint256"}],
    "name": "joinSession",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "sessionId","type": "uint256"}],
    "name": "startSession",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "sessionId","type": "uint256"},{"internalType": "address","name": "winner","type": "address"}],
    "name": "endSession",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "creationFee",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "defaultEntryFee",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sessionCount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "sessionId","type": "uint256"}],
    "name": "getSession",
    "outputs": [
      {"internalType": "address","name": "creator","type": "address"},
      {"internalType": "uint256","name": "entryFee","type": "uint256"},
      {"internalType": "uint256","name": "maxPlayers","type": "uint256"},
      {"internalType": "uint256","name": "duration","type": "uint256"},
      {"internalType": "uint256","name": "startTime","type": "uint256"},
      {"internalType": "uint8","name": "state","type": "uint8"},
      {"internalType": "address","name": "winner","type": "address"},
      {"internalType": "address","name": "vault","type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "sessionId","type": "uint256"}],
    "name": "getPlayers",
    "outputs": [{"internalType": "address[]","name": "","type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "uint256","name": "sessionId","type": "uint256"},
      {"indexed": true,"internalType": "address","name": "creator","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "maxPlayers","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "entryFee","type": "uint256"}
    ],
    "name": "SessionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "uint256","name": "sessionId","type": "uint256"},
      {"indexed": true,"internalType": "address","name": "player","type": "address"}
    ],
    "name": "PlayerJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "uint256","name": "sessionId","type": "uint256"},
      {"indexed": true,"internalType": "address","name": "winner","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "prize","type": "uint256"}
    ],
    "name": "SessionEnded",
    "type": "event"
  }
];

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected(),                                              // MetaMask / Rabby / any injected
    coinbaseWallet({ appName: 'Fog of War' }),
  ],
  transports: {
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
  },
});
