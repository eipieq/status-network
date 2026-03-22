require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  sourcify: {
    enabled: true,
  },
  networks: {
    statusNetwork: {
      url: "https://public.sepolia.rpc.status.network",
      chainId: 1660990954,
      accounts: [PRIVATE_KEY],
      gasPrice: 0,
      gas: 3000000,
    },
  },
};
