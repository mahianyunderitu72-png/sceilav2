import { attachWallet, generateWallet } from "@/lib/server/profile";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shortAddress } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { useState } from "react";

export function WalletConnect({
  profile,
  onProfile,
}: {
  profile: Profile | null;
  onProfile: (p: Profile | null) => void;
}) {
  const wallet = useWallet();
  const [manual, setManual] = useState("");
  const [note, setNote] = useState<string | null>(null);

  async function persist(address: string) {
    const next = await attachWallet({ data: { address } });
    onProfile(next);
    setNote("Wallet attached on Base Sepolia.");
  }

  return (
    <div className="panel p-4">
      <p className="kicker">Wallet</p>
      <p className="mt-2 font-mono text-sm">
        {shortAddress(profile?.wallet_address ?? wallet.address)}
      </p>
      <p className="mt-1 text-xs text-muted">
        Agents mint to this address. Stake and settlement are USDC on Base
        Sepolia.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {wallet.available ? (
          <Button
            type="button"
            size="sm"
            disabled={wallet.busy}
            onClick={() => {
              void wallet.connect().then((addr) => {
                if (addr) void persist(addr);
              });
            }}
          >
            {wallet.busy ? "Connecting…" : "Connect wallet"}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant={wallet.available ? "outline" : "primary"}
          onClick={() => {
            void generateWallet().then((p) => {
              onProfile(p);
              setNote("Simulated Base wallet generated for testnet.");
            });
          }}
        >
          Generate testnet wallet
        </Button>
      </div>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void persist(manual).catch((err) =>
            setNote(err instanceof Error ? err.message : "Could not attach."),
          );
        }}
      >
        <Input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="0x…"
          className="max-w-sm"
        />
        <Button type="submit" size="sm" variant="secondary">
          Attach
        </Button>
      </form>
      {wallet.error ? <p className="mt-2 text-sm text-danger">{wallet.error}</p> : null}
      {note ? <p className="mt-2 text-sm text-muted">{note}</p> : null}
    </div>
  );
}
