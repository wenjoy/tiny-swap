import { ethers } from "ethers";
import erc20ABI from "./artifactory/abi/ERC20.json";
import factoryABI from "./artifactory/abi/UniswapV2Factory.json";
import pairABI from "./artifactory/abi/UniswapV2Pair.json";

declare global {
  interface Window {
    ethereum: any
  }
}

let provider: ethers.BrowserProvider;

type address = ethers.AddressLike

export function getProvider() {
  if (window.ethereum == null) {
    console.warn('Metamask not installed')
    //TODO: resolve type issue
    // provider = new ethers.JsonRpcProvider();
  }else {
    provider = new ethers.BrowserProvider(window.ethereum)
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

export async function getPairAddress(token0: TOKEN, token1: TOKEN): Promise<string> {
  const token0Address = tokenToAddress(token0)
  const token1Address = tokenToAddress(token1)
  const contract = getFactoryContract()
  try {
    const pair = await contract.getPair(token0Address, token1Address)
    return pair
  }catch(err) {
    console.error(err)
    throw Error('NO MATCHED PAIR')
  }
}

export async function getPairLength() {
  const contract = getFactoryContract();
  const pairsLength = await contract.allParisLength();
  console.log('pairsLength', pairsLength)
  return pairsLength
}
export async function getPairShare(pair: address) {
  const pairContract = await getContractWithSigner(pair, pairABI.abi);
  const signer = await getSigner()
  const total = await pairContract.totalSupply()
  const balance = await pairContract.balanceOf(signer)
  // console.log('utils-68-total', total, balance, balance/total)
  return total ==0 ? 0 : Number(balance) / Number(total)
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

async function isFirstDeposit (pair: address) {
  const pairContract = await getContractWithSigner(pair, pairABI.abi);
  const totalSupply = await pairContract.totalSupply();
  return totalSupply=== BigInt(0);
}
export async function calculateMinTokenAmountForLiquidity(token0: TOKEN, token1: TOKEN, tokenAmount: string): Promise<string> {
  const pair = await getPairAddress(token0, token1)
  const reverse = tokenToAddress(token0) < tokenToAddress(token1) ? false : true
  if(await isFirstDeposit(pair)) {
    return ''
  }else {
    const [reserve0, reserve1] = await getReserves(pair)
    const numerator = reverse ? Number(tokenAmount) * Number(reserve1) : Number(tokenAmount) * Number(reserve0) 
    const denominator = reverse ? Number(reserve0 ): Number(reserve1)
    const anotherTokenAmount = numerator / denominator
    return anotherTokenAmount.toString()
  }
}

export async function getTokenAmount(token0: TOKEN, token1: TOKEN, tokenInAmount: string) {
  const pair = await getPairAddress(token0, token1)
  const balance0 = await tokenBalnce(tokenToAddress(token0), pair)
  const balance1 = await tokenBalnce(tokenToAddress(token1), pair)
  const [reserve0, reserve1] = await getReserves(pair)
  
  const b0 = Number(balance0)
  const b1 = Number(balance1)
  const r0 = Number(reserve0)
  const r1 = Number(reserve1)
  const i = Number(tokenInAmount)
  //NOTE: this can be wrong, if someone donation
  // const tokenOutAmount = Number(balance1) - Number(reserve0) * Number(reserve1 )/ (Number(balance0)+ Number(tokenInAmount)*0.997)
  const tokenOutAmount = b1-r0*r1/(b0+0.997*i)
  return tokenOutAmount.toString()
}
export async function mint(pair: address, to: address) {
  const pairContract = await getContractWithSigner(pair, pairABI.abi);
  const result = await pairContract.mint(to)
  console.log('utils-65-result', result)
}

export async function burn(pair: address, to: address) {
  const signer = await getSigner()
  const pairContract = await getContractWithSigner(pair, pairABI.abi)
  const liquidity = await pairContract.balanceOf(signer)
  await pairContract.approve(signer, 100000000000000)

  const transferResult = await pairContract.transferFrom(signer, pair, liquidity)
  console.log('utils-96-transferResult', transferResult)

  const result = await pairContract.burn(to)
  console.log('utils-98-result', result)
}

export async function swap(token: TOKEN, value: string, to: address, pair: address) {
  const pairContract = await getContractWithSigner(pair, pairABI.abi)
  const tokenDecimal = await tokenDeciamls(token)
  const amountOut = ethers.parseUnits(value, tokenDecimal);
  const result = await pairContract.swap(0, amountOut, to, '0x')
  console.log('utils-112-result', result)
}

export async function getReserves(pair: address) {
  const pairContract = await getContract(pair, pairABI.abi)
  const decimals = await pairContract.decimals();
  const reserves = await pairContract.getReserves()
  return reserves.map((reserve: number)=> ethers.formatUnits(reserve, decimals))
}

//TOKEN specific
export async function tokenBalnce(tokenAddress: address, owner?: address) {
  const tokenCotract = await getContract(tokenAddress, erc20ABI.abi)
  const decimals = await tokenCotract.decimals();
  const balance = await tokenCotract.balanceOf(owner ?? await getSigner())
  return ethers.formatUnits(balance, decimals)
}
export async function tokenDeciamls(token: TOKEN) {
  const tokenAddress = tokenToAddress(token)
  const tokenCotract = await getContract(tokenAddress, erc20ABI.abi)
  const decimals = await tokenCotract.decimals();
  return decimals
}
export async function tokenTransfer(token: TOKEN, value: string,to: address) {
  const tokenDecimal = await tokenDeciamls(token)
  const amount = ethers.parseUnits(value, tokenDecimal);
  const tokenAddes = tokenToAddress(token)
  const tokenCotract = await getContractWithSigner(tokenAddes, erc20ABI.abi)
  const result = await tokenCotract.transfer(to, amount)
  return result
}

export async function tokenTransferFrom(token: TOKEN, value: string, from: address, to: address) {
  const tokenDecimal = await tokenDeciamls(token)
  const amount = ethers.parseUnits(value, tokenDecimal);
  const tokenAddes = tokenToAddress(token)
  const tokenCotract = await getContractWithSigner(tokenAddes, erc20ABI.abi)
  const result = await tokenCotract.transferFrom(from, to, amount)
  console.log('utils-195-result', result)
}

/**
 * why not just TOKENS = {DAI: '0x11', DOGE: '0x22'}, will this better?
 */
export const TOKENS = ['DAI', 'DOGE'] as const
export type TOKEN = (typeof TOKENS)[number]

const TOKENADDRESS = ['0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9']

const tokenMap = new Map<TOKEN, string>()
TOKENS.forEach((token, index)=> {
  tokenMap.set(token, TOKENADDRESS[index]);
})

export function tokenToAddress(token: TOKEN): string {
  const ret = tokenMap.get(token)
  return ret ?? token;
}

export function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
