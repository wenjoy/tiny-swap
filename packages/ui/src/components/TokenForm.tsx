import { Card, CardContent, MenuItem, Select, TextField, Typography } from '@mui/material';
import Balance from './Balance';

// type TokenForm = {
//
// }
function TokenForm({ token }: {token: string}) {
  return <Card sx={{margin: "20px"}} variant='outlined'>
    <CardContent>
      <TextField id="token0-value" label="Value" />
      <Select>
        <MenuItem value="ETH">ETH</MenuItem>
        <MenuItem value="DAI">DAI</MenuItem>
      </Select>
      <Balance token={token} />
    </CardContent>
  </Card>
}

export default TokenForm
