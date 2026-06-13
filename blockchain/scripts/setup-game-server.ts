import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const CONTRACT = "0xA234a8D716cB592E9a39668821cca8f382213fD9";
const RPC_URL  = process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc";

const ABI = [
  "function setGameServer(address _gameServer) external",
  "function gameServer() view returns (address)",
  "function owner() view returns (address)",
];

async function main() {
  // ARBITRUM_PRIVATE_KEY is the deployer key used by hardhat.config.ts
  const deployerKey = process.env.ARBITRUM_PRIVATE_KEY || process.env.PRIVATE_KEY;
  if (!deployerKey) {
    console.error("Set ARBITRUM_PRIVATE_KEY in .env (the deployer key from hardhat.config.ts)");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Support both hex private keys and mnemonic phrases
  const cleanKey = deployerKey.replace(/^0x/, '').trim();
  let deployer: ethers.Wallet;
  if (cleanKey.split(' ').length > 1) {
    // It's a mnemonic
    deployer = ethers.Wallet.fromPhrase(cleanKey).connect(provider);
  } else {
    deployer = new ethers.Wallet(deployerKey, provider);
  }

  console.log("Deployer:", deployer.address);

  // ── 1. Generate a fresh server wallet ──────────────────────────────────────
  let serverWallet: ethers.Wallet;

  if (process.env.SERVER_PRIVATE_KEY) {
    // Reuse an existing key if already set
    serverWallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY);
    console.log("Using existing server wallet:", serverWallet.address);
  } else {
    serverWallet = ethers.Wallet.createRandom();
    console.log("\n=== NEW SERVER WALLET ===");
    console.log("Address    :", serverWallet.address);
    console.log("Private key:", serverWallet.privateKey);
    console.log("  → Copy the private key above into Render as ARBITRUM_PRIVATE_KEY");
    console.log("  → Add it to .env as SERVER_PRIVATE_KEY to reuse next time");
    console.log("=========================\n");
  }

  // ── 2. Call setGameServer ───────────────────────────────────────────────────
  const contract = new ethers.Contract(CONTRACT, ABI, deployer);

  const current = await contract.gameServer();
  if (current.toLowerCase() === serverWallet.address.toLowerCase()) {
    console.log("Already set — gameServer is", current);
    return;
  }

  console.log("Calling setGameServer(%s)...", serverWallet.address);
  const tx = await contract.setGameServer(serverWallet.address);
  console.log("Tx sent:", tx.hash);
  await tx.wait();
  console.log("Confirmed! gameServer is now:", serverWallet.address);
  console.log("Arbiscan:", `https://sepolia.arbiscan.io/tx/${tx.hash}`);

  // ── 3. Remind about gas ────────────────────────────────────────────────────
  const bal = await provider.getBalance(serverWallet.address);
  if (bal === 0n) {
    console.log("\nThe server wallet has no ETH.");
    console.log("Send a small amount of Arbitrum Sepolia ETH to:", serverWallet.address);
    console.log("Faucet: https://faucet.quicknode.com/arbitrum/sepolia");
  }
}

main().catch(console.error);
