"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthenticationStatus } from "@nhost/nextjs";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CHATS, INSERT_CHAT } from "@/lib/graphql";
import AuthGuard from "@/components/AuthGuard";
import toast from "react-hot-toast";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const router = useRouter();
  const [isCreatingDefaultChat, setIsCreatingDefaultChat] = useState(false);

  const { data: chatsData, loading: chatsLoading } = useQuery(GET_CHATS, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network", // Ensure fresh data
  });
  const [insertChat] = useMutation(INSERT_CHAT);

  const chats = chatsData?.chats || [];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  // Auto-create first chat and navigate to it
  useEffect(() => {
    if (
      isAuthenticated &&
      !chatsLoading &&
      chats.length === 0 &&
      !isCreatingDefaultChat
    ) {
      createDefaultChatAndNavigate();
    } else if (isAuthenticated && !chatsLoading && chats.length > 0) {
      // If user has chats, navigate to the most recent one
      const mostRecentChat = chats[0]; // Already ordered by updated_at desc
      router.push(`/chat/${mostRecentChat.id}`);
    }
  }, [isAuthenticated, isLoading, chatsLoading, chats.length, router]);

  const createDefaultChatAndNavigate = async () => {
    setIsCreatingDefaultChat(true);

    try {
      const result = await insertChat({
        variables: {
          title: "Welcome Chat",
        },
        // Update cache immediately and refetch to ensure consistency
        refetchQueries: [{ query: GET_CHATS }],
        awaitRefetchQueries: true,
      });

      const newChatId = result.data?.insert_chats_one?.id;
      if (newChatId) {
        toast.success("Welcome! Let's start chatting!");
        router.push(`/chat/${newChatId}`);
      }
    } catch (err) {
      console.error("Error creating default chat:", err);
      toast.error("Failed to create welcome chat");
    } finally {
      setIsCreatingDefaultChat(false);
    }
  };

  if (isLoading || chatsLoading || isCreatingDefaultChat) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            {isLoading ? "Loading..." : "Setting up your first chat..."}
          </h2>
          <p className="text-gray-400">
            {isLoading
              ? "Please wait while we prepare your experience"
              : "Creating your welcome chat"}
          </p>
        </div>
      </div>
    );
  }

  // This should rarely be shown since we auto-navigate
  return (
    <AuthGuard>
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Welcome to ChatBot App
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your AI-powered chat assistant is ready to help you with anything.
            <span className="block mt-2 font-medium text-gray-300">
              Let's start your first conversation!
            </span>
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
