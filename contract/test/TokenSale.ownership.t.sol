// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenSaleBase} from "./TokenSale.base.sol";

contract TokenSaleOwnershipTest is TokenSaleBase {
    function test_Ownable2Step_TransferOwnership() public {
        // Step 1: Current owner initiates transfer
        vm.prank(admin);
        tokenSale.transferOwnership(alice);

        // Owner should still be admin (pending transfer)
        assertEq(tokenSale.owner(), admin);
        assertEq(tokenSale.pendingOwner(), alice);

        // Step 2: New owner accepts
        vm.prank(alice);
        tokenSale.acceptOwnership();

        assertEq(tokenSale.owner(), alice);
        assertEq(tokenSale.pendingOwner(), address(0));
    }

    function test_Ownable2Step_OnlyPendingOwnerCanAccept() public {
        vm.prank(admin);
        tokenSale.transferOwnership(alice);

        // Bob tries to accept - should fail
        vm.prank(bob);
        vm.expectRevert();
        tokenSale.acceptOwnership();

        // Alice can accept
        vm.prank(alice);
        tokenSale.acceptOwnership();
        assertEq(tokenSale.owner(), alice);
    }

    function test_Ownable2Step_CanCancelTransfer() public {
        vm.prank(admin);
        tokenSale.transferOwnership(alice);

        // Admin cancels by transferring to zero
        vm.prank(admin);
        tokenSale.transferOwnership(address(0));

        assertEq(tokenSale.pendingOwner(), address(0));
        assertEq(tokenSale.owner(), admin);
    }

    function test_Ownable2Step_NewOwnerCanWithdraw() public {
        // Transfer ownership to alice
        vm.prank(admin);
        tokenSale.transferOwnership(alice);

        vm.prank(alice);
        tokenSale.acceptOwnership();

        // Setup: buy tokens so contract has ETH
        _buy(bob, 1 ether);

        // Alice (new owner) can withdraw
        vm.prank(alice);
        tokenSale.withdrawEth();

        assertEq(address(tokenSale).balance, 0);
        assertEq(alice.balance, 1 ether);
    }

    function test_Ownable2Step_OldOwnerCannotWithdrawAfterTransfer() public {
        // Transfer ownership to alice
        vm.prank(admin);
        tokenSale.transferOwnership(alice);

        vm.prank(alice);
        tokenSale.acceptOwnership();

        // Setup: buy tokens so contract has ETH
        _buy(bob, 1 ether);

        // Admin (old owner) cannot withdraw
        vm.prank(admin);
        vm.expectRevert();
        tokenSale.withdrawEth();
    }
}
