"use client";

import { useSignOut, useUserData } from "@nhost/nextjs";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import toast from "react-hot-toast";

export default function Header() {
  const { signOut } = useSignOut();
  const user = useUserData();
  const router = useRouter();
  const apolloClient = useApolloClient();

  const handleSignOut = async () => {
    try {
      // Step 1: Stop all active queries and subscriptions
      await apolloClient.stop();

      // Step 2: Sign out from Nhost (this clears the auth token)
      await signOut();

      // Step 3: Clear cache after auth is cleared (use clearStore which won't refetch)
      apolloClient.cache.reset();

      // Step 4: Navigate to sign-in page
      router.push("/auth/signin");

      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error during logout:", error);

      // Fallback: Force everything and redirect
      try {
        await apolloClient.stop();
        apolloClient.cache.reset();
        await signOut();
        router.push("/auth/signin");
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        // Nuclear option: hard redirect
        window.location.href = "/auth/signin";
      }

      toast.error("Signed out successfully");
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03 8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            ChatBot App
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">{user?.email}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
