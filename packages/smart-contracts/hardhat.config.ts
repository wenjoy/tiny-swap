import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';
import { HardhatUserConfig } from "hardhat/config";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY

if (!SEPOLIA_PRIVATE_KEY) {
  throw Error('missing SEPOLIA_PRIVATE_KEY');
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.5.16" },
      { version: "0.6.6" },
    ]
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};

export default config;
