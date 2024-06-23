pragma solidity =0.6.6;

import "./interfaces/ILiquidityValueCalculator.sol";
import "./interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "hardhat/console.sol";

contract LiquidityValueCalculator is ILiquidityValueCalculator {
    address public factory;

    constructor(address factory_) public {
        factory = factory_;
    }

    function pairInfo(
        address tokenA,
        address tokenB
    ) external view returns (uint reserveA, uint reserveB, uint totalSupply) {
        address pairAddress = UniswapV2Library.pairFor(factory, tokenA, tokenB);
        console.log("LiquidityValueCalculator-17", pairAddress);
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        totalSupply = pair.totalSupply();
        (uint reserves0, uint reserves1, ) = pair.getReserves();
        (reserveA, reserveB) = tokenA == pair.token0()
            ? (reserves0, reserves1)
            : (reserves1, reserves0);
    }

    function computeLiquidityShareValue(
        uint liquidity,
        address tokenA,
        address tokenB
    ) external override returns (uint tokenAAmount, uint tokenBAmount) {
        tokenAAmount = liquidity + IERC20(tokenA).balanceOf(address(this));
        tokenBAmount = liquidity + IERC20(tokenB).balanceOf(address(this));
    }
}
