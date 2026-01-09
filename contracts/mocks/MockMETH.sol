// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockMETH
 * @dev Mock mETH token for hackathon demo on Mantle Sepolia testnet
 * Simulates liquid staking token with yield accrual
 */
contract MockMETH is ERC20, Ownable {
    
    // Staking yield parameters
    uint256 public constant ANNUAL_YIELD_RATE = 420; // 4.20% APY (in basis points)
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    // User staking data
    struct StakingInfo {
        uint256 stakedAmount;
        uint256 lastUpdateTime;
        uint256 accruedYield;
    }
    
    mapping(address => StakingInfo) public stakingInfo;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event YieldClaimed(address indexed user, uint256 yield);
    event TokensMinted(address indexed to, uint256 amount);
    
    constructor() ERC20("Mock Mantle ETH", "mETH") {
        // Mint initial supply for testing
        _mint(msg.sender, 1000000 * 10**18); // 1M mETH for distribution
    }
    
    /**
     * @dev Faucet function - gives users free mETH for testing
     * In hackathon demo, users can get mETH to test the platform
     */
    function faucet() external {
        require(balanceOf(msg.sender) < 100 * 10**18, "Already have enough mETH");
        
        uint256 faucetAmount = 50 * 10**18; // 50 mETH per request
        _mint(msg.sender, faucetAmount);
        
        emit TokensMinted(msg.sender, faucetAmount);
    }
    
    /**
     * @dev Stake mETH to start earning yield
     * Simulates liquid staking - users keep their tokens but earn yield
     */
    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Update existing yield before staking more
        _updateYield(msg.sender);
        
        // Update staking info
        stakingInfo[msg.sender].stakedAmount += amount;
        stakingInfo[msg.sender].lastUpdateTime = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Calculate pending yield for a user
     */
    function pendingYield(address user) public view returns (uint256) {
        StakingInfo memory info = stakingInfo[user];
        if (info.stakedAmount == 0) return info.accruedYield;
        
        uint256 timeElapsed = block.timestamp - info.lastUpdateTime;
        uint256 newYield = (info.stakedAmount * ANNUAL_YIELD_RATE * timeElapsed) / 
                          (BASIS_POINTS * SECONDS_PER_YEAR);
        
        return info.accruedYield + newYield;
    }
    
    /**
     * @dev Claim accumulated staking yield
     */
    function claimYield() external {
        _updateYield(msg.sender);
        
        uint256 yield = stakingInfo[msg.sender].accruedYield;
        require(yield > 0, "No yield to claim");
        
        stakingInfo[msg.sender].accruedYield = 0;
        _mint(msg.sender, yield);
        
        emit YieldClaimed(msg.sender, yield);
    }
    
    /**
     * @dev Internal function to update user's yield
     */
    function _updateYield(address user) internal {
        uint256 yield = pendingYield(user);
        stakingInfo[user].accruedYield = yield;
        stakingInfo[user].lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Get user's staking information
     */
    function getStakingInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 pendingYieldAmount,
        uint256 lastUpdate
    ) {
        StakingInfo memory info = stakingInfo[user];
        return (
            info.stakedAmount,
            pendingYield(user),
            info.lastUpdateTime
        );
    }
    
    /**
     * @dev Admin function to mint tokens for demo purposes
     */
    function mintForDemo(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Simulate price appreciation for demo
     * In real mETH, this would come from staking rewards
     */
    function simulateRebase(uint256 rebaseAmount) external onlyOwner {
        // Distribute rebase to all stakers proportionally
        // This is simplified - in reality it would be more complex
        _mint(address(this), rebaseAmount);
    }
}