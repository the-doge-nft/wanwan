// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockERC1155 is ERC1155 {
    mapping(uint256 => string) public uris;

    constructor() ERC1155("M1155") {}

    function mint(uint256 id, uint256 amount) public {
        _mint(msg.sender, id, amount, "");
    }

    function setApprovalForAll(address operator, bool approved)
        public
        virtual
        override
    {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    // custom uri setting
    function setUri(uint256 _tokenId, string memory _uri) public {
        uris[_tokenId] = _uri;
    }

    // custom uri viewing
    function uri(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return uris[_tokenId];
    }
}
