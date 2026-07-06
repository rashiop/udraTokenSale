// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenSaleBase} from "./TokenSale.base.sol";
import {TokenSale} from "../src/TokenSale.sol";

contract TokenSaleBuyTest is TokenSaleBase {
    function test_Buy_HappyPath() public {
        uint256 ethIn = 1 ether;
        uint256 expectedTokensOut = _tokensForEth(ethIn);

        _buy(alice, ethIn);

        assertEq(cappedToken.balanceOf(alice), expectedTokensOut, "Token balance mismatch");
        assertEq(cappedToken.totalSupply(), expectedTokensOut, "Total supply mismatch");
        assertEq(address(tokenSale).balance, ethIn, "ETH balance mismatch");
    }

    function test_Buy_EmitsEvent() public {
        uint256 ethIn = 1 ether;
        uint256 expectedTokensOut = _tokensForEth(ethIn);

        vm.deal(alice, ethIn);
        vm.prank(alice);

        vm.expectEmit(true, false, false, true, address(tokenSale));
        emit TokenSale.Buy(alice, expectedTokensOut, ethIn);

        tokenSale.buy{value: ethIn}();
    }

    function test_Buy_Revert_NoZeroAmount() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert(TokenSale.InsufficientPayment.selector);
        tokenSale.buy{value: 0}();
    }

    function test_Buy_Revert_ExceededCap() public {
        // try to buy (CAP + 1_000) tokens => should revert ExceededCap
        uint256 tokensWanted = CAP + 1_000; // base units
        uint256 ethIn = _ethForTokens(tokensWanted);

        vm.deal(alice, ethIn);
        vm.prank(alice);
        vm.expectRevert(TokenSale.ExceededCap.selector);
        tokenSale.buy{value: ethIn}();
    }

    function test_Buy_ExactlyAtCap() public {
        uint256 ethIn = _ethForTokens(CAP);

        _buy(alice, ethIn);

        assertEq(cappedToken.totalSupply(), CAP, "Should be exactly at cap");
        assertEq(cappedToken.balanceOf(alice), CAP);
    }

    function test_Buy_UsesReserveBeforeMinting() public {
        // 1) Alice buys tokens (mints new tokens)
        uint256 ethIn = 1 ether;
        _buy(alice, ethIn);

        uint256 aliceTokens = cappedToken.balanceOf(alice);
        uint256 supplyAfterFirstBuy = cappedToken.totalSupply();

        // 2) Alice sells all tokens back (tokens go to contract reserve)
        _sellAll(alice);

        uint256 reserve = cappedToken.balanceOf(address(tokenSale));
        assertEq(reserve, aliceTokens, "Contract should hold tokens as reserve");
        assertEq(cappedToken.totalSupply(), supplyAfterFirstBuy, "Total supply unchanged after sell");

        // 3) Bob buys tokens - should use reserve, NOT mint new tokens
        uint256 bobEthIn = 0.5 ether;
        _buy(bob, bobEthIn);

        uint256 bobTokens = cappedToken.balanceOf(bob);
        uint256 supplyAfterBobBuy = cappedToken.totalSupply();

        assertEq(supplyAfterBobBuy, supplyAfterFirstBuy, "No new tokens minted when reserve sufficient");
        assertEq(cappedToken.balanceOf(address(tokenSale)), reserve - bobTokens, "Reserve should decrease");
    }

    function test_Buy_PartialReservePartialMint() public {
        // 1) Alice buys 500 tokens
        uint256 tokensWanted = 500 * baseUnit;
        uint256 ethIn = _ethForTokens(tokensWanted);
        _buy(alice, ethIn);

        // 2) Alice sells all back
        _sellAll(alice);

        uint256 reserve = cappedToken.balanceOf(address(tokenSale));
        uint256 supplyBeforeBobBuy = cappedToken.totalSupply();
        assertEq(reserve, tokensWanted);

        // 3) Bob buys 800 tokens (reserve has 500, needs to mint 300 more)
        uint256 bobTokensWanted = 800 * baseUnit;
        uint256 bobEthIn = _ethForTokens(bobTokensWanted);
        _buy(bob, bobEthIn);

        uint256 expectedMint = bobTokensWanted - reserve;
        assertEq(cappedToken.totalSupply(), supplyBeforeBobBuy + expectedMint, "Should only mint the difference");
        assertEq(cappedToken.balanceOf(bob), bobTokensWanted);
        assertEq(cappedToken.balanceOf(address(tokenSale)), 0, "Reserve should be depleted");
    }

    function test_Receive_HappyPath() public {
        uint256 ethIn = 1 ether;
        vm.deal(alice, ethIn);

        vm.prank(alice);
        (bool ok,) = address(tokenSale).call{value: ethIn}("");
        assertTrue(ok);

        uint256 expectedTokensOut = _tokensForEth(ethIn);
        assertEq(cappedToken.balanceOf(alice), expectedTokensOut);
    }

    function test_Receive_EmitsEvent() public {
        uint256 ethIn = 1 ether;
        uint256 expectedTokensOut = _tokensForEth(ethIn);

        vm.deal(alice, ethIn);
        vm.prank(alice);

        vm.expectEmit(true, false, false, true, address(tokenSale));
        emit TokenSale.Buy(alice, expectedTokensOut, ethIn);

        (bool ok,) = address(tokenSale).call{value: ethIn}("");
        assertTrue(ok);
    }

    function test_Fallback_RevertsWithData() public {
        vm.deal(alice, 1 ether);

        vm.prank(alice);
        (bool ok,) = address(tokenSale).call{value: 1 ether}("somedata");
        assertFalse(ok);
    }
}
