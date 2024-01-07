import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat'
import { expect } from "chai";
import { createHash } from 'node:crypto'

function sha256(content: any) {  
  return createHash('sha256').update(content).digest('hex')
}

describe('liquidity value calculator', () => {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    
    const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    // console.log('LiquidityValueCalculator.test-11', sha256(UniswapV2Factory.bytecode))

    // const UniswapV2FactoryBytecode = require('@uniswap/v2-core/build/UniswapV2Factory.json').bytecode;
    // const UniswapV2Factory = await ethers.getContractFactory([], UniswapV2FactoryBytecode, owner);
    // console.log('LiquidityValueCalculator.test-12', sha256(UniswapV2FactoryBytecode));

    const LiquidityCalculator = await ethers.getContractFactory("LiquidityValueCalculator");
    const Token0 = await ethers.getContractFactory("ERC20");
    const Token1 = await ethers.getContractFactory("ERC20");
    const factory = await UniswapV2Factory.deploy(owner);
    const liquidityCalculator = await LiquidityCalculator.deploy(factory);
    const token0 = await Token0.deploy();
    const token1 = await Token1.deploy();
    
    //@ts-ignore
    await factory.createPair(token0, token1);
    //@ts-ignore
    const pairAddress = await factory.getPair(token0, token1);

    return { liquidityCalculator, pairAddress, token0, token1, owner, otherAccount };
  } 
  
  it('should calculate liquidity', async () => {
    const {liquidityCalculator, token0, token1, pairAddress} = await loadFixture(deployFixture);
    console.log('LiquidityValueCalculator.test-26', pairAddress);
    const result = await liquidityCalculator.pairInfo(token0, token1);
    const [ reserveA, reserveB, totalSupply ] = result;
    expect(reserveA).to.eql(0);
    expect(reserveB).to.eql(0);
    expect(totalSupply).to.eql(0);
  })
})