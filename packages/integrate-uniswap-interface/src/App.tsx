import './App.css';
import { useQuery, gql } from '@apollo/client'
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const DAI_QUERY = gql`
query tokens($tokenAddress: Bytes!) {
  tokens(where: { id: $tokenAddress }) {
    derivedETH
    totalLiquidity
  }
}
`

const ETH_PRICE_QUERY = gql`
query bundles {
  bundles(id: "2") {
    ethPrice
  }
}
`

loadDevMessages();
loadErrorMessages();


function App() {
  const { loading, error, data: ethPriceData } = useQuery(ETH_PRICE_QUERY);
  const {
    loading: daiLoading,
    error: daiError,
    data: daiData,
  } = useQuery(DAI_QUERY, {
    variables: {
      tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f'
    }
  });

  const daiPriceInEth = daiData && daiData.tokens[0].derivedETH
  const daiTotalLiquidity = daiData && daiData.tokens[0].totalLiquidity
  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice

  return (
    <div className="App">
      <div>
        Dai price: {' '}
        {loading || daiLoading ? 'Loading token data...' : '$' + (parseFloat(daiPriceInEth) * parseFloat(ethPriceInUSD)).toFixed(2)}
      </div>
      <div>
        Dai total liquidity: {' '}
        {daiLoading ? 'Loading token data...' : '$' + parseFloat(daiTotalLiquidity).toFixed(0)}
      </div>
      <iframe
        src="https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f"
        height="660px"
        width="100%"
        /> </div>); }
export default App;
