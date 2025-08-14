"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedCode, setCopiedCode] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const sections = [
    { id: "overview", title: "Project Overview", icon: "📋" },
    { id: "architecture", title: "System Architecture", icon: "🏗️" },
    { id: "database", title: "Database Schema & RLS", icon: "🗄️" },
    { id: "n8n-workflow", title: "n8n Workflow", icon: "🔄" },
    { id: "graphql-api", title: "GraphQL API", icon: "📡" },
    { id: "permissions", title: "Security & Permissions", icon: "🛡️" },
  ];

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const CodeBlock = ({ children, title }: any) => {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700">
        {title && (
          <div className="px-4 py-2 bg-gray-800 rounded-t-lg border-b border-gray-700">
            <h5 className="text-gray-300 font-medium text-sm">{title}</h5>
          </div>
        )}
        <div className="relative">
          <button
            onClick={() => copyToClipboard(children)}
            className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors z-10"
            title="Copy to clipboard"
          >
            {copiedCode === children ? (
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
          <pre className="p-4 pr-12 font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto">
            <code>{children}</code>
          </pre>
        </div>
      </div>
    );
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-950" suppressHydrationWarning>
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Documentation
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gradient-to-r border border-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
              >
                <span className="hidden sm:inline">Back to app</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:relative lg:transform-none lg:w-64 lg:flex-shrink-0 lg:bg-transparent lg:border-0 ${
              isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="h-full overflow-y-auto">
              {/* Mobile close button */}
              <div className="flex justify-end p-4 lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
                >
                  <svg
                    className="w-6 h-6"
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

              <div className="bg-gray-900 lg:rounded-lg border border-gray-800 p-4 lg:sticky mx-4 lg:mx-0">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 text-left text-sm ${
                        activeSection === section.id
                          ? "bg-gray-800 text-blue-400 border border-gray-700"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      <span className="text-base">{section.icon}</span>
                      <span className="font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 sm:p-6 md:p-8">
              {/* Project Overview */}
              {activeSection === "overview" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      📋 Project Overview
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg">
                      A secure chatbot application using email authentication,
                      real-time GraphQL communication, and AI-powered responses
                      through n8n workflow automation.
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                      Application Architecture
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-gray-300 font-medium">
                          Core Components
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            Next.js 15 Frontend
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            Nhost Authentication
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            Hasura GraphQL Engine
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            PostgreSQL Database
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            n8n Workflow Automation
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            OpenRouter AI Integration
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-gray-300 font-medium">
                          Key Features
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Email OTP Authentication
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Real-time Chat Interface
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Multi-chat Management
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            AI Response Generation
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Row-Level Security
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            GraphQL-only Communication
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                      Data Flow
                    </h3>
                    <div className="space-y-3">
                      {[
                        "User authenticates via Nhost email OTP system",
                        "Frontend communicates exclusively through Hasura GraphQL API",
                        "Messages trigger Hasura Actions to n8n workflows",
                        "n8n validates permissions and calls OpenRouter API",
                        "AI responses saved back to database via GraphQL",
                        "Real-time updates delivered through GraphQL subscriptions",
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <p className="text-gray-400 text-sm sm:text-base">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* System Architecture */}
              {activeSection === "architecture" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      🏗️ System Architecture
                    </h2>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Component Interaction
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Frontend Layer",
                          description:
                            "Next.js application with Apollo Client for GraphQL communication, real-time subscriptions, and optimistic UI updates.",
                        },
                        {
                          title: "Authentication Layer",
                          description:
                            "Nhost provides JWT-based authentication with email OTP verification and session management.",
                        },
                        {
                          title: "GraphQL Layer",
                          description:
                            "Hasura GraphQL Engine with auto-generated API, custom Actions, and real-time subscriptions.",
                        },
                        {
                          title: "Workflow Layer",
                          description:
                            "n8n processes webhooks from Hasura Actions, validates permissions, and integrates with external APIs.",
                        },
                        {
                          title: "AI Layer",
                          description:
                            "OpenAI GPT-OSS-20B model processes user messages and generates intelligent responses through OpenRouter API",
                        },
                      ].map((layer, index) => (
                        <div
                          key={index}
                          className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                        >
                          <h4 className="text-white font-medium mb-2">
                            {layer.title}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {layer.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Security Model
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-gray-300 font-medium">
                          Authentication
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                            JWT token validation
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                            Email OTP verification
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                            Session management
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                            Role-based access control
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-gray-300 font-medium">
                          Authorization
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                            Row-level security policies
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                            GraphQL permissions
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                            Action-level restrictions
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                            User data isolation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Database Schema */}
              {activeSection === "database" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      🗄️ Database Schema & Permissions
                    </h2>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Table Structure & Relationships
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">chats</h4>
                        <CodeBlock>{`CREATE TABLE chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Relationships
-- object: user (via user_id → auth.users)
-- array: messages (via messages.chat_id → chats.id)`}</CodeBlock>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3">
                          messages
                        </h4>
                        <CodeBlock>{`CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('User', 'assistant')),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Relationships  
-- object: chat (via chat_id → chats.id)`}</CodeBlock>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Hasura Permissions - chats Table
                    </h3>
                    <div className="space-y-6">
                      <h4 className="text-white font-medium">
                        User Role Permissions
                      </h4>
                      <div className="grid gap-4">
                        <div>
                          <CodeBlock title="SELECT">{`filter: {
  user_id: { _eq: "X-Hasura-User-Id" }
}
columns: [
  "created_at", "id", "title", 
  "updated_at", "user_id"
]`}</CodeBlock>
                        </div>
                        <div>
                          <CodeBlock title="INSERT">{`check: {
  user_id: { _eq: "X-Hasura-User-Id" }
}
set: { user_id: "x-hasura-User-Id" }
columns: ["title"]`}</CodeBlock>
                        </div>
                        <div>
                          <CodeBlock title="UPDATE">{`filter: {
  user_id: { _eq: "X-Hasura-User-Id" }
}
columns: ["title"]`}</CodeBlock>
                        </div>
                        <div>
                          <CodeBlock title="DELETE">{`filter: {
  user_id: { _eq: "X-Hasura-User-Id" }
}`}</CodeBlock>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Hasura Permissions - messages Table
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-medium mb-4">
                          User Role Permissions
                        </h4>
                        <div className="grid gap-4">
                          <div>
                            <CodeBlock title="SELECT">{`filter: {
  chat: {
    user_id: { _eq: "X-Hasura-User-Id" }
  }
}
columns: [
  "chat_id", "content", "created_at", 
  "id", "sender"
]`}</CodeBlock>
                          </div>
                          <div>
                            <CodeBlock title="INSERT">{`check: {
  chat: {
    user_id: { _eq: "X-Hasura-User-Id" }
  }
}
set: { sender: "User" }
columns: ["chat_id", "content"]`}</CodeBlock>
                          </div>
                          <div>
                            <CodeBlock title="UPDATE">{`filter: {
  chat: {
    user_id: { _eq: "X-Hasura-User-Id" }
  }
}
columns: ["content"]`}</CodeBlock>
                          </div>
                          <div>
                            <CodeBlock title="DELETE">{`filter: {
  chat: {
    user_id: { _eq: "X-Hasura-User-Id" }
  }
}`}</CodeBlock>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-4">
                          Bot Role Permissions
                        </h4>
                        <div className="grid gap-4">
                          <div>
                            <CodeBlock title="SELECT">{`filter: {
  chat: {
    user_id: { _eq: "X-Hasura-User-Id" }
  }
}
columns: ["id"]`}</CodeBlock>
                          </div>
                          <div>
                            <CodeBlock title="INSERT">{`check: {
  chat: {
    user_id: { _eq: "X-Hasura-User-Id" }
  }
}
set: { sender: "assistant" }
columns: ["chat_id", "content"]`}</CodeBlock>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Permission Summary
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-gray-300 font-medium">User Role</h4>
                        <ul className="space-y-2 text-gray-400">
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            Full CRUD access to own chats
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            Can create User messages only
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            Access messages via chat ownership
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            Title updates allowed
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-gray-300 font-medium">Bot Role</h4>
                        <ul className="space-y-2 text-gray-400">
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Limited message access (ID only)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Can insert assistant messages
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Validates via chat ownership
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Used by n8n workflow
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* n8n Workflow */}
              {activeSection === "n8n-workflow" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      🔄 n8n Workflow
                    </h2>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Workflow Steps
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          step: 1,
                          title: "Webhook Trigger",
                          description:
                            "Receives POST request from Hasura Action with chatId, content, and userId",
                          color: "bg-blue-600",
                        },
                        {
                          step: 2,
                          title: "Permission Validation",
                          description:
                            "Queries Hasura to verify user owns the specified chat_id",
                          color: "bg-purple-600",
                        },
                        {
                          step: 3,
                          title: "User Message Storage",
                          description:
                            "Saves user message to database via GraphQL mutation",
                          color: "bg-yellow-600",
                        },
                        {
                          step: 4,
                          title: "Message History Fetch",
                          description:
                            "Retrieves conversation history via GraphQL for context",
                          color: "bg-green-600",
                        },
                        {
                          step: 5,
                          title: "OpenRouter API Call",
                          description:
                            "Sends formatted conversation to AI model for response generation",
                          color: "bg-pink-600",
                        },
                        {
                          step: 6,
                          title: "Response Storage",
                          description:
                            "Saves AI response to database and returns reply and success status",
                          color: "bg-indigo-600",
                        },
                      ].map((item) => (
                        <div
                          key={item.step}
                          className="flex items-start space-x-4"
                        >
                          <div
                            className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                          >
                            {item.step}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium mb-1">
                              {item.title}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GraphQL API */}
              {activeSection === "graphql-api" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      📡 GraphQL API
                    </h2>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Core Queries
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">
                          Get User Chats
                        </h4>
                        <CodeBlock>{`query GetChats {
  chats(order_by: { updated_at: desc }) {
    id
    title
    created_at
    updated_at
    messages(limit: 1, order_by: { created_at: desc }) {
      content
      sender
      created_at
    }
  }
}`}</CodeBlock>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3">
                          Get Chat Messages
                        </h4>
                        <CodeBlock>{`query GetMessages($chatId: uuid!) {
  messages(
    where: { chat_id: { _eq: $chatId } }
    order_by: { created_at: asc }
  ) {
    id
    content
    sender
    created_at
  }
}`}</CodeBlock>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Mutations
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">
                          Create New Chat
                        </h4>
                        <CodeBlock>{`mutation InsertChat($title: String!) {
  insert_chats_one(object: { title: $title }) {
    id
    title
  }
}`}</CodeBlock>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3">
                          Update Chat Title
                        </h4>
                        <CodeBlock>{`mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
  update_chats_by_pk(pk_columns: { id: $chatId }, _set: { title: $title }) {
    id
    title
  }
}`}</CodeBlock>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3">
                          Send Message Action
                        </h4>
                        <CodeBlock>{`mutation SendMessageAction($chatId: uuid!, $content: String!) {
  sendMessage(chat_id: $chatId, content: $content) {
    reply
  }
}`}</CodeBlock>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Real-time Subscriptions
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">
                          Message Updates
                        </h4>
                        <CodeBlock>{`subscription MessagesSubscription($chatId: uuid!) {
  messages(
    where: { chat_id: { _eq: $chatId } }
    order_by: { created_at: asc }
  ) {
    id
    content
    sender
    created_at
  }
}`}</CodeBlock>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3">
                          Chat List Updates
                        </h4>
                        <CodeBlock>{`subscription ChatsUpdatedAt {
  chats {
    id
    updated_at
  }
}`}</CodeBlock>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Frontend Implementation
                    </h3>
                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Apollo Client Usage
                      </h4>
                      <CodeBlock>{`// Query usage
const { data, loading, error } = useQuery(GET_CHATS);

// Mutation usage  
const [insertChat] = useMutation(INSERT_CHAT);
const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);

// Subscription usage
const { data: messagesData } = useSubscription(MESSAGES_SUBSCRIPTION, {
  variables: { chatId }
});`}</CodeBlock>
                    </div>
                  </div>
                </div>
              )}

              {/* Security & Permissions */}
              {activeSection === "permissions" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      🛡️ Security & Permissions
                    </h2>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Multi-layer Security
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Authentication Layer",
                          description:
                            "JWT token validation ensures only authenticated users access the system",
                        },
                        {
                          title: "Database Layer",
                          description:
                            "Row-Level Security policies prevent unauthorized data access at database level",
                        },
                        {
                          title: "GraphQL Layer",
                          description:
                            "Hasura permissions filter data based on user identity and relationships",
                        },
                        {
                          title: "Workflow Layer",
                          description:
                            "n8n validates user ownership before processing any external API calls",
                        },
                      ].map((layer, index) => (
                        <div
                          key={index}
                          className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                        >
                          <h4 className="text-white font-medium mb-2">
                            {layer.title}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {layer.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      API Security
                    </h3>
                    <div className="space-y-4">
                      <h4 className="text-gray-300 font-medium">
                        External API Security
                      </h4>
                      <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                          API keys in n8n only
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                          No direct frontend calls
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                          Request validation
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                          Response sanitization
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                      Permission Flow
                    </h3>
                    <div className="space-y-3">
                      {[
                        "User authenticates → JWT token issued",
                        "GraphQL request → Token validated, user ID extracted",
                        "Hasura permissions → Filter data by user ownership",
                        "Database policies → Additional row-level filtering",
                        "Action execution → n8n validates user permissions",
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <p className="text-gray-400 text-sm sm:text-base">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Link */}
      <a
        href="https://github.com/KetanHegde/chatbot"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-110 z-50"
        title="View Source Code"
      >
        <svg className="w-8 h-8 sm:w-6 sm:h-6" fill="white" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </a>
    </div>
  );
}
