// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";

import {CappedToken} from "../src/CappedToken.sol";
import {TokenSale} from "../src/TokenSale.sol";

abstract contract TokenSaleBase is Test {
    CappedToken cappedToken;
    TokenSale tokenSale;

    string constant NAME = "UDRA TOKEN";
    string constant SYMBOL = "UTK";

    uint256 constant CAP = 1000 * 10 ** 18; // 1000 tokens
    uint256 constant BUY_RATE = 0.001 ether; // wei per 1 token
    uint256 constant SELL_RATE = 0.0005 ether; // wei per 1 token

    address admin;
    address alice;
    address bob;

    uint256 baseUnit;

    function setUp() public virtual {
        admin = makeAddr("admin");
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        vm.startPrank(admin);
        cappedToken = new CappedToken(NAME, SYMBOL, CAP, admin);
        tokenSale = new TokenSale(cappedToken, SELL_RATE, BUY_RATE);
        cappedToken.grantRole(cappedToken.MINTER_ROLE(), address(tokenSale));
        vm.stopPrank();

        baseUnit = 10 ** cappedToken.decimals();

        vm.label(address(cappedToken), "CappedToken");
        vm.label(address(tokenSale), "TokenSale");
    }

    /*//////////////////////////////////////////////////////////////
                               HELPERS
    //////////////////////////////////////////////////////////////*/

    function _ethForTokens(uint256 tokensOut) internal view returns (uint256) {
        return (tokensOut * BUY_RATE) / baseUnit;
    }

    function _tokensForEth(uint256 ethIn) internal view returns (uint256) {
        return (ethIn * baseUnit) / BUY_RATE;
    }

    function _ethFromSell(uint256 tokensIn) internal view returns (uint256) {
        return (tokensIn * SELL_RATE) / baseUnit;
    }

    function _buy(address buyer, uint256 ethIn) internal {
        vm.deal(buyer, ethIn);
        vm.prank(buyer);
        tokenSale.buy{value: ethIn}();
    }

    function _sellAll(address seller) internal returns (uint256 tokensIn, uint256 ethOut) {
        tokensIn = cappedToken.balanceOf(seller);
        vm.prank(seller);
        cappedToken.approve(address(tokenSale), tokensIn);

        ethOut = _ethFromSell(tokensIn);

        vm.prank(seller);
        tokenSale.sell(tokensIn);
    }

    function _sell(address seller, uint256 amount) internal returns (uint256 ethOut) {
        vm.prank(seller);
        cappedToken.approve(address(tokenSale), amount);

        ethOut = _ethFromSell(amount);

        vm.prank(seller);
        tokenSale.sell(amount);
    }
}
