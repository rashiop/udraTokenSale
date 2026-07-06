// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenSaleBase} from "./TokenSale.base.sol";
import {TokenSale} from "../src/TokenSale.sol";

contract TokenSaleWithdrawTest is TokenSaleBase {
    function test_WithdrawToken_HappyPath() public {
        _buy(alice, 1 ether);
        _sellAll(alice);

        uint256 saleTokenBalance = cappedToken.balanceOf(address(tokenSale));
        assertGt(saleTokenBalance, 0, "TokenSale should have tokens");

        vm.prank(admin);
        tokenSale.withdrawToken();

        assertEq(cappedToken.balanceOf(address(tokenSale)), 0);
        assertEq(cappedToken.balanceOf(admin), saleTokenBalance);
    }

    function test_WithdrawToken_EmitsEvent() public {
        _buy(alice, 1 ether);
        _sellAll(alice);

        uint256 saleTokenBalance = cappedToken.balanceOf(address(tokenSale));

        vm.prank(admin);
        vm.expectEmit(false, false, false, true, address(tokenSale));
        emit TokenSale.WithdrawToken(saleTokenBalance);

        tokenSale.withdrawToken();
    }

    function test_WithdrawToken_RevertInsufficientTokenBalance() public {
        vm.prank(admin);
        vm.expectRevert(TokenSale.InsufficientTokenBalance.selector);
        tokenSale.withdrawToken();
    }

    function test_WithdrawToken_RevertNotOwner() public {
        _buy(alice, 1 ether);
        _sellAll(alice);

        vm.prank(alice);
        vm.expectRevert();
        tokenSale.withdrawToken();

        vm.prank(bob);
        vm.expectRevert();
        tokenSale.withdrawToken();
    }

    /*//////////////////////////////////////////////////////////////
                          WITHDRAW ETH TESTS
    //////////////////////////////////////////////////////////////*/

    function test_WithdrawEth_HappyPath() public {
        _buy(alice, 1 ether);

        uint256 adminEthBefore = admin.balance;
        uint256 contractEth = address(tokenSale).balance;

        vm.prank(admin);
        tokenSale.withdrawEth();

        assertEq(address(tokenSale).balance, 0);
        assertEq(admin.balance, adminEthBefore + contractEth);
    }

    function test_WithdrawEth_EmitsEvent() public {
        _buy(alice, 1 ether);

        uint256 contractEth = address(tokenSale).balance;

        vm.prank(admin);
        vm.expectEmit(false, false, false, true, address(tokenSale));
        emit TokenSale.WithdrawEth(contractEth);

        tokenSale.withdrawEth();
    }

    function test_WithdrawEth_RevertInsufficientEthBalance() public {
        vm.prank(admin);
        vm.expectRevert(TokenSale.InsufficientEthBalance.selector);
        tokenSale.withdrawEth();
    }

    function test_WithdrawEth_RevertNotOwner() public {
        _buy(alice, 1 ether);

        vm.prank(alice);
        vm.expectRevert();
        tokenSale.withdrawEth();

        vm.prank(bob);
        vm.expectRevert();
        tokenSale.withdrawEth();
    }
}
