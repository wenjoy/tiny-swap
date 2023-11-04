pragma solidity=0.5.16;

//TODO: can't understand
library UQ112x112 {
  uint224 constant Q112 = 2**112;

  function encode(uint112 y) internal pure returns (uint224 z) {
    z = uint224(y) * Q112;
  }
  
  function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
    z = x /uint224(y);
  }
}