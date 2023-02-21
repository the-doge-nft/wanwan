import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("MockERC20");
    const erc20 = await ERC20.deploy();

    const ERC721 = await ethers.getContractFactory("MockERC721");
    const erc721 = await ERC721.deploy();

    const ERC1155 = await ethers.getContractFactory("MockERC1155");
    const erc1155 = await ERC1155.deploy();

    return { erc20, erc721, erc1155 };
  }

  describe("Mocks", function () {
    it("Should mint a lot of erc20 tokens", async function () {
      const { erc20 } = await loadFixture(deployOneYearLockFixture);
      const [_, user] = await ethers.getSigners();
      const userContract = erc20.connect(user);
      await userContract.get(ethers.BigNumber.from(10));
      expect(await userContract.balanceOf(user.address)).to.equal(10);
      expect(await userContract.decimals()).to.equal(18);
    });

    it("Should mint an ERC721", async function () {
      const { erc721 } = await loadFixture(deployOneYearLockFixture);
      const [_, user] = await ethers.getSigners();
      const userContract = erc721.connect(user);
      await userContract.mint();
      expect(await userContract.tokenURI(0)).to.equal(
        "https://www.gainor.xyz/images/me.jpg"
      );
    });

    it("Should mint and ERC1155", async function () {
      const { erc1155 } = await loadFixture(deployOneYearLockFixture);
      const [_, user] = await ethers.getSigners();
      const userContract = erc1155.connect(user);
      await userContract.setUri(0, "https://www.gainor.xyz/images/me.jpg");
      await userContract.mint(0, 1);
      expect(await userContract.uri(0)).to.equal(
        "https://www.gainor.xyz/images/me.jpg"
      );
    });
  });
});
