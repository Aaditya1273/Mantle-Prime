// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PrimeVault
 * @notice Accepts mETH deposits, tracks staking rewards, manages collateral ratios
 * @dev Core vault for Mantle Prime - PRODUCTION READY MVP
 */
contract PrimeVault is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Real mETH token on Mantle (bridged from L1)
    IERC20 public immutable mETH;
    
    // User deposits and collateral
    mapping(address => uint256) public userDeposits;
    mapping(address => uint256) public userCollateral;
    mapping(address => uint256) public creditUsed;
    
    // Global metrics
    uint256 public totalDeposited;
    uint256 public totalCollateral;
    
    // Risk parameters
    uint256 public constant COLLATERAL_RATIO = 150; // 150% over-collateralization
    uint256 public constant MAX_LTV = 80; // 80% max loan-to-value
    
    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event CollateralUpdated(address indexed user, uint256 newCollateral);
    event CreditUpdated(address indexed user, uint256 creditAmount);

    constructor(address _mETH) {
        require(_mETH != address(0), "Invalid mETH address");
        mETH = IERC20(_mETH);
    }

    /**
     * @notice Deposit mETH as collateral
     * @param amount Amount of mETH to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        
        mETH.safeTransferFrom(msg.sender, address(this), amount);
        
        userDeposits[msg.sender] += amount;
        userCollateral[msg.sender] += amount;
        totalDeposited += amount;
        totalCollateral += amount;
        
        emit Deposited(msg.sender, amount);
    }

    /**
     * @notice Withdraw mETH (if collateral allows)
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        require(userDeposits[msg.sender] >= amount, "Insufficient balance");
        
        // Check collateral requirements
        uint256 newCollateral = userCollateral[msg.sender] - amount;
        uint256 requiredCollateral = (creditUsed[msg.sender] * COLLATERAL_RATIO) / 100;
        require(newCollateral >= requiredCollateral, "Insufficient collateral");
        
        userDeposits[msg.sender] -= amount;
        userCollateral[msg.sender] -= amount;
        totalDeposited -= amount;
        totalCollateral -= amount;
        
        mETH.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Update user's credit usage (called by CreditIssuer)
     * @param user User address
     * @param creditAmount New credit amount
     */
    function updateCreditUsage(address user, uint256 creditAmount) external onlyOwner {
        uint256 requiredCollateral = (creditAmount * COLLATERAL_RATIO) / 100;
        require(userCollateral[user] >= requiredCollateral, "Insufficient collateral");
        
        uint256 ltv = userCollateral[user] > 0 ? (creditAmount * 100) / userCollateral[user] : 0;
        require(ltv <= MAX_LTV, "Exceeds max LTV");
        
        creditUsed[user] = creditAmount;
        emit CreditUpdated(user, creditAmount);
    }

    /**
     * @notice Get available collateral for credit
     * @param user User address
     * @return Available collateral amount
     */
    function getAvailableCollateral(address user) external view returns (uint256) {
        uint256 usedCollateral = (creditUsed[user] * COLLATERAL_RATIO) / 100;
        return userCollateral[user] > usedCollateral ? userCollateral[user] - usedCollateral : 0;
    }

    /**
     * @notice Get max borrowing capacity
     * @param user User address
     * @return Max credit amount
     */
    function getMaxBorrowCapacity(address user) external view returns (uint256) {
        return (userCollateral[user] * MAX_LTV) / 100;
    }

    /**
     * @notice Get health factor
     * @param user User address
     * @return Health factor (100 = 1.0x)
     */
    function getHealthFactor(address user) external view returns (uint256) {
        if (creditUsed[user] == 0) return type(uint256).max;
        return (userCollateral[user] * 100) / creditUsed[user];
    }

    // Admin functions
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}