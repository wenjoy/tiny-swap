import { useState } from 'react';

const PAIRS = ['DAI', 'DOGE']
type PAIRS = typeof PAIRS[number]

const usePairs = () => {
  const [pairs, setPairs] = useState<PAIRS[]>([])
  setPairs(PAIRS);
  return [pairs]
}

export default usePairs