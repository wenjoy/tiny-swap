import { Container, Paper } from '@mui/material'
import { useReducer, useState } from 'react'
import TokenPair from '../components/TokenPair'
import { TOKEN, TOKENS, getPairAddress, getProvider, getSigner, getTokenAmount, swap, tokenBalance, tokenToAddress, tokenTransfer, wait, withDrawToken0 } from '../utils'

function Swap() {
  const [token0, setToken0] = useState<TOKEN>(TOKENS[0])
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1])
  const [token0Value, setToken0Value] = useState('')
  const [token1Value, setToken1Value] = useState('')
  const [refresh, forceUpdate] = useReducer(x => x + 1, 0);

  function token0ChangeHandler(token: TOKEN) {
    setToken0(token);

    //TODO: token change should recalculate value also
    if (token === token1) {
      setToken1(token0)
    }
  }
  function token1ChangeHandler(token: TOKEN) {
    setToken1(token);

    if (token === token0) {
      setToken0(token1)
    }
  }

  async function token0ValueChangeHandler(value: string) {
    const otherValue = await getTokenAmount(token0, token1, value)
    console.log('Swap-30-otherValue', otherValue)
    setTokensValue(setToken0Value, setToken1Value, value, otherValue)
  }
  async function token1ValueChangeHandler(value: string) {
    const otherValue = await getTokenAmount(token1, token0, value)
    setTokensValue(setToken1Value, setToken0Value, value, otherValue)
  }

  async function setTokensValue(setFn: (value: React.SetStateAction<string>) => void, setOtherFn: (value: React.SetStateAction<string>) => void, value: string, otherValue: string) {
    setFn(value);
    if (otherValue) {
      setOtherFn(otherValue)
    }
  }

  async function swapHandler() {
    const pair = await getPairAddress(token0, token1)
    const to = await getSigner()
    console.log('Swap-48-en0', token0, token0Value)
    console.log('Token balance', await tokenBalance(tokenToAddress(token0)), await tokenBalance(tokenToAddress(token1)))
    const result = await tokenTransfer(token0, token0Value, pair)
    console.log('Swap-49-result', result)
    const provider = await getProvider()

    let receipt
    while (!receipt) {
      receipt = await provider.getTransactionReceipt(result.hash)
      await wait(200)
    }
    console.log('Swap-58', receipt)
    try {
      const result = await swap(token1, token1Value, to, pair)
      console.log('swap-63-result', result)
      forceUpdate()
    } catch (err) {
      console.error("Switch error: ", err)
      //TODO: manually revert is not right
      const resutl = await withDrawToken0(pair, token0, to, token0Value);
      console.log('Swap-65-resutl', resutl)
    }
  }

  return <Paper sx={{ p: 2, borderTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
    <Container maxWidth="xs">
      <TokenPair {...{
        token0, token0Value, token0ChangeHandler, token0ValueChangeHandler,
        token1, token1Value, token1ChangeHandler, token1ValueChangeHandler,
        submitHandler: swapHandler,
        submitButtonText: 'Swap',
        lock: true,
        refresh
      }} />
    </Container>
  </Paper>
}

export default Swap