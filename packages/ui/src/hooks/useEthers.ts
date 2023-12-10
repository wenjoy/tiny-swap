import { ethers } from 'ethers';
import { getFactoryContract, getProvider } from '../utils';

async function useEthers() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  const block = await provider.getBlockNumber();
  console.log('block', block)
  console.log('signer', signer)
  await checkPair();
}

async function checkPair() {
  const contract = getFactoryContract();
  const pairsLength = await contract.allParisLength();
  console.log('pairsLength', pairsLength)
}

async function transferTest() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  let block = await provider.getBlockNumber();
  let balance = await provider.getBalance(signer);

  console.log('useEthers-24-block', block)
  console.log('useEthers-10-balance', ethers.formatEther(balance))

  const tx = await signer.sendTransaction({
    to: ethers.ZeroAddress,
    value: ethers.parseEther("10.0")
  })

  block = await provider.getBlockNumber();
  balance = await provider.getBalance(signer);
  console.log('useEthers-16-tx', tx)
  console.log('useEthers-24-block', block)
  console.log('useEthers-10-balance', ethers.formatEther(balance))
}

export default useEthers;