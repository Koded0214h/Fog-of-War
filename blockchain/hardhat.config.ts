import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    arbitrumSepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL ?? "",
      accounts: process.env.ARBITRUM_PRIVATE_KEY
        ? [`0x${process.env.ARBITRUM_PRIVATE_KEY.replace(/^0x/, "")}`]
        : [],
    },
  },
});