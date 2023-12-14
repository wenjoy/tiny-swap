import { ethers } from "hardhat";
import { ERC20, UniswapV2Factory } from '../typechain-types';

function uintTransform(value: number) {
  return ethers.parseUnits(value.toString(), 18)
}

async function getContract<T>(name: string, args: any[], address?: string): Promise<[T, string]> {
  const [deployer] = await ethers.getSigners();

  if (address) {
    return [(await ethers.getContractAt(name, address)) as T, address]
  }

  const contract = await ethers.deployContract(name, args, deployer);
  const contractAddress = await contract.getAddress()
  console.log("contract deployed at: %s, by %s", contractAddress, deployer);
  return [contract as T, contractAddress]
}

async function main() {
  const [deployer] = await ethers.getSigners();

  const [factory] = await getContract<UniswapV2Factory>("UniswapV2Factory", [deployer], '0x6255a84B94422a8d8B492542Bd03703d7a7ac34a')
  const [token0, token0Address] = await getContract<ERC20>('ERC20', [], '0x03f6a4b75E3cA56c87873Fc0CFA58577FF26E9bb')
  const [token1, token1Address] = await getContract<ERC20>('ERC20', [], '0xCCc18761954De1472c2F68787Dad13C5D066e7Ff')

  let pairAddress = await factory.getPair(token0Address, token1Address);

  if (pairAddress !== ethers.ZeroAddress) {
    console.log('deploy-31', 'pair already exists', pairAddress)
    return
  }

  const initial_supply = uintTransform(300)
  await token0.mint(initial_supply)
  await token1.mint(initial_supply)
  console.log('token0 balance', await token0.balanceOf(deployer))
  console.log('token1 balance', await token1.balanceOf(deployer))

  await factory.createPair(token0Address, token1Address)
  pairAddress = await factory.getPair(token0Address, token1Address);
  console.log('deploy-38-result', pairAddress)
}

main()
  .then(() => process.exitCode = 0)
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
