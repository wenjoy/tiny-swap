import { Card, CardContent, MenuItem, Select, TextField, Typography } from '@mui/material';

// type TokenForm = {
//
// }
function TokenForm() {
  return <Card sx={{margin: "20px"}} variant='outlined'>
    <CardContent>
      <TextField id="token0-value" label="Value" />
      <Select>
        <MenuItem value="ETH">ETH</MenuItem>
        <MenuItem value="DAI">DAI</MenuItem>
      </Select>
      <Typography>Balance: 0</Typography>
    </CardContent>
  </Card>
}

export default TokenForm
