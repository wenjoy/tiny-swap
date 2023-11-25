import { ethers } from "ethers";
import erc20ABI from "./artifactory/abi/ERC20.json";
import factoryABI from "./artifactory/abi/UniswapV2Factory.json";
import pairABI from "./artifactory/abi/UniswapV2Pair.json";

let provider: ethers.JsonRpcProvider;

type address = ethers.AddressLike

export function getProvider() {
  if (!provider) {
    provider = new ethers.JsonRpcProvider();
  }
  return provider;
}

function getContract(contractAddress: address, abi: ethers.InterfaceAbi): ethers.Contract {
  const provider = getProvider();
  const contract = new ethers.Contract(contractAddress as string, abi, provider);
  return contract
}

async function getContractWithSigner(contractAddress: address, abi: ethers.InterfaceAbi): Promise<ethers.Contract> {
  const signer = await getSigner();
  const contract = getContract(contractAddress, abi);
  const contractWithSigner = contract.connect(signer) as ethers.Contract
  return contractWithSigner
}

export async function getSigner() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return signer
}

export function getFactoryContract() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = factoryABI.abi;
  return getContract(contractAddress, contractABI);
}

export async function getFactoryContractWithSigner() {
  const signer = await getSigner();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = factoryABI.abi;
  const contract = getContract(contractAddress, contractABI);
  const contractWithSigner = await contract.connect(signer) as ethers.Contract
  return contractWithSigner
}

export async function getPairAddress(token0Address: address, token1Address: address) {
  const contract = getFactoryContract()
  const pair = await contract.getPair(token0Address, token1Address)
  return pair
}

export async function getPairLength() {
  const contract = getFactoryContract();
  const pairsLength = await contract.allParisLength();
  console.log('pairsLength', pairsLength)
  return pairsLength
}

// export async function createPair(token0Address: address, token1Address: address): Promise<address> {
//   const contract = await getFactoryContractWithSigner()
//
//   let pair = await getPairAddress(token0Address, token1Address)
//
//   if (ethers.ZeroAddress == pair) {
//     const result = await contract.createPair(token0Address, token1Address)
//     console.log('result', result)
//   }
//
//   pair = await getPairAddress(token0Address, token1Address)
//   return pair
// }

export async function mint(pair: address, to: address) {
const pairContract = await getContractWithSigner(pair, pairABI.abi);
const result = await pairContract.mint(to)
console.log('utils-65-result', result)
}

// export async function tokenMint(token: address, value: number) {
//   const tokenCotract = await getContractWithSigner(token, erc20ABI.abi)
//   const result = await tokenCotract.mint(value)
//   console.log('utils-79-result', result)
// }

export async function tokenBalnce(token: address) {
  const tokenCotract = await getContract(token, erc20ABI.abi)
  const balance = await tokenCotract.balanceOf(await getSigner())
  // console.log('utils-93-balance', balance)
  return balance
}
export async function tokenTransfer(token: address, value: number,to: address) {
  const tokenCotract = await getContractWithSigner(token, erc20ABI.abi)
  const result = await tokenCotract.transfer(to, value)
  console.log('utils-98-result', result)
}