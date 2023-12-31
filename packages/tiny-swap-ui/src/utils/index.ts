import { ethers } from "ethers";
import erc20ABI from "../artifactory/abi/ERC20.json";
import factoryABI from "../artifactory/abi/UniswapV2Factory.json";
import pairABI from "../artifactory/abi/UniswapV2Pair.json";
import { FACTORY_ADDRESS, TOKEN, tokenMap } from './const';

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
  } else {
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
  console.log('index-42', 'im called')
  const provider = getProvider();
  const signer = await provider.getSigner();
  return signer
}

export function getFactoryContract() {
  const contractAddress = FACTORY_ADDRESS;
  const contractABI = factoryABI.abi;
  return getContract(contractAddress, contractABI);
}

export async function getFactoryContractWithSigner() {
  const signer = await getSigner();
  const contractAddress = FACTORY_ADDRESS;
  const contractABI = factoryABI.abi;
  const contract = getContract(contractAddress, contractABI);
  const contractWithSigner = await contract.connect(signer) as ethers.Contract
  return contractWithSigner
}

export async function getPairAddress(token0: TOKEN, token1: TOKEN): Promise<string> {
  const token0Address = tokenToAddress(token0)
  const token1Address = tokenToAddress(token1)
  const factory = getFactoryContract()
  try {
    const pair = await factory.getPair(token0Address, token1Address)
    return pair
  } catch (err) {
    console.error(err)
    throw Error('NO MATCHED PAIR')
  }
}

export async function getPairLength() {
  const contract = getFactoryContract();
  const pairsLength = await contract.allParisLength();
  return pairsLength
}

export async function getLPTokenBalance(pair: address) {
  const pairContract = await getContract(pair, pairABI.abi);
  const signer = await getSigner()
  const balance = await pairContract.balanceOf(signer)
  const decimals = await pairContract.decimals()
  const result = ethers.formatUnits(balance, decimals)
  return toPrecision(parseFloat(result))
}

async function isFirstDeposit(pair: address) {
  const pairContract = await getContractWithSigner(pair, pairABI.abi);
  const totalSupply = await pairContract.totalSupply();
  return totalSupply === BigInt(0);
}
export async function calculateMinTokenAmountForLiquidity(token0: TOKEN, token1: TOKEN, tokenAmount: string): Promise<string> {
  await wait(2000)
  const pair = await getPairAddress(token0, token1)
  if (await isFirstDeposit(pair)) {
    return ''
  } else {
    const [reserve0, reserve1] = await getReserves(pair)
    const isInputToken0 = tokenToAddress(token0) < tokenToAddress(token1)
    let anotherTokenAmount;

    if (isInputToken0) {
      anotherTokenAmount = Number(tokenAmount) * Number(reserve1) / Number(reserve0)
    } else {
      anotherTokenAmount = Number(tokenAmount) * Number(reserve0) / Number(reserve1)
    }
    return anotherTokenAmount.toString()
  }
}

export async function getTokenAmount(token0: TOKEN, token1: TOKEN, tokenInAmount: string) {
  const pair = await getPairAddress(token0, token1)
  const balance0 = await tokenBalance(tokenToAddress(token0), pair)
  const balance1 = await tokenBalance(tokenToAddress(token1), pair)
  const [reserve0, reserve1] = await getReserves(pair)

  const b0 = Number(balance0)
  const b1 = Number(balance1)
  const r0 = Number(reserve0)
  const r1 = Number(reserve1)
  const i = Number(tokenInAmount)
  // if denominator = b0 + i * 0.997 will lead to donation involved into calculate with whole value, not reduce 0.003 fee
  // Note: below considering donation issue
  const denominator = (b0 + i) - (b0 + i - r0) * 0.003
  const tokenOutAmount = b1 - r0 * r1 / denominator
  // in case circulating decimal lead to out amount larger than should be
  return (Math.floor(tokenOutAmount * 1000) / 1000).toString()
}
export async function mint(pair: address, to: address) {
  const pairContract = await getContractWithSigner(pair, pairABI.abi);
  const result = await pairContract.mint(to)
  const receipt = await result.wait()
  return receipt
}

export async function burn(pair: address, to: address) {
  const signer = await getSigner()
  const pairContract = await getContractWithSigner(pair, pairABI.abi)
  const liquidity = await pairContract.balanceOf(signer)
  await pairContract.approve(signer, 100000000000000)

  const transferResult = await pairContract.transferFrom(signer, pair, liquidity)

  const result = await pairContract.burn(to)
  return result.wait()
}

export async function swap(token: TOKEN, value: string, to: address, pair: address) {
  const pairContract = await getContractWithSigner(pair, pairABI.abi)
  const tokenDecimal = await tokenDecimals(token)
  const amountOut = ethers.parseUnits(value, tokenDecimal);
  const result = await pairContract.swap(0, amountOut, to, '0x')
  return result.wait()
}

export async function getReserves(pair: address) {
  const pairContract = await getContract(pair, pairABI.abi)
  const decimals = await pairContract.decimals();
  const reserves = await pairContract.getReserves()
  return reserves.map((reserve: number) => toPrecision(parseFloat(ethers.formatUnits(reserve, decimals))))
}

export async function withDrawToken0(pair: address, token: TOKEN, to: address, value: string) {
  const pairContract = await getContractWithSigner(pair, pairABI.abi)
  const tokenDecimal = await tokenDecimals(token)
  const result = await pairContract.withdrawToken0(to, ethers.parseUnits(value, tokenDecimal))
  return result.wait()
}

//TOKEN specific
export async function isNotSufficient(token0: TOKEN, token1: TOKEN, token0Value: string, token1Value: string) {
  const balance0 = await tokenBalance(tokenToAddress(token0))
  const balance1 = await tokenBalance(tokenToAddress(token1))
  return Number(balance0) < Number(token0Value) || Number(balance1) < Number(token1Value)
}
export async function tokenBalance(tokenAddress: address, owner?: address) {
  const tokenCotract = await getContract(tokenAddress, erc20ABI.abi)
  const decimals = await tokenCotract.decimals();
  const balance = await tokenCotract.balanceOf(owner ?? await getSigner())
  const result = ethers.formatUnits(balance, decimals)
  return toPrecision(parseFloat(result))
}
export async function tokenDecimals(token: TOKEN) {
  const tokenAddress = tokenToAddress(token)
  const tokenCotract = await getContract(tokenAddress, erc20ABI.abi)
  const decimals = await tokenCotract.decimals();
  return decimals
}
export async function tokenTransfer(token: TOKEN, value: string, to: address) {
  const tokenDecimal = await tokenDecimals(token)
  const amount = ethers.parseUnits(value, tokenDecimal);
  const tokenAddress = tokenToAddress(token)
  const tokenCotract = await getContractWithSigner(tokenAddress, erc20ABI.abi)
  const result = await tokenCotract.transfer(to, amount)
  const receipt = await result.wait()
  return receipt
}

//TODO: delete
export async function tokenTransferFrom(token: TOKEN, value: string, from: address, to: address) {
  const tokenDecimal = await tokenDecimals(token)
  const amount = ethers.parseUnits(value, tokenDecimal);
  const tokenAddes = tokenToAddress(token)
  const tokenCotract = await getContractWithSigner(tokenAddes, erc20ABI.abi)
  const result = (await tokenCotract.transferFrom(from, to, amount)).wait()
  return result
}

export function tokenToAddress(token: TOKEN): string {
  const ret = tokenMap.get(token)
  return ret ?? token;
}

export function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function toPrecision(value: number, decimal?: number) {
  return value.toPrecision(decimal ?? 8)
}