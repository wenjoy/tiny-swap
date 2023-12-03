import styled from '@emotion/styled'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { TOKEN, getOther, getPairAddress, getReserves, getSigner } from '../utils'
import Balance from './Balance'

function Stats() {
  const token0 = 'DAI'
  const token1 = 'DOGE'
  const account = getOther().address
  // const [pair, setPair] = useState('')
  // const [signer, setSigner] = useState('')
  const [accounts, setAccounts] = useState<string[]>([])
  const [contracts, setContracts] = useState<TOKEN[]|string[]>([])
  const [reserves, setServes] = useState<BigInt[]>([])
  console.log('Stats-15-reserves', reserves)

  useEffect(() => {
    async function fetchAddress() {
      const pair = await getPairAddress(token0, token1)
      const signer = await getSigner();
      const reserves = await getReserves(pair);
      // setPair(pair)
      // setSigner(signer.address)
      setAccounts([pair, signer.address, account])
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