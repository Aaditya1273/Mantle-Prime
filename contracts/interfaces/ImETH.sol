// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ImETH Interface
 * @notice Interface for Mantle's liquid staked ETH (mETH) - REAL PRODUCTION CONTRACT
 * @dev mETH is deployed on Ethereum L1, bridged to Mantle L2 via official bridge
 * @dev Real mETH address: 0xd5F7838F5C461fefF7FE49ea5ebaF7728bb0AdFa (Ethereum L1)
 */
interface ImETH is IERC20 {
    /**
     * @notice Get the current exchange rate of mETH to ETH
     * @return The exchange rate scaled by 1e18
     */
    function mETHToETH(uint256 mETHAmount) external view returns (uint256);
    
    /**
     * @notice Get ETH equivalent for mETH amount
     * @param ethAmount Amount of ETH
     * @return mETH equivalent amount
     */
    function ethToMETH(uint256 ethAmount) external view returns (uint256);
    
    /**
     * @notice Get the total supply of mETH
     * @return Total mETH supply
     */
    function totalSupply() external view returns (uint256);
    
    /**
     * @notice Standard ERC20 functions are inherited from IERC20
     * - balanceOf(address account)
     * - transfer(address to, uint256 amount)
     * - transferFrom(address from, address to, uint256 amount)
     * - approve(address spender, uint256 amount)
     * - allowance(address owner, address spender)
     */
}