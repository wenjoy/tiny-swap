import {
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
    return { pair, owner, otherAccount, token0, token1 };
  }

  async function deployFactoryFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.deploy(owner);

    return { factory, owner, otherAccount };
  }

  async function deployPairByFactory() {
    const { factory, owner, otherAccount } = await deployFactoryFixture();
    const Token = await ethers.getContractFactory('ERC20');
    const Pair = await ethers.getContractFactory('UniswapV2Pair');
    const token0 = await Token.deploy();
    const token1 = await Token.deploy();
    await factory.createPair(token0, token1);
    const pairAddress = await factory.getPair(token0, token1);
    const pair = (await Pair.attach(pairAddress)) as UniswapV2Pair;
    return { pair, token0, token1, factory, owner, otherAccount };;
  }

  async function deployPairByFactoryAndMint() {
    const { factory, owner, otherAccount } = await deployFactoryFixture();
    const Token = await ethers.getContractFactory('ERC20');
    const Pair = await ethers.getContractFactory('UniswapV2Pair');
    const token0 = await Token.deploy();
    const token1 = await Token.deploy();
    await factory.createPair(token0, token1);
    const pairAddress = await factory.getPair(token0, token1);
    const pair = (await Pair.attach(pairAddress)) as UniswapV2Pair;
    await token0.mint(2000);
    await token1.mint(2000);
    await token0.transfer(pairAddress, 1200);
    await token1.transfer(pairAddress, 1200);

    await factory.setFeeTo(pairAddress);
    await pair.mint(await pair.getAddress());
    return { pair, token0, token1, factory, owner, otherAccount };;
  }

  describe("Deployment", function () {
    it("Should depoly the contract", async function () {
      const { pair, owner } = await loadFixture(deployFixture);

      expect(await pair.factory()).to.equal(owner.address);
    });
  });

  describe("Mint", function () {
    describe("First time mint", () => {
      it("Should reverted without message if try to mint without initializing", async function () {
        const { pair, owner } = await loadFixture(deployFixture);
        const { _reserve0, _reserve1 } = await pair.getReserves();

        expect(_reserve0.toString()).to.equal('0');
        expect(_reserve1.toString()).to.equal('0');
        expect((await pair.totalSupply()).toString()).to.eql('0');

        await expect(pair.mint(owner.address)).to.be.revertedWithoutReason();
      });

      it("Should reverted without message if try to mint without deploying the pair contract by factory ", async function () {
        const { pair, token0, token1, owner } = await loadFixture(initilizeFixture);

        expect(await pair.token0()).to.equal(await token0.getAddress());
        expect(await pair.token1()).to.equal(await token1.getAddress());
        const { _reserve0, _reserve1 } = await pair.getReserves();

        expect(_reserve0.toString()).to.equal('0');
        expect(_reserve1.toString()).to.equal('0');
        expect((await pair.totalSupply()).toString()).to.eql('0');

        await expect(pair.mint(owner.address)).to.be.revertedWithoutReason();
      });

      it("Should reverted because underflow if try to mint without transforming tokek to pair", async function () {
        const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

        expect(await pair.token0()).to.equal(await token0.getAddress());
        expect(await pair.token1()).to.equal(await token1.getAddress());
        const { _reserve0, _reserve1 } = await pair.getReserves();

        expect(_reserve0.toString()).to.equal('0');
        expect(_reserve1.toString()).to.equal('0');
        expect((await pair.totalSupply()).toString()).to.eql('0');

        await expect(pair.mint(owner.address)).to.be.revertedWith("ds-math-subsub-underflow");
      });

      it("Should reverted because underflow if try to mint without sufficient transforming tokek to pair", async function () {
        const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

        expect(await pair.token0()).to.equal(await token0.getAddress());
        expect(await pair.token1()).to.equal(await token1.getAddress());
        const { _reserve0, _reserve1 } = await pair.getReserves();

        expect(_reserve0.toString()).to.equal('0');
        expect(_reserve1.toString()).to.equal('0');
        expect((await pair.totalSupply()).toString()).to.eql('0');

        await token0.mint(50);
        expect(await token0.totalSupply()).to.be.eql(BigInt(50));
        expect(await token0.balanceOf(owner)).to.be.eql(BigInt(50));
        await token1.mint(50);
        expect(await token1.totalSupply()).to.be.eql(BigInt(50));
        expect(await token1.balanceOf(owner)).to.be.eql(BigInt(50));


        const pairAddress = await pair.getAddress();
        expect(await token0.balanceOf(pairAddress)).to.be.eql(BigInt(0));
        expect(await token1.balanceOf(pairAddress)).to.be.eql(BigInt(0));

        await token0.transfer(pairAddress, 20);
        await token1.transfer(pairAddress, 40);

        expect(await token0.balanceOf(pairAddress)).to.be.eql(BigInt(20));
        expect(await token1.balanceOf(pairAddress)).to.be.eql(BigInt(40));

        await expect(pair.mint(owner.address)).to.be.revertedWith("ds-math-subsub-underflow");
      });

      it("Should reverted because insufficient liquidity if try to mint without sufficient transforming tokek to pair", async function () {
        const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

        expect(await pair.token0()).to.equal(await token0.getAddress());
        expect(await pair.token1()).to.equal(await token1.getAddress());
        const { _reserve0, _reserve1 } = await pair.getReserves();

        expect(_reserve0.toString()).to.equal('0');
        expect(_reserve1.toString()).to.equal('0');
        expect((await pair.totalSupply()).toString()).to.eql('0');

        await token0.mint(1000);
        expect(await token0.totalSupply()).to.be.eql(BigInt(1000));
        expect(await token0.balanceOf(owner)).to.be.eql(BigInt(1000));
        await token1.mint(1000);
        expect(await token1.totalSupply()).to.be.eql(BigInt(1000));
        expect(await token1.balanceOf(owner)).to.be.eql(BigInt(1000));


        const pairAddress = await pair.getAddress();
        expect(await token0.balanceOf(pairAddress)).to.be.eql(BigInt(0));
        expect(await token1.balanceOf(pairAddress)).to.be.eql(BigInt(0));

        await token0.transfer(pairAddress, 1000);
        await token1.transfer(pairAddress, 1000);

        expect(await token0.balanceOf(pairAddress)).to.be.eql(BigInt(1000));
        expect(await token1.balanceOf(pairAddress)).to.be.eql(BigInt(1000));

        await expect(pair.mint(owner.address)).to.be.revertedWith("UniswapV2: INSUFFICIENT_LIQUIDITY_MINTED");
      });

      it("Should be successful if meet minimum liquidity", async function () {
        const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

        expect(await pair.token0()).to.equal(await token0.getAddress());
        expect(await pair.token1()).to.equal(await token1.getAddress());

        const { _reserve0, _reserve1 } = await pair.getReserves();
        expect(_reserve0.toString()).to.equal('0');
        expect(_reserve1.toString()).to.equal('0');
        expect(await pair.totalSupply()).to.eql(BigInt(0));

        await token0.mint(2000);
        expect(await token0.totalSupply()).to.be.eql(BigInt(2000));
        expect(await token0.balanceOf(owner)).to.be.eql(BigInt(2000));
        await token1.mint(2000);
        expect(await token1.totalSupply()).to.be.eql(BigInt(2000));
        expect(await token1.balanceOf(owner)).to.be.eql(BigInt(2000));


        const pairAddress = await pair.getAddress();
        expect(await token0.balanceOf(pairAddress)).to.be.eql(BigInt(0));
        expect(await token1.balanceOf(pairAddress)).to.be.eql(BigInt(0));

        await token0.transfer(pairAddress, 1200);
        await token1.transfer(pairAddress, 1200);

        expect(await token0.balanceOf(pairAddress)).to.be.eql(BigInt(1200));
        expect(await token1.balanceOf(pairAddress)).to.be.eql(BigInt(1200));

        expect(await pair.totalSupply()).to.be.eql(BigInt(0));
        await expect(pair.mint(owner.address)).to.emit(pair, 'Mint').withArgs(owner.address, 1200, 1200);
        expect(await pair.totalSupply()).to.be.eql(BigInt(1200));
      });

      it("Should change reserves", async function () {
        const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

        expect(await pair.token0()).to.equal(await token0.getAddress());
        expect(await pair.token1()).to.equal(await token1.getAddress());

        let { _reserve0, _reserve1 } = await pair.getReserves();
        expect(_reserve0).to.equal(BigInt(0));
        expect(_reserve1).to.equal(BigInt(0));

        await token0.mint(2000);
        await token1.mint(2000);
        const pairAddress = await pair.getAddress();
        await token0.transfer(pairAddress, 1200);
        await token1.transfer(pairAddress, 1200);

        await expect(pair.mint(owner.address)).to.emit(pair, 'Mint').withArgs(owner.address, 1200, 1200);

        ({ _reserve0, _reserve1 } = await pair.getReserves());
        expect(_reserve0).to.equal(BigInt(1200));
        expect(_reserve1).to.equal(BigInt(1200));
      });

      it("Should set K as 0 if not set feeto", async function () {
        const { pair, token0, token1, owner } = await loadFixture(deployPairByFactory);

        expect(await pair.token0()).to.equal(await token0.getAddress());
        expect(await pair.token1()).to.equal(await token1.getAddress());

        const { _reserve0, _reserve1 } = await pair.getReserves();
        expect(_reserve0).to.equal(BigInt(0));
        expect(_reserve1).to.equal(BigInt(0));

        await token0.mint(2000);
        await token1.mint(2000);
        const pairAddress = await pair.getAddress();
        await token0.transfer(pairAddress, 1200);
        await token1.transfer(pairAddress, 1200);

        await expect(pair.mint(owner.address)).to.emit(pair, 'Mint').withArgs(owner.address, 1200, 1200);

        expect(await pair.kLast()).to.equal(BigInt(0));
      });

      it("Should set K properly", async function () {
        const { pair, token0, token1, owner, factory } = await loadFixture(deployPairByFactory);

        expect(await pair.token0()).to.equal(await token0.getAddress());
        expect(await pair.token1()).to.equal(await token1.getAddress());

        const { _reserve0, _reserve1 } = await pair.getReserves();
        expect(_reserve0).to.equal(BigInt(0));
        expect(_reserve1).to.equal(BigInt(0));

        await token0.mint(2000);
        await token1.mint(2000);
        const pairAddress = await pair.getAddress();
        await token0.transfer(pairAddress, 1200);
        await token1.transfer(pairAddress, 1200);

        factory.setFeeTo(pairAddress);
        await expect(pair.mint(owner.address)).to.emit(pair, 'Mint').withArgs(owner.address, 1200, 1200);

        expect(await pair.kLast()).to.equal(BigInt(1440000));
        expect(await pair.totalSupply()).to.equal(BigInt(1200));
      });
    })

    describe("Second time mint", () => {
      it("should set liquidity", async () => {
        const { pair, token0, token1, owner } = await loadFixture(deployPairByFactoryAndMint);
        let { _reserve0, _reserve1 } = await pair.getReserves();
        expect(_reserve0).to.equal(BigInt(1200));
        expect(_reserve1).to.equal(BigInt(1200));
        expect(await pair.totalSupply()).to.equal(BigInt(1200));

        await token0.mint(1000);
        await token1.mint(1200);
        const pairAddress = await pair.getAddress();
        await token0.transfer(pairAddress, 1000);
        await token1.transfer(pairAddress, 1200);
        const transaction = pair.mint(owner.address)
        await expect(transaction).to.emit(pair, 'Mint').withArgs(owner.address, 1000, 1200);
        await expect(transaction).to.emit(pair, 'Sync').withArgs(2200, 2400);

        ({ _reserve0, _reserve1 } = await pair.getReserves());
        expect(await pair.totalSupply()).to.equal(BigInt(2200));
        expect(_reserve0).to.equal(BigInt(2200));
        expect(_reserve1).to.equal(BigInt(2400));

        expect(await pair.kLast()).to.equal(BigInt(2200 * 2400));
      })
    })
  });

  describe.only("Burn", () => {
    it.skip("should revert with error INSUFFICIENT_LIQUIDITY_BURNED", async () => {
      const { pair, owner } = await loadFixture(deployPairByFactoryAndMint);
      let { _reserve0, _reserve1 } = await pair.getReserves();
      expect(_reserve0).to.equal(BigInt(1200));
      expect(_reserve1).to.equal(BigInt(1200));
      expect(await pair.totalSupply()).to.equal(BigInt(1200));

      await expect(pair.burn(owner.address)).to.revertedWith('UniswapV2: INSUFFICIENT_LIQUIDITY_BURNED');
    });

    it.skip("should revert with error TRANSFER_FAILED", async () => {
      const { pair, token0, token1, owner } = await loadFixture(deployPairByFactoryAndMint);
      let { _reserve0, _reserve1 } = await pair.getReserves();
      expect(_reserve0).to.equal(BigInt(1200));
      expect(_reserve1).to.equal(BigInt(1200));
      expect(await pair.totalSupply()).to.equal(BigInt(1200));

      await expect(pair.burn(owner.address)).to.revertedWith('UniswapV2: TRANSFER_FAILED');
      expect(await pair.totalSupply()).to.equal(0);
    });

    it("should reduce total supply", async () => {
      const { pair, token0, token1, owner } = await loadFixture(deployPairByFactoryAndMint);
      let { _reserve0, _reserve1 } = await pair.getReserves();
      expect(_reserve0).to.equal(BigInt(1200));
      expect(_reserve1).to.equal(BigInt(1200));
      expect(await pair.totalSupply()).to.equal(BigInt(1200));
      
      expect(await token0.balanceOf(owner.address)).to.eql(BigInt(800));
      expect(await token1.balanceOf(owner.address)).to.eql(BigInt(800));
      
      const transaction = pair.burn(owner.address);

      await expect(transaction).to.emit(pair, 'Transfer').withArgs(await pair.getAddress(), ethers.ZeroAddress, 200);
      await expect(transaction).to.emit(pair, 'Burn').withArgs(owner.address, 200, 200, owner.address);

      expect(await pair.totalSupply()).to.equal(BigInt(1000));
      expect(await token0.balanceOf(owner.address)).to.eql(BigInt(1000));
      expect(await token1.balanceOf(owner.address)).to.eql(BigInt(1000));

      ({ _reserve0, _reserve1 } = await pair.getReserves());
      expect(_reserve0).to.equal(BigInt(1000));
      expect(_reserve1).to.equal(BigInt(1000));
    });
  });

  describe("Swap", () => {
    it.skip('should revert with error INSUFFICIENT_OUTPUT_AMOUNT', async () => {
      const { pair, owner } = await loadFixture(deployPairByFactoryAndMint);
      await expect(pair.swap(-1, 0, owner.address, "0x00")).to.revertedWith('UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT');
    });

    it('should revert with error INSUFFICIENT_LIQUIDITY_BURNED', async () => {
      const { pair, owner } = await loadFixture(deployPairByFactoryAndMint);
      await expect(pair.swap(1201, 1201, owner.address, "0x00")).to.revertedWith('UniswapV2: INSUFFICIENT_LIQUIDITY');
    });

    it('should revert with error INVALID_ID', async () => {
      const { pair, token0 } = await loadFixture(deployPairByFactoryAndMint);
      await expect(pair.swap(1000, 1000, token0, "0x00")).to.revertedWith('UniswapV2: INVALID_ID');
    });

    it.skip('should revert with error TRANSFER_FAILED', async () => {
      //TODO: in which case this error occurs?
      const { pair, owner } = await loadFixture(deployPairByFactoryAndMint);
      await expect(pair.swap(1000, 1000, ethers.ZeroAddress, "0x")).to.revertedWith('UniswapV2: TRANSFER_FAILED');
    });

    it('should revert with error INSUFFICIENT_INPUT_AMOUNT', async () => {
      const { pair, owner, otherAccount, token0, token1 } = await loadFixture(deployPairByFactoryAndMint);
      expect(await token0.balanceOf(owner)).to.equal(800);
      expect(await token1.balanceOf(owner)).to.equal(800);

      expect(await token0.balanceOf(otherAccount)).to.equal(0);
      expect(await token1.balanceOf(otherAccount)).to.equal(0);
      await expect(pair.swap(1000, 1000, otherAccount, "0x")).to.revertedWith('UniswapV2: INSUFFICIENT_INPUT_AMOUNT');
    });

    it('should revert without error if target address failed to implement IUniswapV2Callee interface', async () => {
      const { pair } = await loadFixture(deployPairByFactoryAndMint);
      await expect(pair.swap(1000, 1000, pair, "0x00")).to.revertedWithoutReason();
    });

    it('should revert with error K', async () => {
      const { pair, owner, otherAccount, token0, token1 } = await loadFixture(deployPairByFactoryAndMint);
      expect(await token0.balanceOf(owner)).to.equal(800);
      expect(await token1.balanceOf(owner)).to.equal(800);
      expect(await token0.balanceOf(pair)).to.equal(1200);
      expect(await token1.balanceOf(pair)).to.equal(1200);
      expect(await token0.balanceOf(otherAccount)).to.equal(0);
      expect(await token1.balanceOf(otherAccount)).to.equal(0);

      const { _reserve0, _reserve1 } = await pair.getReserves();
      expect(_reserve0).to.eql(BigInt(1200));
      expect(_reserve1).to.eql(BigInt(1200));
      await expect(pair.swap(1100, 1100, pair, "0x")).to.revertedWith('UniswapV2: K');
    });

    it('should revert with error K, at edge case', async () => {
      const { pair, owner, token0, token1, otherAccount } = await loadFixture(deployPairByFactoryAndMint);
      expect(await token0.balanceOf(owner)).to.equal(800);
      expect(await token1.balanceOf(owner)).to.equal(800);
      expect(await token0.balanceOf(pair)).to.equal(1200);
      expect(await token1.balanceOf(pair)).to.equal(1200);

      let { _reserve0, _reserve1 } = await pair.getReserves();
      expect(_reserve0).to.eql(BigInt(1200));
      expect(_reserve1).to.eql(BigInt(1200));

      await token0.transfer(pair, 1);
      await token1.transfer(pair, 1);
      await expect(pair.swap(1000, 1000, pair, "0x")).to.revertedWith('UniswapV2: K');
    });

    it('should transfer token from pair contract', async () => {
      const { pair, owner, token0, token1, otherAccount } = await loadFixture(deployPairByFactoryAndMint);
      expect(await token0.balanceOf(owner)).to.equal(800);
      expect(await token1.balanceOf(owner)).to.equal(800);
      expect(await token0.balanceOf(pair)).to.equal(1200);
      expect(await token1.balanceOf(pair)).to.equal(1200);
      expect(await token0.balanceOf(otherAccount)).to.equal(0);
      expect(await token1.balanceOf(otherAccount)).to.equal(0);

      await token0.transfer(pair, 300);
      await token1.transfer(pair, 300);

      expect(await token0.balanceOf(owner)).to.equal(500);
      expect(await token1.balanceOf(owner)).to.equal(500);
      expect(await token0.balanceOf(pair)).to.equal(1500);
      expect(await token1.balanceOf(pair)).to.equal(1500);
      expect(await token0.balanceOf(otherAccount)).to.equal(0);
      expect(await token1.balanceOf(otherAccount)).to.equal(0);

      let { _reserve0, _reserve1 } = await pair.getReserves();
      expect(_reserve0).to.eql(BigInt(1200));
      expect(_reserve1).to.eql(BigInt(1200));
      //tranfer to otherAccount don't make sense
      await expect(pair.swap(100, 100, otherAccount, "0x")).to.emit(pair, 'Swap').withArgs(owner.address, 300, 300, 100, 100, otherAccount.address);

      ({ _reserve0, _reserve1 } = await pair.getReserves());
      expect(_reserve0).to.eql(BigInt(1400));
      expect(_reserve1).to.eql(BigInt(1400));

      expect(await token0.balanceOf(owner)).to.equal(500);
      expect(await token1.balanceOf(owner)).to.equal(500);
      expect(await token0.balanceOf(pair)).to.equal(1400);
      expect(await token1.balanceOf(pair)).to.equal(1400);
      expect(await token0.balanceOf(otherAccount)).to.equal(100);
      expect(await token1.balanceOf(otherAccount)).to.equal(100);
    });

    it('should transfer token from pair contract, to pair', async () => {
      const { pair, owner, token0, token1, otherAccount } = await loadFixture(deployPairByFactoryAndMint);
      expect(await token0.balanceOf(owner)).to.equal(800);
      expect(await token1.balanceOf(owner)).to.equal(800);
      expect(await token0.balanceOf(pair)).to.equal(1200);
      expect(await token1.balanceOf(pair)).to.equal(1200);
      expect(await token0.balanceOf(otherAccount)).to.equal(0);
      expect(await token1.balanceOf(otherAccount)).to.equal(0);

      await token0.transfer(pair, 10);
      await token1.transfer(pair, 10);

      expect(await token0.balanceOf(owner)).to.equal(790);
      expect(await token1.balanceOf(owner)).to.equal(790);
      expect(await token0.balanceOf(pair)).to.equal(1210);
      expect(await token1.balanceOf(pair)).to.equal(1210);
      expect(await token0.balanceOf(otherAccount)).to.equal(0);
      expect(await token1.balanceOf(otherAccount)).to.equal(0);

      let { _reserve0, _reserve1 } = await pair.getReserves();
      expect(_reserve0).to.eql(BigInt(1200));
      expect(_reserve1).to.eql(BigInt(1200));

      await expect(pair.swap(100, 100, pair, "0x")).to.emit(pair, 'Swap').withArgs(owner.address, 110, 110, 100, 100, await pair.getAddress());

      ({ _reserve0, _reserve1 } = await pair.getReserves());
      expect(_reserve0).to.eql(BigInt(1210));
      expect(_reserve1).to.eql(BigInt(1210));

      expect(await token0.balanceOf(owner)).to.equal(790);
      expect(await token1.balanceOf(owner)).to.equal(790);
      expect(await token0.balanceOf(pair)).to.equal(1210);
      expect(await token1.balanceOf(pair)).to.equal(1210);
      expect(await token0.balanceOf(otherAccount)).to.equal(0);
      expect(await token1.balanceOf(otherAccount)).to.equal(0);
    });

    it('should transfer token from pair contract, different price exchange', async () => {
      const { pair, owner, token0, token1, otherAccount } = await loadFixture(deployPairByFactoryAndMint);
      expect(await token0.balanceOf(owner)).to.equal(800);
      expect(await token1.balanceOf(owner)).to.equal(800);
      expect(await token0.balanceOf(pair)).to.equal(1200);
      expect(await token1.balanceOf(pair)).to.equal(1200);

      let { _reserve0, _reserve1 } = await pair.getReserves();
      expect(_reserve0).to.eql(BigInt(1200));
      expect(_reserve1).to.eql(BigInt(1200));

      await token0.transfer(pair, 10);
      await token1.transfer(pair, 20);
      await expect(pair.swap(1000, 10, pair, "0x")).to.emit(pair, 'Swap').withArgs(owner.address, 1010, 30, 1000, 10, await pair.getAddress());

      ({ _reserve0, _reserve1 } = await pair.getReserves());
      expect(_reserve0).to.eql(BigInt(1210));
      expect(_reserve1).to.eql(BigInt(1220));
    });
  })
});
