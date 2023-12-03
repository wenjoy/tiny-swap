import { Card, CardContent, MenuItem, Select, TextField } from '@mui/material';
import { TOKEN, TOKENS } from '../utils';
import Balance from './Balance';

function TokenForm(
  { token, onTokenChange, onTokenValueChange }:
    {
      token: TOKEN,
      onTokenChange: (t: TOKEN) => void,
      onTokenValueChange: (v: number) => void
    },
) {
  return <Card sx={{ margin: "20px" }} variant='outlined'>
    <CardContent>
      <TextField id="token0-value" label="Value" onChange={event => onTokenValueChange(Number(event.target.value))} />
      <Select value={token} onChange={(event) => onTokenChange(event.target.value as TOKEN)}>
        {TOKENS.map(t => <MenuItem value={t} key={t}>{t}</MenuItem>)}
      </Select>
      <Balance token={token} />
    </CardContent>
  </Card>
}

export default TokenForm
