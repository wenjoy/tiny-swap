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

export default useEthers;
