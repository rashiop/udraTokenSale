// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {
    AccessControlDefaultAdminRules
} from "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

/*
TASKS:
v FE-1	Create an ERC20 token contract using OpenZeppelin libraries, with a name, symbol, and number of decimals of your choice. The constructor should accept a parameter to initialize the MAX_SUPPLY.
v FE-2	Implement the supply cap for the ERC20 token contract by overriding the _update() function.
v FE-3	An account with the MINTER_ROLE should have the ability to mint tokens. You can use the AccessControlDefaultAdminRules library from OpenZeppelin to implement this.

*/
contract CappedToken is ERC20, ERC20Pausable, ERC20Capped, AccessControlDefaultAdminRules {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // FE-1	Create an ERC20 token contract using OpenZeppelin libraries, with a name, symbol, and number of decimals of your choice. The constructor should accept a parameter to initialize the MAX_SUPPLY.
    constructor(string memory name, string memory symbol, uint256 maxSupply, address admin)
        ERC20(name, symbol)
        ERC20Capped(maxSupply)
        AccessControlDefaultAdminRules(3 days, admin)
    {
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // FE-3	An account with the MINTER_ROLE should have the ability to mint tokens. You can use the AccessControlDefaultAdminRules library from OpenZeppelin to implement this.
    // The cap is enforced via ERC20Capped's _mint logic.
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // FE-2	Implement the supply cap for the ERC20 token contract by overriding the _update() function.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable, ERC20Capped)
        whenNotPaused
    {
        super._update(from, to, value);
    }
}
