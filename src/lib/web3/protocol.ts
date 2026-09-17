export const CHAIN = {
  id: 84532,
  hex: "0x14a34",
  name: "Base Sepolia",
  rpc: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org",
  currency: { name: "ETH", symbol: "ETH", decimals: 18 },
} as const;

/** Testnet placeholders until `npm run chain:deploy` writes deployed.json. */
export const ADDRESSES = {
  usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  identity: "0x5CE11A01DE11A710000000000000000000000001",
  tba: "0x5CE11A01DE11A710000000000000000000000002",
  staking: "0x5CE11A01DE11A710000000000000000000000003",
  marketplace: "0x5CE11A01DE11A710000000000000000000000004",
} as const;

export const ABI = {
  identity: [
    "function register(address to, string uri) returns (uint256)",
    "function setTokenURI(uint256 tokenId, string uri)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "event AgentRegistered(uint256 indexed tokenId, address indexed owner, string tokenURI)",
  ],
  tba: [
    "function createAccount(address implementation, bytes32 salt, uint256 chainId, address tokenContract, uint256 tokenId) returns (address)",
  ],
  staking: [
    "function stake(uint256 tokenId, uint256 amount)",
    "function stakeOf(uint256 tokenId) view returns (uint256)",
    "function settle(uint256 taskId, uint256[] tokenIds, uint256[] rewards, uint256[] slashes, address[] recipients, uint256 fee)",
  ],
  marketplace: [
    "function list(uint256 tokenId, uint8 kind, uint256 price) returns (uint256)",
    "function fill(uint256 id)",
  ],
} as const;

export const CONTRACTS = [
  {
    id: "identity",
    name: "AgentIdentity",
    file: "contracts/AgentIdentity.sol",
    standard: "ERC-721",
    address: ADDRESSES.identity,
    summary: "Mints the agent NFT. Metadata URI holds name, skills, tools, and API endpoint.",
  },
  {
    id: "tba",
    name: "SceilaTBARegistry",
    file: "contracts/ERC6551Registry.sol",
    standard: "ERC-6551",
    address: ADDRESSES.tba,
    summary: "Token-bound account so the agent can hold USDC, stake, and get paid.",
  },
  {
    id: "staking",
    name: "StakingPool",
    file: "contracts/StakingPool.sol",
    standard: "USDC vault",
    address: ADDRESSES.staking,
    summary: "Stake, reward, slash. Only the orchestrator settles an arena.",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    file: "contracts/Marketplace.sol",
    standard: "Sale / lease / hire",
    address: ADDRESSES.marketplace,
    summary: "List an agent. Fill in USDC. Protocol fee 2.5%.",
  },
] as const;
