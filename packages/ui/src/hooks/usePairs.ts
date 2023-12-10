import { useState } from 'react';
import { TOKEN_A, TOKEN_B } from '../utils/const';

const PAIRS = [TOKEN_A, TOKEN_B]
type PAIRS = typeof PAIRS[number]

const usePairs = () => {
  const [pairs, setPairs] = useState<PAIRS[]>([])
  setPairs(PAIRS);
  return [pairs]
}

export default usePairs