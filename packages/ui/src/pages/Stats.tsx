import styled from '@emotion/styled'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import Balance from '../components/Balance'
import { getPairAddress, getReserves, tokenToAddress } from '../utils'
import { TOKEN_A, TOKEN_B } from '../utils/const'

function Stats({ refresh }: { refresh?: number }) {
  const token0 = TOKEN_A
  const token1 = TOKEN_B
  const account1 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  const account2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
  const [accounts, setAccounts] = useState<string[]>([])
  const [contracts, setContracts] = useState<string[]>([])
  const [reserves, setReserves] = useState<BigInt[]>([])
  const tokensName = [token0, token1, 'UNISWAP']

  useEffect(() => {
    async function fetchAddress() {
      const pair = await getPairAddress(token0, token1)
      const reserves = await getReserves(pair);
      setAccounts([pair, account1, account2])
      setContracts([tokenToAddress(token0), tokenToAddress(token1), pair])
      setReserves(reserves)
    }
    fetchAddress().catch(err => console.error(err))
  }, [refresh])

  const StyledTableCell = styled(TableCell)(() => ({
    '&': {
      fontWeight: 700,
    }
  }))

  return <TableContainer component={Paper} sx={{ mt: 2 }}>
    <Table sx={{ minWidth: 500 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Pair</TableCell>
          <TableCell>Account1</TableCell>
          <TableCell>Account2</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {contracts.map((contract, index) => <TableRow key={contract}>
          <TableCell>{tokensName[index]}</TableCell>
          {
            accounts.map((account) => <TableCell key={account}>
              <Balance token={contract} owner={account} simple />
            </TableCell>
            )
          }
        </TableRow>
        )}
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
}

export default Stats