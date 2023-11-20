import Panel from './Panel'
import TokenForm from './TokenForm'

function AddLiquidity () {
  return <div className='AddLiquidity'>
    <Panel>
      <header>Add liquidity</header>
      <TokenForm />
    </Panel>
  </div>
}
export default AddLiquidity