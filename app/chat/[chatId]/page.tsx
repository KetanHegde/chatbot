"use client";

import { use, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import ChatList from "@/components/ChatList";
import ChatInterface from "@/components/ChatInterface";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { chatId } = use(params);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="flex-1 flex overflow-hidden">
          <ChatList
            currentChatId={chatId}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
          <div className="flex-1 flex sm:ml-0">
            <ChatInterface chatId={chatId} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
