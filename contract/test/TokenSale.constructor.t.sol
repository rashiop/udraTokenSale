// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenSaleBase} from "./TokenSale.base.sol";
import {CappedToken} from "../src/CappedToken.sol";
import {TokenSale} from "../src/TokenSale.sol";

contract TokenSaleConstructorTest is TokenSaleBase {
    function test_Constructor_HappyPath() public view {
        assertEq(address(tokenSale.TOKEN()), address(cappedToken));
        assertEq(tokenSale.SELL_RATE(), SELL_RATE);
        assertEq(tokenSale.BUY_RATE(), BUY_RATE);
        assertEq(tokenSale.BASE_UNIT(), baseUnit);
        assertEq(tokenSale.owner(), admin);
    }

    function test_Constructor_Revert_NoZeroAmount() public {
        vm.expectRevert(TokenSale.NoZeroAmount.selector);
        new TokenSale(cappedToken, 0, BUY_RATE);

        vm.expectRevert(TokenSale.NoZeroAmount.selector);
        new TokenSale(cappedToken, SELL_RATE, 0);
    }

    function test_Constructor_Revert_NoZeroAddress() public {
        vm.expectRevert(TokenSale.NoZeroAddress.selector);
        new TokenSale(CappedToken(address(0)), SELL_RATE, BUY_RATE);
    }
}
