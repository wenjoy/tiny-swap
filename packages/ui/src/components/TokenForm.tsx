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
  return (
    <Box sx={{ margin: '10px 0' }}>
      <FormControl>
        <InputLabel htmlFor="token-value">Amount</InputLabel>
        <OutlinedInput
          sx={{ mr: 2, width: 200 }}
          disabled={disabled || loading}
          placeholder="0.0"
          id="token-value"
          type="number"
          label="Amount"
          value={tokenValue}
          endAdornment={
            loading ? (
              <InputAdornment position="end">
                <CircularProgress color="inherit" size={20} />
              </InputAdornment>
            ) : null
          }
          onChange={(event) => onTokenValueChange(event.target.value)}
        />
      </FormControl>
      <Select
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
