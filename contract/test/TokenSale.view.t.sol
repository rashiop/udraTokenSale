// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenSaleBase} from "./TokenSale.base.sol";
import {TokenSale} from "../src/TokenSale.sol";

contract TokenSaleViewTest is TokenSaleBase {
    function test_GetSaleState_Initial() public view {
        TokenSale.SaleState memory state = tokenSale.getSaleState();

        assertEq(state.tokenReserve, 0);
        assertEq(state.ethLiquidity, 0);
        assertEq(state.remainingCap, CAP);
        assertEq(state.totalSupply, 0);
        assertEq(state.maxSupply, CAP);
    }

    function test_GetSaleState_AfterBuy() public {
        uint256 ethIn = 1 ether;
        _buy(alice, ethIn);

        uint256 expectedTokens = _tokensForEth(ethIn);
        TokenSale.SaleState memory state = tokenSale.getSaleState();

        assertEq(state.tokenReserve, 0, "No reserve after direct buy");
        assertEq(state.ethLiquidity, ethIn, "ETH should be in contract");
        assertEq(state.remainingCap, CAP - expectedTokens);
        assertEq(state.totalSupply, expectedTokens);
    }

    function test_GetSaleState_AfterSell() public {
        uint256 ethIn = 1 ether;
        _buy(alice, ethIn);

        uint256 expectedTokens = _tokensForEth(ethIn);
        _sellAll(alice);

        TokenSale.SaleState memory state = tokenSale.getSaleState();

        assertEq(state.tokenReserve, expectedTokens, "Tokens should be in reserve");
        assertEq(state.totalSupply, expectedTokens, "Total supply unchanged after sell");
    }

    function test_GetSaleState_AfterWithdrawEth() public {
        _buy(alice, 1 ether);

        vm.prank(admin);
        tokenSale.withdrawEth();

        TokenSale.SaleState memory state = tokenSale.getSaleState();
        assertEq(state.ethLiquidity, 0, "ETH should be withdrawn");
    }

    function test_GetSaleState_AfterWithdrawToken() public {
        _buy(alice, 1 ether);
        _sellAll(alice);

        vm.prank(admin);
        tokenSale.withdrawToken();

        TokenSale.SaleState memory state = tokenSale.getSaleState();
        assertEq(state.tokenReserve, 0, "Tokens should be withdrawn");
    }
}
