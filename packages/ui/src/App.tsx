import './App.css';
import AddLiquidity from './components/AddLiquidity';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <span className="logo">Uniswap</span>
        <div className="menu">
        <span className="menu-item"><a href="/swap">Swap</a></span>
        <span className="menu-item"><a href="/pool">Pool</a></span>
        </div>
      </header>
      <section className="App-body">
        <AddLiquidity />
      </section>
    </div>
  );
}

export default App;
