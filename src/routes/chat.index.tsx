import { createFileRoute } from "@tanstack/react-router";
import { ChatDesk } from "@/components/chat-desk";

export const Route = createFileRoute("/chat/")({ component: ChatIndex });

function ChatIndex() {
  return <ChatDesk />;
}
