import { Button, Card, CardActions, CardContent } from '@mui/material'
import TokenForm from '../components/TokenForm'
import { TOKEN } from '../utils'

function TokenPair({
  token0,
  token0Value,
  token0ChangeHandler,
  token0ValueChangeHandler,
  token1,
  token1Value,
  token1ChangeHandler,
  token1ValueChangeHandler,
  submitHandler,
  submitButtonText,
  lock
}: {
  token0: TOKEN,
  token0Value: string,
  token0ChangeHandler: (token: TOKEN) => void,
  token0ValueChangeHandler: (value: string) => void,
  token1: TOKEN,
  token1Value: string,
  token1ChangeHandler: (token: TOKEN) => void,
  token1ValueChangeHandler: (value: string) => void,
  submitHandler: () => void,
  submitButtonText: string,
  lock?: boolean
}) {
  const token0Number = parseFloat(token0Value)
  const token1Number = parseFloat(token1Value)
  const disabled = Number.isNaN(token0Number) || Number.isNaN(token0Number) || token0Number * token1Number <= 0

  return <Card sx={{ minWidth: 275, maxWidth: 475, pb: '20px' }}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TokenForm token={token0} onTokenChange={token0ChangeHandler} tokenValue={token0Value} onTokenValueChange={token0ValueChangeHandler} />
      <TokenForm disabled={lock} token={token1} onTokenChange={token1ChangeHandler} tokenValue={token1Value} onTokenValueChange={token1ValueChangeHandler} />
    </CardContent>

    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button variant='outlined' onClick={submitHandler} disabled={disabled}>
        {disabled ? 'Please input value' : submitButtonText}
      </Button>
    </CardActions>
  </Card>
}

export default TokenPair