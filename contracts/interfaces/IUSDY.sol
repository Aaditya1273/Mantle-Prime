// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IUSDY Interface
 * @notice Interface for Ondo's yield-bearing USD (USDY) token - REAL PRODUCTION CONTRACT
 * @dev USDY is deployed on Mantle Network at: 0x5bE26527e817998A7206475496fde1E68957c5A6
 * @dev USDY is a yield-bearing stablecoin backed by US Treasury securities
 */
interface IUSDY is IERC20 {
    /**
     * @notice Get the current price per share
     * @return The price per share scaled by 1e18
     */
    function pricePerShare() external view returns (uint256);
    
    /**
     * @notice Get the total underlying assets
     * @return The total value of underlying assets
     */
    function totalAssets() external view returns (uint256);
    
    /**
     * @notice Convert shares to assets
     * @param shares The amount of USDY shares
     * @return The equivalent asset amount
     */
    function convertToAssets(uint256 shares) external view returns (uint256);
    
    /**
     * @notice Convert assets to shares
     * @param assets The amount of assets
     * @return The equivalent USDY shares
     */
    function convertToShares(uint256 assets) external view returns (uint256);
    
    /**
     * @notice Standard ERC20 functions are inherited from IERC20
     * - balanceOf(address account)
     * - transfer(address to, uint256 amount)
     * - transferFrom(address from, address to, uint256 amount)
     * - approve(address spender, uint256 amount)
     * - allowance(address owner, address spender)
     */
}