// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenSaleBase} from "./TokenSale.base.sol";
import {TokenSale} from "../src/TokenSale.sol";

contract TokenSaleFuzzTest is TokenSaleBase {
    function testFuzz_Buy(uint256 ethIn) public {
        // Range: min 1 wei that produces tokens, max cap worth
        uint256 minEth = (BUY_RATE / baseUnit) + 1;
        uint256 maxEth = _ethForTokens(CAP);
        ethIn = bound(ethIn, minEth, maxEth);

        uint256 expectedTokens = _tokensForEth(ethIn);
        vm.assume(expectedTokens > 0);

        _buy(alice, ethIn);

        assertEq(cappedToken.balanceOf(alice), expectedTokens);
        assertEq(address(tokenSale).balance, ethIn);
    }

    function testFuzz_Sell(uint256 ethIn, uint256 sellPercent) public {
        // Bound ETH to valid range
        uint256 minEth = (BUY_RATE / baseUnit) + 1;
        uint256 maxEth = _ethForTokens(CAP);
        ethIn = bound(ethIn, minEth, maxEth);

        // Bound sell percentage 1-100%
        sellPercent = bound(sellPercent, 1, 100);

        _buy(alice, ethIn);

        uint256 aliceTokens = cappedToken.balanceOf(alice);
        uint256 sellAmount = (aliceTokens * sellPercent) / 100;
        vm.assume(sellAmount > 0);

        uint256 expectedEthOut = _ethFromSell(sellAmount);
        uint256 aliceEthBefore = alice.balance;
        uint256 contractEthBefore = address(tokenSale).balance;

        // Skip if contract doesn't have enough ETH
        vm.assume(contractEthBefore >= expectedEthOut);

        _sell(alice, sellAmount);

        assertEq(cappedToken.balanceOf(alice), aliceTokens - sellAmount);
        assertEq(alice.balance, aliceEthBefore + expectedEthOut);
    }

    function testFuzz_GetSaleState(uint256 ethIn) public {
        uint256 minEth = (BUY_RATE / baseUnit) + 1;
        uint256 maxEth = _ethForTokens(CAP);
        ethIn = bound(ethIn, minEth, maxEth);

        _buy(alice, ethIn);

        TokenSale.SaleState memory state = tokenSale.getSaleState();

        assertEq(state.ethLiquidity, ethIn);
        assertEq(state.totalSupply + state.remainingCap, state.maxSupply);
    }

    function testFuzz_BuySellBuy(uint256 ethIn1, uint256 ethIn2) public {
        uint256 minEth = (BUY_RATE / baseUnit) + 1;
        uint256 maxEth = _ethForTokens(CAP / 2); // Half cap each

        ethIn1 = bound(ethIn1, minEth, maxEth);
        ethIn2 = bound(ethIn2, minEth, maxEth);

        // Alice buys
        _buy(alice, ethIn1);
        uint256 aliceTokens = cappedToken.balanceOf(alice);
        uint256 supplyAfterBuy = cappedToken.totalSupply();

        // Alice sells all
        _sellAll(alice);
        assertEq(cappedToken.totalSupply(), supplyAfterBuy, "Supply unchanged after sell");

        // Bob buys - should use reserve
        uint256 bobTokensExpected = _tokensForEth(ethIn2);
        vm.assume(bobTokensExpected <= aliceTokens); // Bob buys less than reserve

        _buy(bob, ethIn2);

        // No new minting if reserve sufficient
        if (bobTokensExpected <= aliceTokens) {
            assertEq(cappedToken.totalSupply(), supplyAfterBuy, "Should use reserve");
        }
    }

    function testFuzz_MultipleUsers(uint256 seed) public {
        // Create multiple users
        uint256 numUsers = bound(seed, 2, 5);
        uint256 ethPerUser = _ethForTokens(CAP) / (numUsers + 1);

        uint256 totalTokensBought;

        for (uint256 i = 0; i < numUsers; i++) {
            address user = makeAddr(string(abi.encodePacked("user", i)));
            _buy(user, ethPerUser);
            totalTokensBought += cappedToken.balanceOf(user);
        }

        assertEq(cappedToken.totalSupply(), totalTokensBought);
        assertLe(cappedToken.totalSupply(), CAP);
    }
}
