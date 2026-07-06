// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenSaleBase} from "./TokenSale.base.sol";
import {TokenSale} from "../src/TokenSale.sol";

contract TokenSaleSellTest is TokenSaleBase {
    function test_Sell_HappyPath() public {
        uint256 ethIn = 1 ether;
        _buy(alice, ethIn);

        uint256 tokensIn = cappedToken.balanceOf(alice);
        uint256 expectedEthOut = _ethFromSell(tokensIn);
        uint256 aliceEthBefore = alice.balance;

        vm.prank(alice);
        cappedToken.approve(address(tokenSale), tokensIn);

        vm.prank(alice);
        tokenSale.sell(tokensIn);

        assertEq(cappedToken.balanceOf(alice), 0);
        assertEq(cappedToken.balanceOf(address(tokenSale)), tokensIn, "Contract should hold sold tokens");
        assertEq(alice.balance, aliceEthBefore + expectedEthOut, "Seller should receive ETH");
    }

    function test_Sell_EmitsEvent() public {
        uint256 ethIn = 1 ether;
        _buy(alice, ethIn);

        uint256 tokensIn = cappedToken.balanceOf(alice);
        uint256 expectedEthOut = _ethFromSell(tokensIn);

        vm.prank(alice);
        cappedToken.approve(address(tokenSale), tokensIn);

        vm.prank(alice);
        vm.expectEmit(true, false, false, true, address(tokenSale));
        emit TokenSale.Sell(alice, tokensIn, expectedEthOut);

        tokenSale.sell(tokensIn);
    }

    function test_Sell_RevertNoZeroAmount() public {
        _buy(alice, 1 ether);

        vm.prank(alice);
        vm.expectRevert(TokenSale.NoZeroAmount.selector);
        tokenSale.sell(0);
    }

    function test_Sell_RevertInsufficientTokenBalance() public {
        _buy(alice, 1 ether);

        uint256 token = cappedToken.balanceOf(alice);
        vm.prank(alice);
        cappedToken.approve(address(tokenSale), token + 1);

        vm.prank(alice);
        vm.expectRevert(TokenSale.InsufficientTokenBalance.selector);
        tokenSale.sell(token + 1);
    }

    function test_Sell_RevertInsufficientEthBalance() public {
        _buy(alice, 1 ether);

        // Owner drains ETH
        vm.prank(admin);
        tokenSale.withdrawEth();
        assertEq(address(tokenSale).balance, 0);

        uint256 tokensIn = cappedToken.balanceOf(alice);
        vm.prank(alice);
        cappedToken.approve(address(tokenSale), tokensIn);

        vm.prank(alice);
        vm.expectRevert(TokenSale.InsufficientEthBalance.selector);
        tokenSale.sell(tokensIn);
    }
}
