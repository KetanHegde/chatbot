"use client";

import "./globals.css";
import { NhostProvider } from "@nhost/nextjs";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { nhost } from "@/lib/nhost";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>ChatBot App</title>
        <meta name="description" content="AI-powered chat application" />
      </head>
      <body className="antialiased">
        <NhostProvider nhost={nhost}>
          <NhostApolloProvider nhost={nhost}>
            {children}
            <Toaster position="top-right" />
          </NhostApolloProvider>
        </NhostProvider>
      </body>
    </html>
  );
}
