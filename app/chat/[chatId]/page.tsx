"use client";

import { use } from "react";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import ChatList from "@/components/ChatList";
import ChatInterface from "@/components/ChatInterface";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { chatId } = use(params);

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <ChatList currentChatId={chatId} />
          <ChatInterface chatId={chatId} />
        </div>
      </div>
    </AuthGuard>
  );
}
