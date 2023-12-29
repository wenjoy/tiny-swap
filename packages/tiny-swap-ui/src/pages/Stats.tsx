import styled from '@emotion/styled';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Balance from '../components/Balance';
import { getPairAddress, getReserves, tokenToAddress } from '../utils';
import { TOKEN_A, TOKEN_B } from '../utils/const';

function Stats() {
  const token0 = TOKEN_A;
  const token1 = TOKEN_B;
  const [accounts, setAccounts] = useState<string[]>([]);
  const [contracts, setContracts] = useState<string[]>([]);
  const [reserves, setReserves] = useState<BigInt[]>([]);
  const tokensName = [token0, token1, 'UNISWAP'];

  const { account } = useParams();
  console.log('Stats-29', account);

  useEffect(() => {
    async function fetchAddress() {
      const pair = await getPairAddress(token0, token1);
      const reserves = await getReserves(pair);
      const accounts = [pair];

      if (account) {
        accounts.push(account);
      }

      setAccounts(accounts);
      setContracts([tokenToAddress(token0), tokenToAddress(token1), pair]);
      setReserves(reserves);
    }
    fetchAddress().catch((err) => console.error(err));
  }, []);

  const StyledTableCell = styled(TableCell)(() => ({
    '&': {
      fontWeight: 700,
    },
  }));

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Token Name</TableCell>
            <TableCell align="right">Pair</TableCell>
            {account && <TableCell align="right">Account</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((contract, index) => (
            <TableRow key={contract}>
              <TableCell>{tokensName[index]}</TableCell>
              {accounts.map((account) => (
                <TableCell key={account} align="right">
                  <Balance token={contract} owner={account} simple />
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <StyledTableCell component={'th'}>Reserve0</StyledTableCell>
            <StyledTableCell component={'th'}>Reserve1</StyledTableCell>
          </TableRow>
          <TableRow>
            <TableCell>{reserves[0]?.toString()}</TableCell>
            <TableCell>{reserves[1]?.toString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Stats;
