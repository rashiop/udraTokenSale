// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {CappedToken} from "./CappedToken.sol";

/*
Tasks:
v FE-4	Inherit from Ownable2Step to designate the token sale contract owner. This account should have the ability to withdraw both ERC20 tokens and ETH.
FE-6	The token sale contract should be granted the MINTER_ROLE in the ERC20 token contract. -- on deploy script
v FE-5	The constructor should include parameters to initialize the ERC20 token the sell price per token in ETH, and the buy price per token in ETH. This contract should allow users to both buy and sell tokens. For example, users can buy tokens at 0.001 ETH each and sell them back at 0.0005 ETH per token.
v FE-7	Users should be able to buy tokens with ETH. Handle the edge case where new tokens should not be minted if the contract already holds enough token reserves. Additionally, enable users to purchase tokens by simply sending ETH directly to the contract.
v FE-8	Users should be able to sell tokens for ETH. When a token is sold, it should be transferred to the token sale contract, allowing it to be resold to other users.
v FE-9	The owner should have the permission to withdraw ERC20 tokens from the contract.
v FE-10	The owner should have the permission to withdraw ETH from the contract.
*/

contract TokenSale is Ownable2Step, ReentrancyGuard {
    CappedToken public immutable TOKEN;
    uint256 public immutable SELL_RATE;
    uint256 public immutable BUY_RATE;
    uint256 public immutable BASE_UNIT;

    struct SaleState {
        uint256 tokenReserve;  // Tokens held by contract
        uint256 ethLiquidity;  // ETH available for sells
        uint256 remainingCap;  // Tokens that can still be minted
        uint256 totalSupply;   // Current total supply
        uint256 maxSupply;     // Token cap
    }

    event Buy(address indexed to, uint256 tokensOut, uint256 ethIn);
    event Sell(address indexed from, uint256 tokensIn, uint256 ethOut);
    event WithdrawToken(uint256 amount);
    event WithdrawEth(uint256 amount);

    error ExceededCap();
    error FailToSendEth();
    error FailToBuyToken();
    error FailToSellToken();
    error FailToWithdrawToken();
    error InsufficientTokenBalance();
    error InsufficientEthBalance();
    error InsufficientPayment();
    error NoZeroAmount();
    error NoZeroAddress();
    error UseBuy();

    // FE-5	The constructor should include parameters to initialize the ERC20 token the sell price per token in ETH, and the buy price per token in ETH. This contract should allow users to both buy and sell tokens. For example, users can buy tokens at 0.001 ETH each and sell them back at 0.0005 ETH per token.
    constructor(CappedToken token, uint256 sellRate, uint256 buyRate) Ownable(msg.sender) {
        if (address(token) == address(0)) revert NoZeroAddress();
        if (sellRate == 0) revert NoZeroAmount();
        if (buyRate == 0) revert NoZeroAmount();

        TOKEN = token;
        SELL_RATE = sellRate;
        BUY_RATE = buyRate;
        BASE_UNIT = 10 ** token.decimals();
    }

    // FE-7	Users should be able to buy tokens with ETH. Handle the edge case where new tokens should not be minted if the contract already holds enough token reserves. Additionally, enable users to purchase tokens by simply sending ETH directly to the contract.
    function buy() external payable {
        _buy(msg.sender, msg.value);
    }

    function _buy(address to, uint256 ethIn) internal nonReentrant {
        if (ethIn == 0) revert InsufficientPayment();

        uint256 buyAmount = ethIn * BASE_UNIT / BUY_RATE;
        if (buyAmount == 0) revert InsufficientPayment();

        uint256 reserve = TOKEN.balanceOf(address(this));
        uint256 mintAmount = buyAmount > reserve ? buyAmount - reserve : 0;
        if (mintAmount > 0) {
            uint256 remainingCap = TOKEN.cap() - TOKEN.totalSupply();
            if (mintAmount > remainingCap) revert ExceededCap();
            TOKEN.mint(address(this), mintAmount);
        }

        bool success = TOKEN.transfer(to, buyAmount);
        if (!success) revert FailToBuyToken();

        emit Buy(to, buyAmount, ethIn);
    }

    // v FE-8	Users should be able to sell tokens for ETH. When a token is sold, it should be transferred to the token sale contract, allowing it to be resold to other users.
    function sell(uint256 sellAmount) external nonReentrant {
        if (sellAmount == 0) revert NoZeroAmount();

        uint256 ethOut = sellAmount * SELL_RATE / BASE_UNIT;
        if (address(this).balance < ethOut) revert InsufficientEthBalance();

        if (sellAmount > TOKEN.balanceOf(msg.sender)) revert InsufficientTokenBalance();
    
        bool success = TOKEN.transferFrom(msg.sender, address(this), sellAmount);
        if (!success) revert FailToSellToken();
    
        (bool sent,) = address(msg.sender).call{value: ethOut}("");
        if (!sent) revert FailToSendEth();

        emit Sell(msg.sender, sellAmount, ethOut);
    }

    // FE-9	The owner should have the permission to withdraw ERC20 tokens from the contract.
    function withdrawToken() external onlyOwner nonReentrant {
        uint256 contractBalance = TOKEN.balanceOf(address(this));
        if (contractBalance == 0) revert InsufficientTokenBalance();

        bool success = TOKEN.transfer(msg.sender, contractBalance);
        if (!success) revert FailToWithdrawToken();

        emit WithdrawToken(contractBalance);
    }

    // FE-10 The owner should have the permission to withdraw ETH from the contract.
    function withdrawEth() external onlyOwner nonReentrant {
        uint256 ethBalance = address(this).balance;
        if (ethBalance == 0) revert InsufficientEthBalance();

        (bool withdrawn,) = address(msg.sender).call{value: ethBalance}("");
        if (!withdrawn) revert FailToSendEth();

        emit WithdrawEth(ethBalance);
    }

    /// @notice Returns aggregate state for frontend display
    function getSaleState() external view returns (SaleState memory) {
        return SaleState({
            tokenReserve: TOKEN.balanceOf(address(this)),
            ethLiquidity: address(this).balance,
            remainingCap: TOKEN.cap() - TOKEN.totalSupply(),
            totalSupply: TOKEN.totalSupply(),
            maxSupply: TOKEN.cap()
        });
    }

    receive() external payable {
        _buy(msg.sender, msg.value);
    }

    fallback() external payable {
        revert UseBuy();
    }
}
