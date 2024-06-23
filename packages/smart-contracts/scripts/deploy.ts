import { appendFileSync, writeFileSync } from 'fs';
import { ethers } from 'hardhat';
import { resolve } from 'path';
import { ERC20, UniswapV2Factory } from '../typechain-types';

const { FACTORY_ADDRESS, TOKEN0_ADDRESS, TOKEN1_ADDRESS } = process.env;

function uintTransform(value: number) {
  return ethers.parseUnits(value.toString(), 18);
}

let count = 0;
async function createContractIfNotExist<T>(
  name: string,
  args: any[],
  address?: string
): Promise<[T, string]> {
  if (address) {
    return [(await ethers.getContractAt(name, address)) as T, address];
  }

  const [deployer] = await ethers.getSigners();
  const contract = await ethers.deployContract(name, args, deployer);
  const contractAddress = await contract.getAddress();
  console.log(
    'contract %s deployed at: %s, by %s',
    name,
    contractAddress,
    deployer
  );

  const path = resolve(__dirname, '../../tiny-swap-ui/.env');
  console.log('deploy-23-path', path);

  if (name === 'UniswapV2Factory') {
    writeFileSync(path, `REACT_APP_FACTORY_ADDRESS=${contractAddress}\n`);
  }

  if (name === 'ERC20') {
    if (count > 0) {
      appendFileSync(path, `REACT_APP_TOKEN_B_ADDRESS=${contractAddress}\n`);
    } else {
      count++;
      appendFileSync(path, `REACT_APP_TOKEN_A_ADDRESS=${contractAddress}\n`);
    }
  }
  return [contract as T, contractAddress];
}

async function main() {
  const [deployer] = await ethers.getSigners();

  const [factory] = await createContractIfNotExist<UniswapV2Factory>(
    'UniswapV2Factory',
    [deployer],
    FACTORY_ADDRESS
  );
  const [token0, token0Address] = await createContractIfNotExist<ERC20>(
    'ERC20',
    [],
    TOKEN0_ADDRESS
  );
  const [token1, token1Address] = await createContractIfNotExist<ERC20>(
    'ERC20',
    [],
    TOKEN1_ADDRESS
  );

  let pairAddress = await factory.getPair(token0Address, token1Address);

  if (pairAddress !== ethers.ZeroAddress) {
    console.log('deploy-31', 'pair already exists', pairAddress);
    return;
  }

  const initial_supply = uintTransform(300);
  await token0.mint(initial_supply);
  await token1.mint(initial_supply);
  console.log('token0 balance', await token0.balanceOf(deployer));
  console.log('token1 balance', await token1.balanceOf(deployer));

  await factory.createPair(token0Address, token1Address);
  pairAddress = await factory.getPair(token0Address, token1Address);
  console.log('pair address is: ', pairAddress);
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
