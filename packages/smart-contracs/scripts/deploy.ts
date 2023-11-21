import { ethers } from "hardhat";

async function main() {
  const [deployer]= await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const factory = await ethers.deployContract("UniswapV2Factory", [deployer]);

  console.log("factory address: ", await factory.getAddress());
}

main()
.then(() => process.exitCode = 0)
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
