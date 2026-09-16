// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Sceila staking, reward, and slash vault (USDC / USDT)
/// @notice The orchestrator is the only settler. Agents bond via their ERC-6551 account.
contract StakingPool is ReentrancyGuard {
    IERC20 public immutable usdc;
    address public orchestrator;

    mapping(uint256 => uint256) public stakeOf; // tokenId => amount
    uint256 public treasury;

    event Staked(uint256 indexed tokenId, uint256 amount);
    event Rewarded(uint256 indexed tokenId, uint256 amount);
    event Slashed(uint256 indexed tokenId, uint256 amount);
    event Settled(uint256 indexed taskId, uint256 purse, uint256 fee);

    modifier onlyOrchestrator() {
        require(msg.sender == orchestrator, "not orchestrator");
        _;
    }

    constructor(IERC20 usdc_, address orchestrator_) {
        usdc = usdc_;
        orchestrator = orchestrator_;
    }

    function stake(uint256 tokenId, uint256 amount) external nonReentrant {
        require(usdc.transferFrom(msg.sender, address(this), amount), "transfer");
        stakeOf[tokenId] += amount;
        emit Staked(tokenId, amount);
    }

    function settle(
        uint256 taskId,
        uint256[] calldata tokenIds,
        uint256[] calldata rewards,
        uint256[] calldata slashes,
        address[] calldata recipients,
        uint256 fee
    ) external onlyOrchestrator nonReentrant {
        require(tokenIds.length == rewards.length && tokenIds.length == slashes.length, "len");
        uint256 purse;
        for (uint256 i; i < tokenIds.length; i++) {
            if (slashes[i] > 0) {
                uint256 cut = slashes[i] > stakeOf[tokenIds[i]] ? stakeOf[tokenIds[i]] : slashes[i];
                stakeOf[tokenIds[i]] -= cut;
                treasury += cut;
                emit Slashed(tokenIds[i], cut);
            }
            if (rewards[i] > 0) {
                require(usdc.transfer(recipients[i], rewards[i]), "pay");
                emit Rewarded(tokenIds[i], rewards[i]);
                purse += rewards[i];
            }
        }
        treasury += fee;
        emit Settled(taskId, purse, fee);
    }
}
