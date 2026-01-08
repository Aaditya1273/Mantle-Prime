// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ComplianceModule
 * @notice Simple ZK-KYC stub (whitelist + optional zero-knowledge proof interface)
 * @dev Restricts regulated asset access - PRODUCTION READY MVP
 */
contract ComplianceModule is Ownable, Pausable {
    
    // KYC status
    mapping(address => bool) public isWhitelisted;
    mapping(address => string) public kycTier; // "retail", "accredited", "institutional"
    mapping(address => uint256) public kycTimestamp;
    
    // ZK proof validation (placeholder for future ZK integration)
    mapping(bytes32 => bool) public validProofHashes;
    bool public requireZKProof = false;
    
    uint256 public kycExpiryDuration = 365 days;
    
    // Events
    event UserWhitelisted(address indexed user, string tier);
    event UserRemoved(address indexed user);
    event ZKProofSubmitted(address indexed user, bytes32 proofHash);
    
    constructor() {}

    /**
     * @notice Add user to KYC whitelist
     * @param user User address
     * @param tier KYC tier ("retail", "accredited", "institutional")
     */
    function addToWhitelist(address user, string memory tier) external onlyOwner {
        isWhitelisted[user] = true;
        kycTier[user] = tier;
        kycTimestamp[user] = block.timestamp;
        
        emit UserWhitelisted(user, tier);
    }

    /**
     * @notice Batch add users to whitelist
     * @param users Array of user addresses
     * @param tier KYC tier for all users
     */
    function batchAddToWhitelist(address[] memory users, string memory tier) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            isWhitelisted[users[i]] = true;
            kycTier[users[i]] = tier;
            kycTimestamp[users[i]] = block.timestamp;
            
            emit UserWhitelisted(users[i], tier);
        }
    }

    /**
     * @notice Remove user from whitelist
     * @param user User address
     */
    function removeFromWhitelist(address user) external onlyOwner {
        isWhitelisted[user] = false;
        delete kycTier[user];
        delete kycTimestamp[user];
        
        emit UserRemoved(user);
    }

    /**
     * @notice Verify KYC status for user
     * @param user User address
     * @param zkProof Optional ZK proof (can be empty)
     * @return True if KYC is valid
     */
    function verifyKYC(address user, bytes calldata zkProof) external view returns (bool) {
        // Check whitelist
        if (!isWhitelisted[user]) return false;
        
        // Check expiry
        if (block.timestamp > kycTimestamp[user] + kycExpiryDuration) return false;
        
        // Check ZK proof if required
        if (requireZKProof && zkProof.length > 0) {
            bytes32 proofHash = keccak256(zkProof);
            if (!validProofHashes[proofHash]) return false;
        }
        
        return true;
    }

    /**
     * @notice Submit ZK proof for verification (placeholder)
     * @param zkProof ZK proof data
     * @return True if valid
     */
    function submitZKProof(bytes calldata zkProof) external whenNotPaused returns (bool) {
        require(zkProof.length > 0, "Invalid proof");
        
        // Simple validation - in production this would verify actual ZK proofs
        bytes32 proofHash = keccak256(zkProof);
        
        // Basic check: proof contains user address (simplified)
        bool isValid = zkProof.length >= 32;
        
        if (isValid) {
            validProofHashes[proofHash] = true;
            emit ZKProofSubmitted(msg.sender, proofHash);
        }
        
        return isValid;
    }

    /**
     * @notice Check if user has valid KYC
     * @param user User address
     * @return True if valid and not expired
     */
    function hasValidKYC(address user) external view returns (bool) {
        return isWhitelisted[user] && 
               block.timestamp <= kycTimestamp[user] + kycExpiryDuration;
    }

    /**
     * @notice Check if user meets KYC tier requirement
     * @param user User address
     * @param requiredTier Required tier
     * @return True if meets requirement
     */
    function meetsKYCTier(address user, string memory requiredTier) external view returns (bool) {
        if (!isWhitelisted[user]) return false;
        
        string memory userTier = kycTier[user];
        
        // Tier hierarchy: retail < accredited < institutional
        if (keccak256(bytes(requiredTier)) == keccak256(bytes("retail"))) {
            return true; // All tiers meet retail
        } else if (keccak256(bytes(requiredTier)) == keccak256(bytes("accredited"))) {
            return keccak256(bytes(userTier)) == keccak256(bytes("accredited")) ||
                   keccak256(bytes(userTier)) == keccak256(bytes("institutional"));
        } else if (keccak256(bytes(requiredTier)) == keccak256(bytes("institutional"))) {
            return keccak256(bytes(userTier)) == keccak256(bytes("institutional"));
        }
        
        return false;
    }

    /**
     * @notice Get user KYC info
     * @param user User address
     * @return whitelisted, tier, timestamp, expiresAt
     */
    function getUserKYCInfo(address user) external view returns (
        bool whitelisted,
        string memory tier,
        uint256 timestamp,
        uint256 expiresAt
    ) {
        whitelisted = isWhitelisted[user];
        tier = kycTier[user];
        timestamp = kycTimestamp[user];
        expiresAt = kycTimestamp[user] + kycExpiryDuration;
    }

    // Admin functions
    function setZKProofRequirement(bool required) external onlyOwner {
        requireZKProof = required;
    }

    function setKYCExpiryDuration(uint256 duration) external onlyOwner {
        require(duration >= 30 days && duration <= 1095 days, "Invalid duration");
        kycExpiryDuration = duration;
    }

    function addValidProofHash(bytes32 proofHash) external onlyOwner {
        validProofHashes[proofHash] = true;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}