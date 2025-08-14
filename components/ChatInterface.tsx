"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import {
  MESSAGES_SUBSCRIPTION,
  SEND_MESSAGE_ACTION,
  UPDATE_CHAT_TITLE,
} from "@/lib/graphql";
import Message from "./Message";
import toast from "react-hot-toast";
import { ApolloError } from "@apollo/client";

interface ChatInterfaceProps {
  chatId: string;
}

interface MessageType {
  id: string;
  content: string;
  sender: "User" | "assistant";
  created_at: string;
}

interface OptimisticMessage {
  id: string;
  content: string;
  sender: "User";
  created_at: string;
  isOptimistic: true;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<
    OptimisticMessage[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messagesData, loading } = useSubscription(
    MESSAGES_SUBSCRIPTION,
    {
      variables: { chatId },
    }
  );

  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);
  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE);

  const serverMessages: MessageType[] = messagesData?.messages || [];

  // Combine server messages with optimistic messages
  const allMessages = [...serverMessages, ...optimisticMessages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  // Clean up optimistic messages when real messages arrive
  useEffect(() => {
    if (serverMessages.length > 0) {
      setOptimisticMessages((prev) => {
        const filtered = prev.filter(
          (optMsg) =>
            !serverMessages.some(
              (serverMsg) =>
                serverMsg.content === optMsg.content &&
                Math.abs(
                  new Date(serverMsg.created_at).getTime() -
                    new Date(optMsg.created_at).getTime()
                ) < 10000
            )
        );

        // Only update if the array actually changed
        return filtered.length !== prev.length ? filtered : prev;
      });
    }
  }, [serverMessages]);

  // Auto-update chat title function
  const autoUpdateChatTitle = async (userMessage: string) => {
    // Check if this is the first user message in the chat
    const userMessages = serverMessages.filter((msg) => msg.sender === "User");

    if (userMessages.length === 0) {
      // This is the first message, auto-update title
      const title =
        userMessage.length > 40
          ? userMessage.substring(0, 40) + "..."
          : userMessage;

      try {
        await updateChatTitle({
          variables: {
            chatId,
            title,
          },
        });
        console.log("Chat title updated to:", title);
      } catch (err) {
        console.error("Error updating chat title:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;
    const currentTime = new Date().toISOString();

    // Create optimistic message
    const optimisticMessage: OptimisticMessage = {
      id: optimisticId,
      content: userMessage,
      sender: "User",
      created_at: currentTime,
      isOptimistic: true,
    };

    // Clear input and add optimistic message immediately
    setMessage("");
    setOptimisticMessages((prev) => [...prev, optimisticMessage]);
    setIsLoading(true);

    try {
      // Auto-update title if this is the first message
      await autoUpdateChatTitle(userMessage);

      const result = await sendMessageAction({
        variables: {
          chatId: chatId,
          content: userMessage,
        },
      });

      // Remove the specific optimistic message after a delay to ensure server message arrives
      setTimeout(() => {
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticId)
        );
      }, 2000);
    } catch (error: unknown) {
      // Remove optimistic message on error and restore input
      setOptimisticMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticId)
      );
      setMessage(userMessage);

      // Handle ApolloError specifically
      if (error instanceof ApolloError) {
        console.error("Apollo Error Details:");
        console.error("- Message:", error.message);
        console.error("- GraphQL Errors:", error.graphQLErrors);
        console.error("- Network Error:", error.networkError);

        if (error.graphQLErrors?.length > 0) {
          error.graphQLErrors.forEach((gqlError, index) => {
            console.error(`GraphQL Error ${index + 1}:`, gqlError.message);
            console.error("Extensions:", gqlError.extensions);
            console.error("Path:", gqlError.path);
          });
        }

        if (error.networkError) {
          console.error("Network Error Details:", error.networkError);
        }

        toast.error(`GraphQL Error: ${error.message}`);
      } else if (error instanceof Error) {
        console.error("Standard Error:", error.message);
        console.error("Stack:", error.stack);
        toast.error(`Error: ${error.message}`);
      } else {
        console.error("Unknown error type:", error);
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-400 text-sm">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-800  to-black">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {allMessages.length === 0 ? (
          <div className="h-[92%] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Start a Conversation
              </h3>
              <p className="text-gray-400 mt-2">
                Send your first message to begin chatting
              </p>
            </div>
          </div>
        ) : (
          allMessages.map((msg) => (
            <div
              key={msg.id}
              className={`${"isOptimistic" in msg ? "opacity-70" : ""}`}
            >
              <Message
                content={msg.content}
                sender={msg.sender}
                timestamp={msg.created_at}
              />
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700 text-gray-300 max-w-xs lg:max-w-md px-4 py-3 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl p-6">
        <form
          onSubmit={handleSubmit}
          className="flex space-x-4 max-w-4xl mx-auto"
        >
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all duration-200"
              rows={1}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center min-w-[60px] ${
              isLoading || !message.trim()
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transform hover:scale-105"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
