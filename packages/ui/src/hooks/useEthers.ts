import { ethers } from 'ethers';
import { getFactoryContract, getProvider } from '../utils';

async function useEthers() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  const block = await provider.getBlockNumber();
  await checkPair();
}

async function checkPair() {
  const contract = getFactoryContract();
  const pairsLength = await contract.allParisLength();
}

async function transferTest() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  let block = await provider.getBlockNumber();
  let balance = await provider.getBalance(signer);

  const tx = await signer.sendTransaction({
    to: ethers.ZeroAddress,
    value: ethers.parseEther("10.0")
  })

  block = await provider.getBlockNumber();
  balance = await provider.getBalance(signer);
}

export default useEthers;