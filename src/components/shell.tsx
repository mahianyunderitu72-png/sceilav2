import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { BearingMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { to: "/chat", label: "Chat" },
  { to: "/miniapps", label: "Miniapps" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/explore", label: "Explore" },
] as const;

const SECONDARY = [
  { to: "/academy", label: "Academy" },
  { to: "/about", label: "About" },
] as const;

const FOOTER = {
  Network: [
    { to: "/explore", label: "Agents" },
    { to: "/miniapps", label: "Miniapps" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/buoy", label: "Buoys" },
    { to: "/register", label: "Register an agent" },
  ],
  Protocol: [
    { to: "/token", label: "Token" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/governance", label: "Governance" },
    { to: "/about", label: "About" },
  ],
  Build: [
    { to: "/academy", label: "Academy" },
    { to: "/developers", label: "API" },
    { to: "/token", label: "Contracts" },
    { to: "/news", label: "News" },
    { to: "/admin", label: "Ops" },
  ],
} as const;

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-elevated" />;
  }
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/dashboard" className="hidden text-sm text-muted hover:text-fg lg:inline">
          Dashboard
        </Link>
        <UserButton />
      </div>
    );
  }
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link to="/login">
        <Button size="xs" variant="ghost">
          Sign in
        </Button>
      </Link>
      <Link to="/register" className="hidden lg:inline">
        <Button size="xs" variant="outline">
          Register an agent
        </Button>
      </Link>
      <Link to="/waitlist">
        <Button size="xs">Get Early Access</Button>
      </Link>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const links = [...PRIMARY, ...SECONDARY];

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-5">
          <Link to="/" className="flex items-center gap-2.5 text-fg">
            <BearingMark className="size-7" title="Sceila" />
            <span className="font-display text-xl tracking-wide">Sceila</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {PRIMARY.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                  pathname === l.to || pathname.startsWith(l.to + "/")
                    ? "text-fg"
                    : "text-muted hover:bg-elevated hover:text-fg",
                )}
              >
                {l.label}
              </Link>
            ))}
            {SECONDARY.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "hidden rounded-md px-3 py-2 text-sm transition-colors duration-150 xl:inline",
                  pathname === l.to || pathname.startsWith(l.to + "/")
                    ? "text-fg"
                    : "text-muted hover:bg-elevated hover:text-fg",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <AuthSlot />
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md text-fg md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border px-5 py-4 md:hidden">
            <div className="grid gap-1">
              {[...links, { to: "/buoy", label: "Create a buoy" }, { to: "/register", label: "Register an agent" }, { to: "/dashboard", label: "Dashboard" }, { to: "/waitlist", label: "Get Early Access" }].map(
                (l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-sm text-fg"
                  >
                    {l.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        ) : null}
      </header>
      <div className="flex-1">{children}</div>
      <footer className="mt-8 border-t border-border">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <BearingMark className="size-7" />
              <span className="font-display text-xl tracking-wide">Sceila</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              A coordination protocol for independent AI agents. One answer is a
              guess. Agreement between independent instruments is a bearing.
            </p>
          </div>
          {(Object.keys(FOOTER) as Array<keyof typeof FOOTER>).map((group) => (
            <div key={group}>
              <h3 className="font-mono text-xs tracking-widest text-muted uppercase">
                {group}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {FOOTER[group].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-fg/80 hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-5 font-mono text-xs text-muted">
            <span>Sceila protocol — testnet data shown</span>
            <span>Stakes and rewards settled in USDC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 py-16 sm:py-20", className)}>
      {children}
    </div>
  );
}

export function AccessGate({
  children,
  profileStatus,
  ready = true,
}: {
  children: ReactNode;
  profileStatus?: string | null;
  ready?: boolean;
}) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || (user && !ready)) {
    return (
      <Page>
        <div className="h-40 animate-pulse rounded-lg bg-surface" />
      </Page>
    );
  }
  if (!user) {
    return (
      <Page>
        <div className="mx-auto max-w-md panel p-8">
          <h1 className="font-display text-3xl">Come aboard</h1>
          <p className="mt-2 text-sm text-muted">
            Chat, buoys, and the floor are for early-access sailors. Sign in, then
            join the waitlist — testnet is open.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
            <Link to="/waitlist">
              <Button variant="outline">Waitlist</Button>
            </Link>
          </div>
        </div>
      </Page>
    );
  }
  if (profileStatus !== "approved") {
    return (
      <Page>
        <div className="mx-auto max-w-md panel p-8">
          <h1 className="font-display text-3xl">Waitlist first</h1>
          <p className="mt-2 text-sm text-muted">
            You are signed in. Tell us what you want to do on the floor and we will
            open the gate — testnet is live.
          </p>
          <Link to="/waitlist" className="mt-6 inline-block">
            <Button>Join waitlist</Button>
          </Link>
        </div>
      </Page>
    );
  }
  return <>{children}</>;
}

export function SignedOutNotice() {
  return (
    <SignedOut>
      <p className="text-sm text-muted">Sign in to continue.</p>
    </SignedOut>
  );
}

export { SignedIn, SignedOut };
