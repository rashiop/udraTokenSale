// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console2} from "forge-std/Script.sol";
import {TokenSale} from "../src/TokenSale.sol";
import {CappedToken} from "../src/CappedToken.sol";

contract DeployTokenSaleScript is Script {
    TokenSale public tokenSale;
    CappedToken public cappedToken;

    function setUp() public {}

    function run() public {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPk);

        string memory tokenName = vm.envString("TOKEN_NAME");
        string memory tokenSymbol = vm.envString("TOKEN_SYMBOL");
        address admin = vm.envAddress("ADMIN");
        uint256 tokenCap = 1_000_000 * 10 ** 18;
        cappedToken = new CappedToken(tokenName, tokenSymbol, tokenCap, admin);

        uint256 sellRate = 0.0005 ether;
        uint256 buyRate = 0.001 ether;
        tokenSale = new TokenSale(cappedToken, sellRate, buyRate);
        cappedToken.grantRole(cappedToken.MINTER_ROLE(), address(tokenSale));
        vm.stopBroadcast();

        console2.log("CappedToken deployed at:", address(cappedToken));
        console2.log("Admin:", admin);
        console2.log("TokenSale deployed at:", address(tokenSale));
    }
}
