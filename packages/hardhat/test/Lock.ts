import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

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
      const userContarc = erc20.connect(user);
    });
  });
});
