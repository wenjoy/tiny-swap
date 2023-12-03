import styled from '@emotion/styled'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { TOKEN, getPairAddress, getReserves } from '../utils'
import Balance from './Balance'

function Stats() {
  const token0 = 'DAI'
  const token1 = 'DOGE'
  const account1 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  const account2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
  const [accounts, setAccounts] = useState<string[]>([])
  const [contracts, setContracts] = useState<TOKEN[]|string[]>([])
  const [reserves, setServes] = useState<BigInt[]>([])
  console.log('Stats-15-reserves', reserves)

  useEffect(() => {
    async function fetchAddress() {
      const pair = await getPairAddress(token0, token1)
      const reserves = await getReserves(pair);
      setAccounts([pair, account1, account2])
      setContracts([token0, token1, pair])
      setServes(reserves)
    }
    fetchAddress().catch(err => console.error(err))
  }, [])
  
  const StyledTableCell = styled(TableCell)(() => ({
    '&': {
      fontWeight: 700,
    }
  }))
  
  return <TableContainer component={Paper}>
      <Table sx={{minWidth: 500}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Pair</TableCell>            
            <TableCell>Account1</TableCell>            
            <TableCell>Account2</TableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((contract) => <TableRow key={contract}>
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