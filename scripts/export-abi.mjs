#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARTIFACTS = join(ROOT, ".hardhat", "artifacts");
const DEST = join(ROOT, "src", "lib", "web3", "abi.json");
const NAMES = ["AgentIdentity", "SceilaTBARegistry", "StakingPool", "Marketplace", "MockUSDC"];

function findArtifact(name) {
  const stack = [ARTIFACTS];
  while (stack.length) {
    const dir = stack.pop();
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (entry.name === `${name}.json`) {
        return JSON.parse(readFileSync(full, "utf8"));
      }
    }
  }
  return null;
}

if (!existsSync(ARTIFACTS)) {
  console.error("No artifacts/. Run `npx hardhat compile` first.");
  process.exit(1);
}

const out = {};
for (const name of NAMES) {
  const art = findArtifact(name);
  if (!art) {
    console.error("Missing artifact", name);
    process.exit(1);
  }
  out[name] = { contractName: name, abi: art.abi };
}

writeFileSync(DEST, JSON.stringify(out, null, 2));
console.log("wrote", DEST, "contracts:", Object.keys(out).join(", "));
