const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const DecisionLog = await ethers.getContractFactory("DecisionLog");

  console.log("Deploying DecisionLog...");
  const contract = await DecisionLog.deploy({
    gasPrice: 0n,
    gasLimit: 3000000n,
  });

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("DecisionLog deployed to:", address);

  const deployTx = contract.deploymentTransaction();
  if (deployTx) {
    console.log("Deploy tx hash:", deployTx.hash);
  }

  const addressFile = path.join(__dirname, "..", "deployedAddress.txt");
  fs.writeFileSync(addressFile, address, "utf8");
  console.log("Contract address written to deployedAddress.txt");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
