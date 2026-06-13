import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const FogSessionModule = buildModule("FogSessionModule", (m) => {
  // Testnet-friendly fees — faucet ETH is scarce on Arbitrum Sepolia
  const creationFee     = m.getParameter("creationFee",     parseEther("0.001"));
  const defaultEntryFee = m.getParameter("defaultEntryFee", parseEther("0.01"));

  const fogSession = m.contract("FogSession", [creationFee, defaultEntryFee]);

  return { fogSession };
});

export default FogSessionModule;
