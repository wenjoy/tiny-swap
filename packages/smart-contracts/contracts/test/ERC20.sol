pragma solidity 0.5.16;
import '../UniswapV2ERC20.sol';
 
contract ERC20 is UniswapV2ERC20 {
  function mint(uint value) public {
    _mint(msg.sender, value);
  }
  function mintArbitary(address to, uint value) public {
    _mint(to, value);
  }
}