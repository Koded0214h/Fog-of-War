import { useAccount, useConnect, useDisconnect, useBalance, useReadContract, useWalletClient, usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import { arbitrumSepolia } from 'wagmi/chains';
import { CONTRACT_ADDRESS, FOG_SESSION_ABI, CREATION_FEE, ENTRY_FEE } from './config.js';

export function useArbitrumWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address, chainId: arbitrumSepolia.id });

  const isWrongNetwork = isConnected && chain?.id !== arbitrumSepolia.id;

  return {
    address,
    isConnected,
    isConnecting,
    isWrongNetwork,
    balance: balance ? parseFloat(balance.formatted).toFixed(4) : '0',
    connectors,
    connect,
    disconnect,
  };
}

export function useArbitrumSession() {
  const walletClient  = useWalletClient();
  const publicClient  = usePublicClient();

  const { data: creationFeeOnChain } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          FOG_SESSION_ABI,
    functionName: 'creationFee',
    chainId:      arbitrumSepolia.id,
  });

  const { data: entryFeeOnChain } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          FOG_SESSION_ABI,
    functionName: 'defaultEntryFee',
    chainId:      arbitrumSepolia.id,
  });

  // Create a session on-chain. Returns { sessionId, txHash }.
  async function createSessionOnChain(maxPlayers, durationSeconds) {
    const wc = walletClient.data;
    const pc = publicClient;
    if (!wc || !pc) throw new Error('Wallet not connected');

    const fee = creationFeeOnChain ?? CREATION_FEE;

    const hash = await wc.writeContract({
      address:      CONTRACT_ADDRESS,
      abi:          FOG_SESSION_ABI,
      functionName: 'createSession',
      args:         [BigInt(maxPlayers), BigInt(durationSeconds)],
      value:        fee,
      chain:        arbitrumSepolia,
    });

    const receipt = await pc.waitForTransactionReceipt({ hash });

    // Parse SessionCreated event to get sessionId
    const sessionCreatedTopic = '0x' + Buffer.from(
      // keccak256("SessionCreated(uint256,address,uint256,uint256)")
      'SessionCreated(uint256,address,uint256,uint256)'
    ).toString('hex'); // placeholder — we'll decode from logs

    const log = receipt.logs.find(l =>
      l.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
    );
    if (!log) throw new Error('SessionCreated event not found in receipt');

    // sessionId is the first indexed topic (topics[1])
    const sessionId = parseInt(log.topics[1], 16);

    return { sessionId, txHash: hash };
  }

  // Join an existing session on-chain. Returns txHash.
  async function joinSessionOnChain(sessionId) {
    const wc = walletClient.data;
    const pc = publicClient;
    if (!wc || !pc) throw new Error('Wallet not connected');

    const fee = entryFeeOnChain ?? ENTRY_FEE;

    const hash = await wc.writeContract({
      address:      CONTRACT_ADDRESS,
      abi:          FOG_SESSION_ABI,
      functionName: 'joinSession',
      args:         [BigInt(sessionId)],
      value:        fee,
      chain:        arbitrumSepolia,
    });

    await pc.waitForTransactionReceipt({ hash });
    return hash;
  }

  // Fetch on-chain session info (for display in lobby).
  async function getSessionOnChain(sessionId) {
    const pc = publicClient;
    if (!pc) return null;

    const result = await pc.readContract({
      address:      CONTRACT_ADDRESS,
      abi:          FOG_SESSION_ABI,
      functionName: 'getSession',
      args:         [BigInt(sessionId)],
    });

    const [creator, entryFee, maxPlayers, duration, startTime, state, winner, vault] = result;
    return { creator, entryFee, maxPlayers, duration, startTime, state, winner, vault };
  }

  return {
    creationFee:   creationFeeOnChain ?? CREATION_FEE,
    entryFee:      entryFeeOnChain    ?? ENTRY_FEE,
    createSessionOnChain,
    joinSessionOnChain,
    getSessionOnChain,
    contractAddress: CONTRACT_ADDRESS,
  };
}
