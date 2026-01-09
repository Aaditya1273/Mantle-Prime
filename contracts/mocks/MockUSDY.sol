// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDY
 * @dev Mock USDY token for hackathon demo
 * Simulates yield-bearing stablecoin with automatic yield accrual
 */
contract MockUSDY is ERC20, Ownable {
    
    // Yield parameters for USDY (typically 4-5% APY)
    uint256 public constant ANNUAL_YIELD_RATE = 450; // 4.50% APY
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    // User yield tracking
    struct YieldInfo {
        uint256 balance;
        uint256 lastUpdateTime;
        uint256 accruedYield;
    }
    
    mapping(address => YieldInfo) public yieldInfo;
    
    // Authorized minters (CreditIssuer contract)
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event YieldAccrued(address indexed user, uint256 yield);
    event AuthorizedMinterAdded(address indexed minter);
    event AuthorizedMinterRemoved(address indexed minter);
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender], "Not authorized minter");
        _;
    }
    
    constructor() ERC20("Mock Ondo US Dollar Yield", "USDY") {
        // Initialize with some supply for testing
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    /**
     * @dev Add authorized minter (CreditIssuer contract)
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit AuthorizedMinterAdded(minter);
    }
    
    /**
     * @dev Remove authorized minter
     */
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit AuthorizedMinterRemoved(minter);
    }
    
    /**
     * @dev Mint USDY (only by authorized contracts like CreditIssuer)
     */
    function mint(address to, uint256 amount) external onlyAuthorizedMinter {
        _updateYield(to);
        _mint(to, amount);
        yieldInfo[to].balance += amount;
    }
    
    /**
     * @dev Burn USDY (for repayments)
     */
    function burn(address from, uint256 amount) external onlyAuthorizedMinter {
        _updateYield(from);
        require(balanceOf(from) >= amount, "Insufficient balance");
        
        _burn(from, amount);
        yieldInfo[from].balance = yieldInfo[from].balance > amount ? 
            yieldInfo[from].balance - amount : 0;
    }
    
    /**
     * @dev Calculate pending yield for a user
     */
    function pendingYield(address user) public view returns (uint256) {
        YieldInfo memory info = yieldInfo[user];
        if (info.balance == 0) return info.accruedYield;
        
        uint256 timeElapsed = block.timestamp - info.lastUpdateTime;
        uint256 newYield = (info.balance * ANNUAL_YIELD_RATE * timeElapsed) / 
                          (BASIS_POINTS * SECONDS_PER_YEAR);
        
        return info.accruedYield + newYield;
    }
    
    /**
     * @dev Update user's yield (called before balance changes)
     */
    function _updateYield(address user) internal {
        uint256 yield = pendingYield(user);
        yieldInfo[user].accruedYield = yield;
        yieldInfo[user].lastUpdateTime = block.timestamp;
        
        if (yield > 0) {
            emit YieldAccrued(user, yield);
        }
    }
    
    /**
     * @dev Claim accumulated yield
     */
    function claimYield() external {
        _updateYield(msg.sender);
        
        uint256 yield = yieldInfo[msg.sender].accruedYield;
        require(yield > 0, "No yield to claim");
        
        yieldInfo[msg.sender].accruedYield = 0;
        _mint(msg.sender, yield);
        
        emit YieldAccrued(msg.sender, yield);
    }
    
    /**
     * @dev Override transfer to update yield for both parties
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        _updateYield(msg.sender);
        _updateYield(to);
        
        bool success = super.transfer(to, amount);
        
        if (success) {
            yieldInfo[msg.sender].balance = yieldInfo[msg.sender].balance > amount ? 
                yieldInfo[msg.sender].balance - amount : 0;
            yieldInfo[to].balance += amount;
        }
        
        return success;
    }
    
    /**
     * @dev Override transferFrom to update yield
     */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        _updateYield(from);
        _updateYield(to);
        
        bool success = super.transferFrom(from, to, amount);
        
        if (success) {
            yieldInfo[from].balance = yieldInfo[from].balance > amount ? 
                yieldInfo[from].balance - amount : 0;
            yieldInfo[to].balance += amount;
        }
        
        return success;
    }
    
    /**
     * @dev Get user's yield information
     */
    function getYieldInfo(address user) external view returns (
        uint256 balance,
        uint256 pendingYieldAmount,
        uint256 lastUpdate
    ) {
        YieldInfo memory info = yieldInfo[user];
        return (
            info.balance,
            pendingYield(user),
            info.lastUpdateTime
        );
    }
    
    /**
     * @dev Faucet for demo purposes
     */
    function faucet() external {
        require(balanceOf(msg.sender) < 10000 * 10**18, "Already have enough USDY");
        
        uint256 faucetAmount = 5000 * 10**18; // 5000 USDY per request
        _mint(msg.sender, faucetAmount);
        yieldInfo[msg.sender].balance += faucetAmount;
        yieldInfo[msg.sender].lastUpdateTime = block.timestamp;
    }
}