import { createFileRoute } from "@tanstack/react-router";
import { ChatDesk } from "@/components/chat-desk";

export const Route = createFileRoute("/chat/$id")({ component: ChatIdPage });

function ChatIdPage() {
  const { id } = Route.useParams();
  return <ChatDesk activeId={Number(id)} />;
}
