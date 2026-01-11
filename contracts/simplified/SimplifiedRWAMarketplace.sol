// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimplifiedRWAMarketplace
 * @notice Simplified RWA marketplace for hackathon demo
 * @dev Pre-registered assets, simple purchase mechanism
 */
contract SimplifiedRWAMarketplace is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Payment token (USDY)
    IERC20 public immutable paymentToken;
    
    // RWA Asset structure
    struct RWAAsset {
        string name;
        string assetType;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare; // in USDY wei
        uint256 expectedYield; // basis points (800 = 8%)
        bool isActive;
    }
    
    // Storage
    mapping(uint256 => RWAAsset) public assets;
    mapping(uint256 => mapping(address => uint256)) public userShares;
    mapping(address => uint256[]) public userAssets;
    
    uint256 public assetCount;
    
    // Events
    event AssetRegistered(uint256 indexed assetId, string name, uint256 totalShares, uint256 pricePerShare);
    event SharesPurchased(uint256 indexed assetId, address indexed buyer, uint256 shares, uint256 cost);

    constructor(address _paymentToken) {
        require(_paymentToken != address(0), "Invalid payment token");
        paymentToken = IERC20(_paymentToken);
        
        // Pre-register 8 RWA assets for demo
        _registerAsset("Miami Beach Luxury Apartment", "Real Estate", 10000, 50 ether, 800);
        _registerAsset("Corporate Bond Portfolio", "Private Debt", 20000, 50 ether, 650);
        _registerAsset("Renewable Energy Project", "Infrastructure", 15000, 50 ether, 920);
        _registerAsset("Commercial Real Estate Fund", "Real Estate", 40000, 50 ether, 750);
        _registerAsset("Japanese Art Collection Fund", "Alternative", 6000, 50 ether, 1200);
        _registerAsset("Logistics Warehouse Portfolio", "Real Estate", 24000, 50 ether, 780);
        _registerAsset("Private Credit Fund", "Private Debt", 16000, 50 ether, 850);
        _registerAsset("Student Housing Complex", "Real Estate", 12000, 50 ether, 880);
    }

    /**
     * @notice Internal function to register assets
     */
    function _registerAsset(
        string memory name,
        string memory assetType,
        uint256 totalShares,
        uint256 pricePerShare,
        uint256 expectedYield
    ) internal {
        assets[assetCount] = RWAAsset({
            name: name,
            assetType: assetType,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            expectedYield: expectedYield,
            isActive: true
        });
        
        emit AssetRegistered(assetCount, name, totalShares, pricePerShare);
        assetCount++;
    }

    /**
     * @notice Purchase RWA shares with USDY
     * @param assetId Asset ID (0-7)
     * @param shares Number of shares to buy
     */
    function purchaseShares(uint256 assetId, uint256 shares) external nonReentrant {
        require(assetId < assetCount, "Asset not found");
        require(shares > 0, "Shares must be > 0");
        
        RWAAsset storage asset = assets[assetId];
        require(asset.isActive, "Asset not active");
        require(asset.availableShares >= shares, "Insufficient shares available");
        
        uint256 totalCost = shares * asset.pricePerShare;
        
        // Update state
        asset.availableShares -= shares;
        
        // Track user assets
        if (userShares[assetId][msg.sender] == 0) {
            userAssets[msg.sender].push(assetId);
        }
        userShares[assetId][msg.sender] += shares;
        
        // Transfer payment
        paymentToken.safeTransferFrom(msg.sender, address(this), totalCost);
        
        emit SharesPurchased(assetId, msg.sender, shares, totalCost);
    }

    /**
     * @notice Get asset information
     * @param assetId Asset ID
     * @return name Asset name
     * @return totalShares Total number of shares
     * @return availableShares Available shares for purchase
     * @return pricePerShare Price per share in USDY
     * @return expectedYield Expected yield in basis points
     */
    function getAssetInfo(uint256 assetId) external view returns (
        string memory name,
        uint256 totalShares,
        uint256 availableShares,
        uint256 pricePerShare,
        uint256 expectedYield
    ) {
        require(assetId < assetCount, "Asset not found");
        RWAAsset storage asset = assets[assetId];
        return (
            asset.name,
            asset.totalShares,
            asset.availableShares,
            asset.pricePerShare,
            asset.expectedYield
        );
    }

    /**
     * @notice Get user's shares for an asset
     * @param user User address
     * @param assetId Asset ID
     * @return shares Number of shares owned
     */
    function getUserShares(address user, uint256 assetId) external view returns (uint256) {
        return userShares[assetId][user];
    }

    /**
     * @notice Get user's assets
     * @param user User address
     * @return assetIds Array of asset IDs
     */
    function getUserAssets(address user) external view returns (uint256[] memory) {
        return userAssets[user];
    }

    /**
     * @notice Get total number of assets
     * @return count Total asset count
     */
    function getAssetCount() external view returns (uint256) {
        return assetCount;
    }

    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        if (balance > 0) {
            paymentToken.safeTransfer(owner(), balance);
        }
    }
}