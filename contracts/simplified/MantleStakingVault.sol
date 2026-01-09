// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MantleStakingVault
 * @dev Simplified vault that accepts MNT and simulates liquid staking
 * Perfect for hackathon demo - uses native MNT token
 */
contract MantleStakingVault is ReentrancyGuard, Ownable {
    
    // Staking parameters
    uint256 public constant STAKING_APY = 420; // 4.20% APY in basis points
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    // User staking info
    struct StakeInfo {
        uint256 stakedAmount;      // MNT staked
        uint256 lastUpdateTime;    // Last yield calculation
        uint256 accruedYield;      // Pending yield to claim
    }
    
    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event YieldClaimed(address indexed user, uint256 yield);
    
    constructor() {}
    
    /**
     * @dev Stake MNT to earn yield (simulates liquid staking)
     */
    function stake() external payable nonReentrant {
        require(msg.value > 0, "Cannot stake 0 MNT");
        
        _updateYield(msg.sender);
        
        stakes[msg.sender].stakedAmount += msg.value;
        stakes[msg.sender].lastUpdateTime = block.timestamp;
        totalStaked += msg.value;
        
        emit Staked(msg.sender, msg.value);
    }
    
    /**
     * @dev Unstake MNT (withdraw principal)
     */
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot unstake 0");
        require(stakes[msg.sender].stakedAmount >= amount, "Insufficient stake");
        
        _updateYield(msg.sender);
        
        stakes[msg.sender].stakedAmount -= amount;
        totalStaked -= amount;
        
        payable(msg.sender).transfer(amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Claim accumulated staking yield
     */
    function claimYield() external nonReentrant {
        _updateYield(msg.sender);
        
        uint256 yield = stakes[msg.sender].accruedYield;
        require(yield > 0, "No yield to claim");
        
        stakes[msg.sender].accruedYield = 0;
        
        // Pay yield from contract balance (funded by owner for demo)
        require(address(this).balance >= yield, "Insufficient yield pool");
        payable(msg.sender).transfer(yield);
        
        emit YieldClaimed(msg.sender, yield);
    }
    
    /**
     * @dev Calculate pending yield for user
     */
    function pendingYield(address user) public view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        if (userStake.stakedAmount == 0) return userStake.accruedYield;
        
        uint256 timeElapsed = block.timestamp - userStake.lastUpdateTime;
        uint256 newYield = (userStake.stakedAmount * STAKING_APY * timeElapsed) / 
                          (BASIS_POINTS * SECONDS_PER_YEAR);
        
        return userStake.accruedYield + newYield;
    }
    
    /**
     * @dev Internal function to update user's yield
     */
    function _updateYield(address user) internal {
        uint256 yield = pendingYield(user);
        stakes[user].accruedYield = yield;
        stakes[user].lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Get user's complete staking info
     */
    function getStakeInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 pendingYieldAmount,
        uint256 lastUpdate
    ) {
        StakeInfo memory userStake = stakes[user];
        return (
            userStake.stakedAmount,
            pendingYield(user),
            userStake.lastUpdateTime
        );
    }
    
    /**
     * @dev Owner can fund the yield pool for demo
     */
    function fundYieldPool() external payable onlyOwner {
        // Owner funds the contract to pay yields
    }
    
    /**
     * @dev Get contract's yield pool balance
     */
    function getYieldPool() external view returns (uint256) {
        return address(this).balance - totalStaked;
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}