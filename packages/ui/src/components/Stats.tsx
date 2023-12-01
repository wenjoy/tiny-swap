import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { getOther, getPairAddress, getReserves, getSigner } from '../utils'
import Balance from './Balance'

function Stats() {
  const token0Address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const token1Address = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
  const account = getOther().address
  // const [pair, setPair] = useState('')
  // const [signer, setSigner] = useState('')
  const [accounts, setAccounts] = useState<string[]>([])
  const [contracts, setContracts] = useState<string[]>([])
  const [reserves, setServes] = useState<BigInt[]>([])
  console.log('Stats-15-reserves', reserves)

  useEffect(() => {
    async function fetchAddress() {
      const pair = await getPairAddress(token0Address, token1Address)
      const signer = await getSigner();
      const reserves = await getReserves(pair);
      // setPair(pair)
      // setSigner(signer.address)
      setAccounts([pair, signer.address, account])
      setContracts([token0Address, token1Address, pair])
      setServes(reserves)
    }
    fetchAddress().catch(err => console.error(err))
  }, [])
  
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
          {contracts.map((contract) => <TableRow>
              {
                accounts.map((account) => <TableCell>
                      <Balance token={contract} owner={account} />
                  </TableCell>
                )
              }
            </TableRow>
          )}
          <TableRow>
            <TableCell>{reserves[0]?.toString()}</TableCell>
            <TableCell>{reserves[1]?.toString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>      
    </TableContainer>
}

export default Stats