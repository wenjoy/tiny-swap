import { Box, MenuItem, Select, TextField } from '@mui/material';
import { tokenToAddress } from '../utils';
import { TOKEN, TOKENS } from '../utils/const';
import Balance from './Balance';

function TokenForm(
  { token, onTokenChange, tokenValue, onTokenValueChange, disabled }:
    {
      token: TOKEN,
      onTokenChange: (t: TOKEN) => void,
      tokenValue: string,
      onTokenValueChange: (v: string) => void,
      disabled?: boolean
    },
) {
  return <Box sx={{ margin: "10px 0" }}>
    <TextField sx={{ mr: 2 }} disabled={disabled} placeholder='0.0' id="token0-value" label="Amount" type="number" value={tokenValue} onChange={event => onTokenValueChange(event.target.value)} />
    <Select value={token} onChange={(event) => onTokenChange(event.target.value as TOKEN)}>
      {TOKENS.map(t => <MenuItem value={t} key={t}>{t}</MenuItem>)}
    </Select>
    <Balance token={tokenToAddress(token)} />
  </Box>
}

export default TokenForm
