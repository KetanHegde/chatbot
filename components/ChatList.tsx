"use client";

import { useQuery, useSubscription, useMutation } from "@apollo/client";
import {
  GET_CHATS,
  INSERT_CHAT,
  UPDATE_CHAT_TITLE,
  CHATS_UPDATED_AT_SUBSCRIPTION,
} from "@/lib/graphql";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    content: string;
    sender: string;
    created_at: string;
  }>;
}

interface ChatListProps {
  currentChatId?: string;
  isOpen: boolean;
  onToggle: () => void;
}

function ChatListComponent({ currentChatId, isOpen, onToggle }: ChatListProps) {
  const [mounted, setMounted] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Keep the original query for initial data
  const { data, loading, error } = useQuery(GET_CHATS, {
    skip: !mounted,
  });

  // Add lightweight subscription for real-time updated_at changes
  useSubscription(CHATS_UPDATED_AT_SUBSCRIPTION, {
    skip: !mounted,
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (!subscriptionData.data) return;

      // Update cache with new updated_at values
      client.cache.modify({
        fields: {
          chats(existingChats, { readField }) {
            const updatedChats = subscriptionData.data.chats;

            // Update each chat's updated_at in the cache
            existingChats.forEach((chatRef: { __ref: string }) => {
              const chatId = readField("id", chatRef);
              const updatedChat = updatedChats.find(
                (chat: { id: string; updated_at: string }) => chat.id === chatId
              );

              if (updatedChat) {
                client.cache.modify({
                  id: chatRef.__ref,
                  fields: {
                    updated_at: () => updatedChat.updated_at,
                  },
                });
              }
            });

            // Re-sort chats by updated_at with proper type checking
            return [...existingChats].sort((a, b) => {
              const aTime = readField("updated_at", a);
              const bTime = readField("updated_at", b);

              // Handle potential undefined values
              const aDate =
                aTime && typeof aTime === "string"
                  ? new Date(aTime).getTime()
                  : 0;
              const bDate =
                bTime && typeof bTime === "string"
                  ? new Date(bTime).getTime()
                  : 0;

              return bDate - aDate;
            });
          },
        },
      });
    },
  });

  const [insertChat] = useMutation(INSERT_CHAT);
  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const chats: Chat[] = data?.chats || [];

  const generateChatTitle = (
    messages: Array<{ content: string; sender: string }>
  ) => {
    const userMessages = messages.filter(
      (msg) => msg.sender === "user" || msg.sender === "User"
    );
    if (userMessages.length === 0) return "New Chat";

    const firstMessage = userMessages[0].content;
    return firstMessage.length > 40
      ? firstMessage.substring(0, 40) + "..."
      : firstMessage;
  };

  const handleNewChat = async () => {
    // Check if current chat is empty - if so, do nothing silently
    const currentChat = chats.find((chat) => chat.id === currentChatId);
    if (
      currentChat &&
      (currentChat.title === "New Chat" ||
        currentChat.title === "Welcome Chat") &&
      currentChat.messages.length === 0
    ) {
      onToggle();
      return; // Silently return without creating a new chat
    }

    setIsCreating(true);
    try {
      const result = await insertChat({
        variables: {
          title: "New Chat",
        },
        refetchQueries: [{ query: GET_CHATS }],
        awaitRefetchQueries: true, // Wait for refetch to complete
      });

      const newChatId = result.data?.insert_chats_one?.id;
      if (newChatId) {
        // Close sidebar on mobile after creating chat
        if (window.innerWidth < 640) {
          onToggle();
        }
        router.push(`/chat/${newChatId}`);
      }
    } catch (err) {
      console.error("Error creating chat:", err);
      toast.error("Failed to create chat");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTitle = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveTitle = async (chatId: string) => {
    if (!editTitle.trim()) return;

    try {
      await updateChatTitle({
        variables: {
          chatId,
          title: editTitle.trim(),
        },
        refetchQueries: [{ query: GET_CHATS }],
      });
      toast.success("Title updated!");
    } catch (err) {
      console.error("Error updating title:", err);
      toast.error("Failed to update title");
    } finally {
      setEditingChatId(null);
      setEditTitle("");
    }
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleChatClick = (chatId: string) => {
    // Close sidebar on mobile after selecting chat
    if (window.innerWidth < 640) {
      onToggle();
    }
    router.push(`/chat/${chatId}`);
  };

  const formatSafeDate = (dateString: string) => {
    try {
      let date = parseISO(dateString);
      if (!isValid(date)) {
        date = new Date(dateString);
      }
      if (!isValid(date)) {
        return "Recently";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  if (!mounted || loading) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
            onClick={onToggle}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed sm:static inset-y-0 left-0 z-50 sm:z-auto
          w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black 
          border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
          flex items-center justify-center
        `}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
            <p className="text-gray-400 text-sm">Loading chats...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
            onClick={onToggle}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed sm:static inset-y-0 left-0 z-50 sm:z-auto
          w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black 
          border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
          flex items-center justify-center
        `}
        >
          <div className="text-red-400 text-center p-4 bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Failed to load chats
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed sm:static inset-y-0 left-0 z-50 sm:z-auto
        w-80 bg-gradient-to-br from-gray-900 to-black 
        border-r border-gray-800 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        flex flex-col
      `}
      >
        {/* Close button for mobile */}
        <div className="flex justify-end p-4 sm:hidden">
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Header with New Chat Button */}
        <div className="px-6 p-6">
          <button
            onClick={handleNewChat}
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>New Chat</span>
              </>
            )}
          </button>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chats.length === 0 ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-gray-400"
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
                <p className="text-gray-400 text-sm">No chats yet</p>
                <p className="text-gray-500 text-xs mt-1">
                  Create your first chat to get started!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {chats.map((chat) => {
                const displayTitle =
                  chat.title === "New Chat" && chat.messages.length > 0
                    ? generateChatTitle(chat.messages)
                    : chat.title;

                return (
                  <div
                    key={chat.id}
                    className={`group relative rounded-xl transition-all duration-200 ${
                      currentChatId === chat.id
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                        : "hover:bg-gray-800/50 border border-transparent"
                    }`}
                  >
                    <div
                      onClick={() =>
                        editingChatId !== chat.id && handleChatClick(chat.id)
                      }
                      className="p-4 cursor-pointer"
                    >
                      {editingChatId === chat.id ? (
                        <div
                          className="space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full text-sm font-medium bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveTitle(chat.id);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveTitle(chat.id)}
                              className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-600 transition-all duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-gray-100 truncate pr-2 text-sm">
                              {displayTitle}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTitle(chat);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-700/50 rounded-lg"
                              title="Edit title"
                            >
                              <svg
                                className="w-3 h-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </div>
                          {chat.messages[0] && (
                            <p className="text-xs text-gray-400 truncate mt-2">
                              {chat.messages[0].sender === "user" ||
                              chat.messages[0].sender === "User" ? (
                                <span className="text-blue-400">You: </span>
                              ) : (
                                <span className="text-purple-400">Bot: </span>
                              )}
                              {chat.messages[0].content}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {formatSafeDate(chat.updated_at)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(55, 65, 81, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.5);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.7);
          }
        `}</style>
      </div>
    </>
  );
}

import dynamic from "next/dynamic";

export default dynamic(() => Promise.resolve(ChatListComponent), {
  ssr: false,
  loading: () => (
    <>
      {/* Mobile Overlay - Hidden in loading state */}
      <div className="hidden" />

      {/* Sidebar - Always visible during loading */}
      <div className="w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black border-r border-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    </>
  ),
});
