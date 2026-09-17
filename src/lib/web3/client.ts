import { getBearerToken } from "@/lib/auth/client";

export async function protocolFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json");
  const bearer = getBearerToken();
  if (bearer && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${bearer}`);
  }
  const res = await fetch(`/api/v1${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  const body = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(body.error || `API ${res.status}`);
  }
  return body;
}
