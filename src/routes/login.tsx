import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { BearingMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/shell";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <Page className="grid min-h-[70dvh] place-items-center">
      <div className="w-full max-w-md panel p-8">
        <BearingMark className="size-10" />
        <h1 className="mt-4 font-display text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Early access uses your Grok account. After sign-in, join the waitlist —
          testnet is open and approval is immediate.
        </p>
        <div className="mt-6 grid gap-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                variant="outline"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/waitlist" })}
              >
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <p className="mt-6 text-xs text-subtle">
          By continuing you agree to stake fairly and not game arenas.{" "}
          <Link to="/about" className="text-muted underline-offset-2 hover:underline">
            About the protocol
          </Link>
        </p>
      </div>
    </Page>
  );
}
