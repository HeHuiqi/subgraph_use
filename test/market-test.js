const { expect, assert } = require("chai");
const { BigNumber, errors } = require("ethers");
const { ethers } = require("hardhat");


describe("HqMarket", function () {

  it("Should return the new greeting once it's changed", async function () {

    const [main,other] = await ethers.getSigners();
  
    const HqMarket = await ethers.getContractFactory("HqMarket");
    const hqMarket = await HqMarket.deploy();
    await hqMarket.deployed();
    console.log("HqMarket:",hqMarket.address);
    
    let uint = BigNumber.from("1000000000000000000");

    let num = BigNumber.from("2022")
    let amount = num.mul(uint);
    let tx = await hqMarket.mint(main.address,amount.toHexString());
    tx = await tx.wait();
    let mBalance = await hqMarket.balanceOf(main.address);
    expect(mBalance.eq(amount),"铸造失败");


    amount = amount.div(BigNumber.from('2'));
    tx = await hqMarket.transfer(other.address, amount.toHexString());
    mBalance = await hqMarket.balanceOf(main.address);
    let oBalance = await hqMarket.balanceOf(other.address);
    expect(mBalance.eq(oBalance),"转账失败");
 
  });
});
