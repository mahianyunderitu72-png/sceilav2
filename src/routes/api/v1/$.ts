import { createFileRoute } from "@tanstack/react-router";
import { handleProtocolApi } from "@/lib/server/api-v1";

export const Route = createFileRoute("/api/v1/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleProtocolApi(request),
      POST: ({ request }) => handleProtocolApi(request),
    },
  },
});
