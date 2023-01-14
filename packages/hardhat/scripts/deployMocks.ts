import { ethers } from "hardhat";

async function main() {
  const ERC20 = await ethers.getContractFactory("MockERC20");
  const erc20 = await ERC20.deploy();
  await erc20.deployed();
  console.log(`deployed to ${erc20.address}`);

  const ERC721 = await ethers.getContractFactory("MockERC721");
  const erc721 = await ERC721.deploy();
  await erc721.deployed();
  console.log(`deployed to ${erc721.address}`);

  const ERC1155 = await ethers.getContractFactory("MockERC1155");
  const erc1155 = await ERC721.deploy();
  await erc1155.deployed();
  console.log(`deployed to ${erc1155.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
