import { Button, Card, Typography } from '@mui/material'
import { useState } from 'react'
import { TOKEN, TOKENS, getPairAddress, getProvider, getSigner, getTokenAmount, swap, tokenBalance, tokenToAddress, tokenTransfer, wait, withDrawToken0 } from '../utils'
import TokenForm from './TokenForm'

function Swap() {
  const [token0, setToken0] = useState<TOKEN>(TOKENS[0])
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1])
  const [token0Value, setToken0Value] = useState('')
  const [token1Value, setToken1Value] = useState('')

  function token0ChangeHandler (token: TOKEN) {
    setToken0(token);

    //TODO: token change should recalculate value also
    if(token === token1) {
      setToken1(token0)
    }
   }
  function token1ChangeHandler (token: TOKEN) {
    setToken1(token);

    if(token === token0) {
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
    if(otherValue) {
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
    while(!receipt) {
      receipt = await provider.getTransactionReceipt(result.hash)
      await wait(200)
    }
    console.log('Swap-58', receipt)
    try {
      await swap(token1, token1Value, to, pair)
    }catch(err) {
      console.error("Switch error: ", err)
      //TODO: manually revert is not right
      const resutl = await withDrawToken0(pair, token0, to, token0Value);
      console.log('Swap-65-resutl', resutl)
    }
  }

  const disabled = parseFloat(token0Value)* parseFloat(token1Value) <= 0
  return <Card sx={{padding: '20px'}}>
    <Typography variant='h4'>Swap</Typography>
      <TokenForm token={token0} onTokenChange={token0ChangeHandler}  tokenValue={token0Value} onTokenValueChange={token0ValueChangeHandler} />
      <TokenForm disabled token={token1} onTokenChange={token1ChangeHandler}  tokenValue={token1Value} onTokenValueChange={token1ValueChangeHandler}/>
      <Button variant='outlined' onClick={swapHandler} disabled={disabled}>
        {disabled ? 'Please input value': 'Swap'}
      </Button>
  </Card>  
}

export default Swap