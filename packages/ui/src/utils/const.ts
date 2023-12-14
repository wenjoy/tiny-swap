export const TOKEN_A = 'TOKEN A'
export const TOKEN_B = 'TOKEN B'
export const TOKENS = [TOKEN_A, TOKEN_B] as const;
export type TOKEN = (typeof TOKENS)[number];
export const FACTORY_ADDRESS = process.env.REACT_APP_FACTORY_ADDRESS ?? ''

const TOKEN_A_ADDRESS = process.env.REACT_APP_TOKEN_A_ADDRESS ?? ''
const TOKEN_B_ADDRESS = process.env.REACT_APP_TOKEN_B_ADDRESS ?? ''
const TOKEN_ADDRESSES = [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS];

export const tokenMap = new Map<TOKEN, string>();

TOKENS.forEach((token, index) => {
  tokenMap.set(token, TOKEN_ADDRESSES[index]);
});

