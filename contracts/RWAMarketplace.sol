// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title RWAMarketplace
 * @notice RWAFactory + RWAMarketplace combined - Deploy fractionalized RWA tokens (ERC-1155)
 * @dev Allows whitelisted institutions to deploy and trade fractional RWAs - PRODUCTION READY MVP
 */
contract RWAMarketplace is ERC1155, ERC1155Supply, ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant INSTITUTION_ROLE = keccak256("INSTITUTION_ROLE");
    bytes32 public constant YIELD_DISTRIBUTOR_ROLE = keccak256("YIELD_DISTRIBUTOR_ROLE");
    
    // Payment tokens
    IERC20 public immutable usdy;
    IERC20 public immutable usdt0;
    
    // RWA Asset structure
    struct RWAAsset {
        string name;
        string assetType; // "real_estate", "private_debt", etc.
        uint256 totalValue; // USD value
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare; // USD price per share
        uint256 expectedYield; // Annual yield in basis points (800 = 8%)
        address creator;
        bool isActive;
        uint256 createdAt;
    }
    
    // Storage
    mapping(uint256 => RWAAsset) public assets;
    mapping(uint256 => mapping(address => uint256)) public userShares;
    mapping(uint256 => uint256) public yieldPool; // Available yield per asset
    mapping(address => uint256[]) public userAssets;
    
    uint256 public nextAssetId = 1;
    uint256 public totalAssetsCreated;
    
    // Fees
    uint256 public platformFee = 250; // 2.5%
    uint256 public yieldFee = 1000; // 10% on yield
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Events
    event AssetCreated(uint256 indexed assetId, string name, address indexed creator, uint256 totalValue);
    event SharesPurchased(uint256 indexed assetId, address indexed buyer, uint256 shares, uint256 cost);
    event YieldDistributed(uint256 indexed assetId, uint256 amount);
    event YieldClaimed(uint256 indexed assetId, address indexed user, uint256 amount);

    constructor(address _usdy, address _usdt0, address _admin) 
        ERC1155("https://api.mantleprime.xyz/metadata/{id}.json") {
        require(_usdy != address(0) && _admin != address(0), "Invalid addresses");
        
        usdy = IERC20(_usdy);
        usdt0 = IERC20(_usdt0);
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(INSTITUTION_ROLE, _admin);
        _grantRole(YIELD_DISTRIBUTOR_ROLE, _admin);
    }

    /**
     * @notice Create new RWA asset (institutions only)
     * @param name Asset name
     * @param assetType Type of asset
     * @param totalValue Total USD value
     * @param totalShares Total fractional shares
     * @param pricePerShare USD price per share
     * @param expectedYield Expected annual yield (basis points)
     */
    function createAsset(
        string memory name,
        string memory assetType,
        uint256 totalValue,
        uint256 totalShares,
        uint256 pricePerShare,
        uint256 expectedYield
    ) external onlyRole(INSTITUTION_ROLE) whenNotPaused returns (uint256) {
        require(totalShares > 0 && pricePerShare > 0, "Invalid parameters");
        require(totalValue == totalShares * pricePerShare, "Value mismatch");
        
        uint256 assetId = nextAssetId++;
        
        assets[assetId] = RWAAsset({
            name: name,
            assetType: assetType,
            totalValue: totalValue,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            expectedYield: expectedYield,
            creator: msg.sender,
            isActive: true,
            createdAt: block.timestamp
        });
        
        // Mint all shares to creator
        _mint(msg.sender, assetId, totalShares, "");
        userShares[assetId][msg.sender] = totalShares;
        
        totalAssetsCreated++;
        
        emit AssetCreated(assetId, name, msg.sender, totalValue);
        return assetId;
    }

    /**
     * @notice Purchase RWA shares with USDY
     * @param assetId Asset ID
     * @param shares Number of shares to buy
     */
    function purchaseShares(uint256 assetId, uint256 shares) external nonReentrant whenNotPaused {
        require(shares > 0, "Shares must be > 0");
        require(exists(assetId), "Asset not found");
        
        RWAAsset storage asset = assets[assetId];
        require(asset.isActive, "Asset not active");
        require(asset.availableShares >= shares, "Insufficient shares");
        
        uint256 totalCost = shares * asset.pricePerShare;
        uint256 fee = (totalCost * platformFee) / FEE_DENOMINATOR;
        uint256 creatorAmount = totalCost - fee;
        
        // Update state
        asset.availableShares -= shares;
        
        if (userShares[assetId][msg.sender] == 0) {
            userAssets[msg.sender].push(assetId);
        }
        userShares[assetId][msg.sender] += shares;
        
        // Transfer shares
        _safeTransferFrom(asset.creator, msg.sender, assetId, shares, "");
        
        // Handle payment
        usdy.safeTransferFrom(msg.sender, address(this), totalCost);
        usdy.safeTransfer(asset.creator, creatorAmount);
        
        emit SharesPurchased(assetId, msg.sender, shares, totalCost);
    }

    /**
     * @notice Distribute yield to asset holders
     * @param assetId Asset ID
     * @param yieldAmount Total yield to distribute
     */
    function distributeYield(uint256 assetId, uint256 yieldAmount) 
        external onlyRole(YIELD_DISTRIBUTOR_ROLE) nonReentrant whenNotPaused {
        require(exists(assetId), "Asset not found");
        require(yieldAmount > 0, "Yield must be > 0");
        
        uint256 fee = (yieldAmount * yieldFee) / FEE_DENOMINATOR;
        uint256 netYield = yieldAmount - fee;
        
        yieldPool[assetId] += netYield;
        
        usdy.safeTransferFrom(msg.sender, address(this), yieldAmount);
        
        emit YieldDistributed(assetId, netYield);
    }

    /**
     * @notice Claim yield for owned shares
     * @param assetId Asset ID
     */
    function claimYield(uint256 assetId) external nonReentrant whenNotPaused {
        uint256 shares = userShares[assetId][msg.sender];
        require(shares > 0, "No shares owned");
        
        RWAAsset storage asset = assets[assetId];
        uint256 totalShares = asset.totalShares;
        uint256 availableYield = yieldPool[assetId];
        
        require(availableYield > 0, "No yield available");
        
        uint256 userYield = (availableYield * shares) / totalShares;
        yieldPool[assetId] -= userYield;
        
        usdy.safeTransfer(msg.sender, userYield);
        
        emit YieldClaimed(assetId, msg.sender, userYield);
    }

    /**
     * @notice Get user's assets
     * @param user User address
     * @return Array of asset IDs
     */
    function getUserAssets(address user) external view returns (uint256[] memory) {
        return userAssets[user];
    }

    /**
     * @notice Get asset info
     * @param assetId Asset ID
     * @return Asset struct
     */
    function getAsset(uint256 assetId) external view returns (RWAAsset memory) {
        require(exists(assetId), "Asset not found");
        return assets[assetId];
    }

    /**
     * @notice Get claimable yield for user
     * @param assetId Asset ID
     * @param user User address
     * @return Claimable yield amount
     */
    function getClaimableYield(uint256 assetId, address user) external view returns (uint256) {
        uint256 shares = userShares[assetId][user];
        if (shares == 0) return 0;
        
        RWAAsset storage asset = assets[assetId];
        return (yieldPool[assetId] * shares) / asset.totalShares;
    }

    // Admin functions
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
    
    function updateFees(uint256 _platformFee, uint256 _yieldFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_platformFee <= 1000 && _yieldFee <= 2000, "Fees too high");
        platformFee = _platformFee;
        yieldFee = _yieldFee;
    }

    // Required overrides
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}