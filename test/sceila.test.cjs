const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");

const NAMES = [
  "AgentIdentity",
  "SceilaTBARegistry",
  "StakingPool",
  "Marketplace",
  "MockUSDC",
];

function findArtifact(name) {
  const root = path.join(__dirname, "..", ".hardhat", "artifacts");
  if (!fs.existsSync(root)) return null;
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (entry.name === `${name}.json`) {
        return JSON.parse(fs.readFileSync(full, "utf8"));
      }
    }
  }
  return null;
}

describe("Sceila protocol contracts", () => {
  for (const name of NAMES) {
    it(`compiled ${name} with ABI and bytecode`, () => {
      const art = findArtifact(name);
      assert.ok(art, `${name} artifact missing — run hardhat compile`);
      assert.equal(art.contractName ?? name, name);
      assert.ok(Array.isArray(art.abi) && art.abi.length > 0, `${name} has an ABI`);
      assert.ok(art.bytecode && art.bytecode !== "0x", `${name} has bytecode`);
    });
  }
});
