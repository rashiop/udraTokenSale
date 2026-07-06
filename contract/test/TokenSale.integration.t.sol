// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenSaleBase} from "./TokenSale.base.sol";

contract TokenSaleIntegrationTest is TokenSaleBase {
    function test_MultiUser_BuySellSequence() public {
        // Alice buys
        _buy(alice, 0.5 ether);
        uint256 aliceTokens = cappedToken.balanceOf(alice);

        // Bob buys
        _buy(bob, 0.3 ether);
        uint256 bobTokens = cappedToken.balanceOf(bob);

        // Alice sells half
        uint256 aliceSellAmount = aliceTokens / 2;
        _sell(alice, aliceSellAmount);

        // Verify state
        assertEq(cappedToken.balanceOf(alice), aliceTokens - aliceSellAmount);
        assertEq(cappedToken.balanceOf(bob), bobTokens);
        assertEq(cappedToken.balanceOf(address(tokenSale)), aliceSellAmount);
    }

    function test_MultiUser_ReservePriority() public {
        // Alice buys and sells, creating reserve
        _buy(alice, 1 ether);
        uint256 aliceTokens = cappedToken.balanceOf(alice);
        _sellAll(alice);

        uint256 supplyAfterAlice = cappedToken.totalSupply();
        uint256 reserve = cappedToken.balanceOf(address(tokenSale));
        assertEq(reserve, aliceTokens);

        // Bob buys less than reserve
        uint256 bobEth = 0.3 ether;
        _buy(bob, bobEth);

        // No new tokens should be minted
        assertEq(cappedToken.totalSupply(), supplyAfterAlice, "Should use reserve, not mint");
    }

    function test_FullLifecycle() public {
        // 1. Initial state
        assertEq(cappedToken.totalSupply(), 0);
        assertEq(address(tokenSale).balance, 0);

        // 2. Alice buys tokens (40% of cap)
        _buy(alice, 0.4 ether);
        uint256 aliceTokens = cappedToken.balanceOf(alice);
        assertGt(aliceTokens, 0);

        // 3. Bob buys tokens (30% of cap)
        _buy(bob, 0.3 ether);
        uint256 bobTokens = cappedToken.balanceOf(bob);

        // 4. Alice sells half
        uint256 aliceSellAmount = aliceTokens / 2;
        _sell(alice, aliceSellAmount);

        // 5. Charlie buys using reserve
        address charlie = makeAddr("charlie");
        uint256 supplyBeforeCharlie = cappedToken.totalSupply();
        uint256 charlieEth = 0.1 ether;
        uint256 charlieTokens = _tokensForEth(charlieEth);

        // Charlie should get tokens from reserve (no new minting)
        _buy(charlie, charlieEth);

        if (charlieTokens <= aliceSellAmount) {
            assertEq(cappedToken.totalSupply(), supplyBeforeCharlie, "Should use reserve");
        }

        // 6. Owner withdraws ETH
        uint256 contractEth = address(tokenSale).balance;
        vm.prank(admin);
        tokenSale.withdrawEth();
        assertEq(admin.balance, contractEth);

        // 7. Verify final state
        assertEq(cappedToken.balanceOf(alice), aliceTokens - aliceSellAmount);
        assertEq(cappedToken.balanceOf(bob), bobTokens);
        assertEq(cappedToken.balanceOf(charlie), charlieTokens);
    }

    function test_CapReached_CanStillSellAndRebuy() public {
        // Buy all tokens up to cap
        uint256 ethForCap = _ethForTokens(CAP);
        _buy(alice, ethForCap);

        assertEq(cappedToken.totalSupply(), CAP);
        assertEq(cappedToken.balanceOf(alice), CAP);

        // Alice sells some tokens
        uint256 sellAmount = CAP / 4;
        _sell(alice, sellAmount);

        // Bob can still buy (from reserve)
        uint256 bobEth = _ethForTokens(sellAmount);
        _buy(bob, bobEth);

        // Total supply unchanged (used reserve)
        assertEq(cappedToken.totalSupply(), CAP);
        assertEq(cappedToken.balanceOf(bob), sellAmount);
    }
}
