import { ethers } from "hardhat";

function uintTransform(value: number) {
  return ethers.parseUnits(value.toString(), 18)
}

async function main() {
  const [deployer, other]= await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const factory = await ethers.deployContract("UniswapV2Factory", [deployer]);
  console.log("factory address: ", await factory.getAddress());

  const total = uintTransform(300)
  const token0 = await ethers.deployContract('ERC20')
  console.log("token0 address: ", await token0.getAddress());
  await token0.mint(total)
  console.log('token0 balance', await token0.balanceOf(deployer))


  const token1 = await ethers.deployContract('ERC20')
  console.log("token1 address: ", await token1.getAddress());
  await token1.mint(total)
  console.log('token1 balance', await token1.balanceOf(deployer))

  const out = uintTransform(100)
  console.log('other account', other.address)
  await token0.transfer(other, out)
  console.log('token0 balance', await token0.balanceOf(other))
  await token1.transfer(other, out)
  console.log('token1 balance', await token1.balanceOf(other))
  
  factory.createPair(token0, token1);
}

main()
.then(() => process.exitCode = 0)
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
