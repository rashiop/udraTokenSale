// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {CappedToken} from "../src/CappedToken.sol";

contract CappedTokenTest is Test {
    CappedToken public cappedToken;

    string constant NAME = "UDRA TOKEN";
    string constant SYMBOL = "UTK";
    uint256 constant CAP = 1000 * 10 ** 18;
    uint256 constant CAP_EXCEEDED = 2000 * 10 ** 18;
    uint256 constant MINT_AMOUNT = 100 * 10 ** 18;

    address admin;
    address minter;
    address pauser;
    address bob;
    address alice;

    function setUp() public {
        admin = vm.addr(1);
        pauser = vm.addr(2);
        minter = vm.addr(3);
        alice = vm.addr(4);
        bob = vm.addr(5);

        vm.startPrank(admin);
        cappedToken = new CappedToken(NAME, SYMBOL, CAP, admin);
        cappedToken.grantRole(cappedToken.MINTER_ROLE(), minter);
        cappedToken.grantRole(cappedToken.PAUSER_ROLE(), pauser);
        vm.stopPrank();

    }

    /*
      scenario case:
      - constructor
      - pause unpause
      - mint
    */

    function test_Constructor_HappyPath() public view {
        assertEq(cappedToken.name(), NAME);
        assertEq(cappedToken.symbol(), SYMBOL);
        assertEq(cappedToken.cap(), CAP);
        assertTrue(cappedToken.hasRole(cappedToken.DEFAULT_ADMIN_ROLE(), admin));
    }

    function test_PauseUnpause_HappyPath() public {
        vm.prank(pauser);
        cappedToken.pause();
        assertTrue(cappedToken.paused());

        vm.prank(pauser);
        cappedToken.unpause();
        assertFalse(cappedToken.paused());
    }

    function test_PauseUnpause_RevertNotPauser() public {
        vm.prank(bob);
        vm.expectRevert();
        cappedToken.pause();

        vm.prank(pauser);
        cappedToken.pause();
        assertTrue(cappedToken.paused());

        vm.prank(bob);
        vm.expectRevert();
        cappedToken.unpause();
    }

    function test_Mint_HappyPath() public {
        vm.prank(minter);
        cappedToken.mint(alice, MINT_AMOUNT);
        assertEq(cappedToken.balanceOf(alice), MINT_AMOUNT);

        vm.prank(minter);
        cappedToken.mint(admin, MINT_AMOUNT);
        assertEq(cappedToken.balanceOf(admin), MINT_AMOUNT);
    }

    function test_Mint_RevertExceedCap() public {
        vm.prank(minter);
        vm.expectRevert();
        cappedToken.mint(alice, CAP_EXCEEDED);
    }

    function test_Mint_RevertNotMinter() public {
        vm.prank(bob);
        vm.expectRevert();
        cappedToken.mint(alice, MINT_AMOUNT);
    }
}
