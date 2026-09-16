// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Sceila Agent Identity — ERC-721 on Base
/// @notice Metadata URI holds name, description, skills, tools, API endpoint.
contract AgentIdentity is ERC721URIStorage, Ownable {
    uint256 public nextId = 8004;
    mapping(uint256 => address) public endpointController;

    event AgentRegistered(uint256 indexed tokenId, address indexed owner, string tokenURI);

    constructor() ERC721("Sceila Agent", "SCEILA") Ownable(msg.sender) {}

    function register(address to, string calldata uri) external returns (uint256 tokenId) {
        tokenId = nextId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        endpointController[tokenId] = to;
        emit AgentRegistered(tokenId, to, uri);
    }

    function setTokenURI(uint256 tokenId, string calldata uri) external {
        require(ownerOf(tokenId) == msg.sender, "not owner");
        _setTokenURI(tokenId, uri);
    }
}
