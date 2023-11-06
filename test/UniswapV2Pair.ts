import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { UniswapV2Pair } from '../typechain-types';

describe("UniswapV2Pair", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    // console.log('UniswapV2Pair-16', owner); console.log('other account', otherAccount);

    const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
    const pair = await UniswapV2Pair.deploy();

    return { pair, owner, otherAccount };
  }
  
  async function initilizeFixture() {
      const { pair, owner, otherAccount } = await loadFixture(deployFixture);
      const Token = await ethers.getContractFactory('ERC20');
      const token0 = await Token.deploy();
      const token1 = await Token.deploy();
      await pair.initialize(token0, token1);
      return {pair, owner, otherAccount, token0, token1};
  }

  async function deployFactoryFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.deploy(owner);

    return { factory, owner, otherAccount };
  }
  
  async function deployPairByFactory() {
    const {factory, owner, otherAccount} = await deployFactoryFixture();
    const Token = await ethers.getContractFactory('ERC20');
    const Pair = await ethers.getContractFactory('UniswapV2Pair');
    const token0 = await Token.deploy();
    const token1 = await Token.deploy();
    await factory.createPair(token0, token1);
    const pariAddress = await factory.getPair(token0, token1);
    const pair = (await Pair.attach(pariAddress)) as UniswapV2Pair;
    return { pair, token0, token1, owner, otherAccount};;
  }

  describe("Deployment", function () {
    it("Should depoly the contract", async function () {
      const { pair, owner } = await loadFixture(deployFixture);

      expect(await pair.factory()).to.equal(owner.address);
    });
  });

  describe("Mint", function () {
    it("Should reverted without message if try to mint without initializing", async function () {
      const { pair, owner } = await loadFixture(deployFixture);
      const { _reserve0, _reserve1} = await  pair.getReserves();

      expect(_reserve0.toString()).to.equal('0');
      expect(_reserve1.toString()).to.equal('0');
      expect((await pair.totalSupply()).toString()).to.eql('0');

      await expect(pair.mint(owner.address)).to.be.revertedWithoutReason();
    });

    it("Should reverted without message if try to mint without deploying the pair contract by factory ", async function () {
      const { pair, token0, token1, owner } = await loadFixture(initilizeFixture);

      expect(await pair.token0()).to.equal(await token0.getAddress());
      expect(await pair.token1()).to.equal(await token1.getAddress());
      const { _reserve0, _reserve1} = await  pair.getReserves();

      expect(_reserve0.toString()).to.equal('0');
      expect(_reserve1.toString()).to.equal('0');
      expect((await pair.totalSupply()).toString()).to.eql('0');

      await expect(pair.mint(owner.address)).to.be.revertedWithoutReason();
    });

    it("Should reverted because underflow if try to mint without transforming tokek to pair", async function () {
      const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

      expect(await pair.token0()).to.equal(await token0.getAddress());
      expect(await pair.token1()).to.equal(await token1.getAddress());
      const { _reserve0, _reserve1} = await  pair.getReserves();

      expect(_reserve0.toString()).to.equal('0');
      expect(_reserve1.toString()).to.equal('0');
      expect((await pair.totalSupply()).toString()).to.eql('0');

      await expect(pair.mint(owner.address)).to.be.revertedWith("ds-math-subsub-underflow");
    });

    it("Should reverted because underflow if try to mint without sufficient transforming tokek to pair", async function () {
      const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

      expect(await pair.token0()).to.equal(await token0.getAddress());
      expect(await pair.token1()).to.equal(await token1.getAddress());
      const { _reserve0, _reserve1} = await  pair.getReserves();

      expect(_reserve0.toString()).to.equal('0');
      expect(_reserve1.toString()).to.equal('0');
      expect((await pair.totalSupply()).toString()).to.eql('0');

      await token0.mint(50);
      expect(await token0.totalSupply()).to.be.eql(BigInt(50));
      expect(await token0.balanceOf(owner)).to.be.eql(BigInt(50));
      await token1.mint(50);
      expect(await token1.totalSupply()).to.be.eql(BigInt(50));
      expect(await token1.balanceOf(owner)).to.be.eql(BigInt(50));
      
      
      const pariAddress = await pair.getAddress(); 
      expect(await token0.balanceOf(pariAddress)).to.be.eql(BigInt(0));
      expect(await token1.balanceOf(pariAddress)).to.be.eql(BigInt(0));

      await token0.transfer(pariAddress, 20);
      await token1.transfer(pariAddress, 40);

      expect(await token0.balanceOf(pariAddress)).to.be.eql(BigInt(20));
      expect(await token1.balanceOf(pariAddress)).to.be.eql(BigInt(40));

      await expect(pair.mint(owner.address)).to.be.revertedWith("ds-math-subsub-underflow");
    });

    it("Should reverted because insufficient liquidity if try to mint without sufficient transforming tokek to pair", async function () {
      const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

      expect(await pair.token0()).to.equal(await token0.getAddress());
      expect(await pair.token1()).to.equal(await token1.getAddress());
      const { _reserve0, _reserve1} = await  pair.getReserves();

      expect(_reserve0.toString()).to.equal('0');
      expect(_reserve1.toString()).to.equal('0');
      expect((await pair.totalSupply()).toString()).to.eql('0');

      await token0.mint(1000);
      expect(await token0.totalSupply()).to.be.eql(BigInt(1000));
      expect(await token0.balanceOf(owner)).to.be.eql(BigInt(1000));
      await token1.mint(1000);
      expect(await token1.totalSupply()).to.be.eql(BigInt(1000));
      expect(await token1.balanceOf(owner)).to.be.eql(BigInt(1000));
      
      
      const pariAddress = await pair.getAddress(); 
      expect(await token0.balanceOf(pariAddress)).to.be.eql(BigInt(0));
      expect(await token1.balanceOf(pariAddress)).to.be.eql(BigInt(0));

      await token0.transfer(pariAddress, 1000);
      await token1.transfer(pariAddress, 1000);

      expect(await token0.balanceOf(pariAddress)).to.be.eql(BigInt(1000));
      expect(await token1.balanceOf(pariAddress)).to.be.eql(BigInt(1000));

      await expect(pair.mint(owner.address)).to.be.revertedWith("UniswapV2: INSUFFICIENT_LIQUIDITY_MINTED");
    });

    it("Should be successful if meet minimum liquidity", async function () {
      const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

      expect(await pair.token0()).to.equal(await token0.getAddress());
      expect(await pair.token1()).to.equal(await token1.getAddress());

      const { _reserve0, _reserve1} = await  pair.getReserves();
      expect(_reserve0.toString()).to.equal('0');
      expect(_reserve1.toString()).to.equal('0');
      expect(await pair.totalSupply()).to.eql(BigInt(0));

      await token0.mint(2000);
      expect(await token0.totalSupply()).to.be.eql(BigInt(2000));
      expect(await token0.balanceOf(owner)).to.be.eql(BigInt(2000));
      await token1.mint(2000);
      expect(await token1.totalSupply()).to.be.eql(BigInt(2000));
      expect(await token1.balanceOf(owner)).to.be.eql(BigInt(2000));
      
      
      const pariAddress = await pair.getAddress(); 
      expect(await token0.balanceOf(pariAddress)).to.be.eql(BigInt(0));
      expect(await token1.balanceOf(pariAddress)).to.be.eql(BigInt(0));

      await token0.transfer(pariAddress, 1200);
      await token1.transfer(pariAddress, 1200);

      expect(await token0.balanceOf(pariAddress)).to.be.eql(BigInt(1200));
      expect(await token1.balanceOf(pariAddress)).to.be.eql(BigInt(1200));

      expect(await pair.totalSupply()).to.be.eql(BigInt(0));
      expect(await pair.mint(owner.address)).to.emit(pair, 'Mint').withArgs(owner, 1200, 1200);
      expect(await pair.totalSupply()).to.be.eql(BigInt(1200));
    });
  });
  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployFixture
  //       );
  //
  //       await time.increaseTo(unlockTime);
  //
  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
