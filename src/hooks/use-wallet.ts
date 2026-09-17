import { useCallback, useEffect, useState } from "react";
import { CHAIN } from "@/lib/web3/protocol";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

function injected(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  const eth = (window as Window & { ethereum?: EthereumProvider }).ethereum;
  return eth ?? null;
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const available = Boolean(injected());

  useEffect(() => {
    const eth = injected();
    if (!eth) return;
    void eth.request({ method: "eth_accounts" }).then((accounts) => {
      const list = accounts as string[];
      if (list[0]) setAddress(list[0]);
    });
    const onAccounts = (...args: unknown[]) => {
      const list = args[0] as string[] | undefined;
      setAddress(list?.[0] ?? null);
    };
    eth.on?.("accountsChanged", onAccounts);
    return () => eth.removeListener?.("accountsChanged", onAccounts);
  }, []);

  const connect = useCallback(async () => {
    const eth = injected();
    if (!eth) {
      setError("No injected wallet in this browser. Generate a testnet wallet instead.");
      return null;
    }
    setBusy(true);
    setError(null);
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      const next = accounts[0];
      if (!next) throw new Error("Wallet returned no account.");
      try {
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN.hex }],
        });
      } catch {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: CHAIN.hex,
              chainName: CHAIN.name,
              rpcUrls: [CHAIN.rpc],
              nativeCurrency: CHAIN.currency,
              blockExplorerUrls: [CHAIN.explorer],
            },
          ],
        });
      }
      setAddress(next);
      return next;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not connect wallet.";
      setError(msg);
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  return { address, available, busy, error, connect };
}
