pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockERC20", "M20") {}

    function get(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }
}
