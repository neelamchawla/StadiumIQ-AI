import type { Metadata } from "next";
import { ChatInterface } from "@/features/chat/chat-interface";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Chat with FIFA Stadium Intelligence AI for navigation, crowd info, and assistance.",
};

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">AI Chat</h1>
        <p className="mt-1 text-muted-foreground">
          Your multilingual stadium guide powered by artificial intelligence
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
