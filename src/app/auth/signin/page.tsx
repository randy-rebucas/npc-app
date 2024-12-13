"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SignIn() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log(session);
    // if (session) {
    //   window.location.href = "/dashboard";
    // }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/api/auth/callback/google",
      redirect: false,
    });

    if (result?.ok) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Sign in with Email
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">Or continue with</span>
          </div>
        </div>

        <div className="space-y-4">

          <button
            onClick={() => signIn("logto", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center w-full px-4 py-3 space-x-3 text-white bg-[#1877F2] rounded-lg hover:bg-[#1864D6] focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 transition-all duration-200"
          >
            <span>Continue with Logto</span>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
} 