"use client";

import { useState, useEffect } from "react";
import { useSignInEmailOTP, useAuthenticationStatus } from "@nhost/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OTPSignIn() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const {
    signInEmailOTP,
    verifyEmailOTP,
    isLoading,
    needsOtp,
    isSuccess,
    error,
  } = useSignInEmailOTP();
  const { isAuthenticated } = useAuthenticationStatus();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated || isSuccess) {
      router.push("/");
    }
  }, [isAuthenticated, isSuccess, router]);

  // Step 1: Send OTP to email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signInEmailOTP(email);
      if (result.error) {
        if (
          result.error.message.includes("409") ||
          result.error.message.includes("conflict")
        ) {
          toast.error("Please wait before requesting another code");
        } else {
          toast.error(result.error.message);
        }
      } else {
        toast.success("Verification code sent to your email!");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  // Step 2: Verify the OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await verifyEmailOTP(email, otp);
      if (result.isSuccess) {
        toast.success("Successfully signed in!");
      } else {
        setOtp("");
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      const result = await signInEmailOTP(email);
      if (result.error) {
        if (
          result.error.message.includes("409") ||
          result.error.message.includes("conflict")
        ) {
          toast.error("Please wait 60 seconds before requesting another code");
        } else {
          toast.error(result.error.message);
        }
      } else {
        toast.success("New verification code sent!");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-12 relative overflow-hidden"
      suppressHydrationWarning
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 space-y-8 relative z-10">
        {!needsOtp ? (
          <>
            {/* Email Input Step */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Welcome!
              </h2>
              <p className="text-gray-300 text-lg font-medium">
                Sign in with your email
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                We&apos;ll send a secure verification code to your email
                address.
                <br />
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSendOTP}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 pl-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm text-lg"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="white"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm animate-shake">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="white" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error.message}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 disabled:hover:scale-100 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending magic code...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Send Verification Code</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* OTP Verification Step */}
            <div className="text-center space-y-3">
              <div className="w-15 h-15 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                Check Your Email
              </h2>
              <div className="bg-gray-900/50 rounded-xl p-4 backdrop-blur-s">
                <p className="text-gray-400 text-sm">
                  We&apos;ve sent a 6-digit verification code to:
                </p>
                <p className="text-blue-400 text-lg font-semibold mt-1 break-all">
                  {email}
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-300 pl-1"
                >
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="block w-full px-4 py-4 rounded-xl bg-gray-800/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-3xl tracking-[0.5em] font-mono font-bold transition-all duration-300 backdrop-blur-sm"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        otp.length === 6
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm animate-shake">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="white" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error.message}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 disabled:hover:scale-100 text-lg shadow-lg hover:shadow-blue-500/25"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Verify & Sign In</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
              </button>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-medium text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Resending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="white"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Resend Code</span>
                    </div>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Didn&apos;t receive the code? Check your spam folder or try
                    again.
                  </p>
                </div>
              </div>
            </form>
          </>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-700/50">
          <div className="flex justify-center items-center gap-7">
            {/* GitHub Link */}
            <a
              href="https://github.com/KetanHegde/chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-xl rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 z-10"
              title="View on GitHub"
            >
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <button
              onClick={() => {
                router.push("/docs");
              }}
              rel="noopener noreferrer"
              className="p-3 text-white hover:text-white bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-xl rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 z-10"
              title="View Documentation"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
