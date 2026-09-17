import type { IncomingMessage, ServerResponse } from "node:http";
import express from "express";
import { handleProtocolApi } from "@/lib/server/api-v1";

type ConnectNext = (err?: unknown) => void;

function createProtocolApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "512kb" }));

  app.use((req, res, next) => {
    void (async () => {
      const host = String(req.headers.host ?? "127.0.0.1");
      const url = `http://${host}${req.originalUrl || req.url}`;
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          for (const item of value) headers.append(key, item);
        } else {
          headers.set(key, value);
        }
      }
      const init: RequestInit = { method: req.method, headers };
      if (req.method !== "GET" && req.method !== "HEAD") {
        init.body = JSON.stringify(req.body ?? {});
      }
      const response = await handleProtocolApi(new Request(url, init));
      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      const buf = Buffer.from(await response.arrayBuffer());
      res.end(buf);
    })().catch(next);
  });

  return app;
}

let app: ReturnType<typeof createProtocolApp> | null = null;

function getProtocolApp() {
  app ??= createProtocolApp();
  return app;
}

/** Vite/Connect entry: only /api/v1 is Express; auth stays on Better Auth. */
export function handleConnect(
  req: IncomingMessage,
  res: ServerResponse,
  next: ConnectNext,
) {
  const pathOnly = (req.url ?? "").split("?")[0] ?? "";
  if (!pathOnly.startsWith("/api/v1")) {
    next();
    return;
  }
  getProtocolApp()(req, res);
}
