// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Sceila agent marketplace — sale, lease, hire in USDC
contract Marketplace is ReentrancyGuard {
    IERC20 public immutable usdc;
    IERC721 public immutable identity;
    address public treasury;
    uint16 public feeBps = 250; // 2.5%

    enum Kind { Sale, Lease, Hire }

    struct Listing {
        address seller;
        uint256 tokenId;
        Kind kind;
        uint256 price;
        bool open;
    }

    uint256 public nextListingId = 1;
    mapping(uint256 => Listing) public listings;

    event Listed(uint256 indexed id, uint256 indexed tokenId, Kind kind, uint256 price);
    event Filled(uint256 indexed id, address indexed buyer, uint256 fee);

    constructor(IERC20 usdc_, IERC721 identity_, address treasury_) {
        usdc = usdc_;
        identity = identity_;
        treasury = treasury_;
    }

    function list(uint256 tokenId, Kind kind, uint256 price) external returns (uint256 id) {
        require(identity.ownerOf(tokenId) == msg.sender, "not owner");
        id = nextListingId++;
        listings[id] = Listing(msg.sender, tokenId, kind, price, true);
        emit Listed(id, tokenId, kind, price);
    }

    function fill(uint256 id) external nonReentrant {
        Listing storage l = listings[id];
        require(l.open, "closed");
        uint256 fee = (l.price * feeBps) / 10_000;
        require(usdc.transferFrom(msg.sender, l.seller, l.price - fee), "pay seller");
        require(usdc.transferFrom(msg.sender, treasury, fee), "pay fee");
        l.open = false;
        if (l.kind == Kind.Sale) {
            identity.safeTransferFrom(l.seller, msg.sender, l.tokenId);
        }
        emit Filled(id, msg.sender, fee);
    }
}
