import {
  Box,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { tokenToAddress } from '../utils';
import { TOKEN, TOKENS } from '../utils/const';
import Balance from './Balance';

function TokenForm({
  token,
  onTokenChange,
  tokenValue,
  onTokenValueChange,
  disabled,
  loading,
}: {
  token: TOKEN;
  onTokenChange: (t: TOKEN) => void;
  tokenValue: string;
  onTokenValueChange: (v: string) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const handleInput = () => {};
  return (
    <Box sx={{ margin: '10px 0' }}>
      <FormControl sx={{ width: { xs: '100%', sm: 'auto' }, mb: { xs: 1 } }}>
        <InputLabel htmlFor="token-value">Amount</InputLabel>
        <OutlinedInput
          sx={{ mr: 2, width: { xs: '100%', sm: 200 } }}
          disabled={disabled || loading}
          placeholder="0.0"
          id="token-value"
          type="number"
          label="Amount"
          value={tokenValue}
          inputProps={{
            min: 0,
          }}
          endAdornment={
            loading ? (
              <InputAdornment position="end">
                <CircularProgress color="inherit" size={20} />
              </InputAdornment>
            ) : null
          }
          onKeyDown={(event) => {
            if (['-', '+'].includes(event.key)) {
              event.preventDefault();
            }
          }} //only allow positive number
          onChange={(event) => onTokenValueChange(event.target.value)}
        />
      </FormControl>
      <Select
        sx={{ width: { xs: '100%', sm: 'auto' } }}
        value={token}
        onChange={(event) => onTokenChange(event.target.value as TOKEN)}
      >
        {TOKENS.map((t) => (
          <MenuItem value={t} key={t}>
            {t}
          </MenuItem>
        ))}
      </Select>
      <Balance token={tokenToAddress(token)} />
    </Box>
  );
}

export default TokenForm;
