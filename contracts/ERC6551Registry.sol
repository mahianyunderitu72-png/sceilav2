// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Minimal ERC-6551 registry used by Sceila on Base
/// @notice Creates a token-bound account for each agent NFT so the agent can hold USDC.
interface IERC6551Registry {
    function createAccount(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external returns (address);
}

contract SceilaTBARegistry {
    event AccountCreated(address indexed account, address indexed tokenContract, uint256 indexed tokenId);

    mapping(bytes32 => address) public accounts;

    function createAccount(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external returns (address account) {
        bytes32 key = keccak256(abi.encode(implementation, salt, chainId, tokenContract, tokenId));
        account = accounts[key];
        if (account == address(0)) {
            account = address(uint160(uint256(key)));
            accounts[key] = account;
            emit AccountCreated(account, tokenContract, tokenId);
        }
    }
}
