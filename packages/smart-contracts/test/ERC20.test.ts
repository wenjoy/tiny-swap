import { ethers } from 'hardhat'
import { expect } from "chai";

describe('can do arbitary mint for ERC20', () => {
  it('should mint token', async () => {
    const [otherAccount] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('ERC20');
    const token = (await Token.deploy());
    expect(await token.totalSupply()).to.eql(BigInt(0));
    expect(await token.balanceOf(otherAccount)).to.eql(BigInt(0));

    await token.mintArbitary(otherAccount, 200)
    expect(await token.totalSupply()).to.eql(BigInt(200));
    expect(await token.balanceOf(otherAccount)).to.eql(BigInt(200));
  })
  it('should emit transfer', async () => {
    const [otherAccount] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('ERC20');
    const token = (await Token.deploy());

    await expect(token.mintArbitary(otherAccount, 200)).to.emit(token, 'Transfer')
    .withArgs(ethers.ZeroAddress, otherAccount.address, 200);
  })
})