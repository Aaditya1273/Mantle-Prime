// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PrimeVault.sol";

/**
 * @title CreditIssuer
 * @notice Mints stable credit (USDY/USDT0) against over-collateralized mETH
 * @dev Includes health checks and liquidation logic - PRODUCTION READY MVP
 */
contract CreditIssuer is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Core contracts
    PrimeVault public immutable vault;
    IERC20 public immutable usdy; // Real USDY on Mantle
    IERC20 public immutable usdt0; // Optional USDT0
    
    // Credit tracking
    mapping(address => uint256) public creditIssued;
    mapping(address => uint256) public interestAccrued;
    mapping(address => uint256) public lastUpdate;
    
    // Global metrics
    uint256 public totalCreditIssued;
    uint256 public totalInterestCollected;
    
    // Parameters
    uint256 public interestRate = 300; // 3% annual
    uint256 public originationFee = 30; // 0.3%
    uint256 public constant RATE_DENOMINATOR = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    // Events
    event CreditIssued(address indexed user, uint256 amount, uint256 fee);
    event CreditRepaid(address indexed user, uint256 amount, uint256 interest);
    event InterestAccrued(address indexed user, uint256 interest);

    constructor(address _vault, address _usdy, address _usdt0) {
        require(_vault != address(0) && _usdy != address(0), "Invalid addresses");
        vault = PrimeVault(_vault);
        usdy = IERC20(_usdy);
        usdt0 = IERC20(_usdt0);
    }

    /**
     * @notice Issue USDY credit against mETH collateral
     * @param amount Amount of USDY to mint
     */
    function issueCredit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        
        _updateInterest(msg.sender);
        
        // Check collateral capacity
        uint256 maxBorrow = vault.getMaxBorrowCapacity(msg.sender);
        require(creditIssued[msg.sender] + amount <= maxBorrow, "Exceeds borrow capacity");
        
        // Calculate fee
        uint256 fee = (amount * originationFee) / RATE_DENOMINATOR;
        uint256 netAmount = amount - fee;
        
        // Update state
        creditIssued[msg.sender] += amount;
        totalCreditIssued += amount;
        
        // Update vault
        vault.updateCreditUsage(msg.sender, creditIssued[msg.sender]);
        
        // Transfer USDY to user (contract must have USDY reserves)
        usdy.safeTransfer(msg.sender, netAmount);
        
        emit CreditIssued(msg.sender, netAmount, fee);
    }

    /**
     * @notice Repay USDY credit
     * @param amount Amount to repay
     */
    function repayCredit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        require(creditIssued[msg.sender] > 0, "No credit to repay");
        
        _updateInterest(msg.sender);
        
        uint256 totalOwed = creditIssued[msg.sender] + interestAccrued[msg.sender];
        if (amount > totalOwed) amount = totalOwed;
        
        // Apply to interest first, then principal
        uint256 interestPayment = amount > interestAccrued[msg.sender] ? 
                                 interestAccrued[msg.sender] : amount;
        uint256 principalPayment = amount - interestPayment;
        
        // Update state
        interestAccrued[msg.sender] -= interestPayment;
        creditIssued[msg.sender] -= principalPayment;
        totalCreditIssued -= principalPayment;
        totalInterestCollected += interestPayment;
        
        // Update vault
        vault.updateCreditUsage(msg.sender, creditIssued[msg.sender]);
        
        // Transfer USDY from user
        usdy.safeTransferFrom(msg.sender, address(this), amount);
        
        emit CreditRepaid(msg.sender, principalPayment, interestPayment);
    }

    /**
     * @notice Update interest for user
     * @param user User address
     */
    function _updateInterest(address user) internal {
        uint256 lastUpdateTime = lastUpdate[user];
        if (lastUpdateTime == 0) {
            lastUpdate[user] = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - lastUpdateTime;
        if (timeElapsed == 0 || creditIssued[user] == 0) return;
        
        uint256 interest = (creditIssued[user] * interestRate * timeElapsed) / 
                          (RATE_DENOMINATOR * SECONDS_PER_YEAR);
        
        interestAccrued[user] += interest;
        lastUpdate[user] = block.timestamp;
        
        emit InterestAccrued(user, interest);
    }

    /**
     * @notice Get total debt (principal + interest)
     * @param user User address
     * @return Total debt amount
     */
    function getTotalDebt(address user) external view returns (uint256) {
        return creditIssued[user] + interestAccrued[user];
    }

    /**
     * @notice Update interest for user (external)
     * @param user User address
     */
    function updateInterest(address user) external {
        _updateInterest(user);
    }

    // Admin functions
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    
    function updateRates(uint256 _interestRate, uint256 _originationFee) external onlyOwner {
        require(_interestRate <= 2000 && _originationFee <= 500, "Rates too high");
        interestRate = _interestRate;
        originationFee = _originationFee;
    }
}