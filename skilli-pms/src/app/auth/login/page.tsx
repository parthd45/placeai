"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student.roll@mesimcc.edu.in");
  const [password, setPassword] = useState("capstone2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleUnifiedSSO = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans">
      {/* Left Column: Brand Hero Banner with authentic Skilli assets */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[48%] flex-col justify-between p-12 overflow-hidden bg-slate-950 text-white select-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/skilli-auth-bg.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="relative h-9 w-32">
            <Image
              src="/Skilli-Logo-Vector.svg"
              alt="Skilli"
              fill
              priority
              className="object-contain brightness-110"
            />
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to <span className="text-emerald-400">Skilli</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Join thousands of students and educators learning, practicing, and building world-class software together.
          </p>
        </div>
      </div>

      {/* Right Column: Sign In Form matching Skilli exact specs */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12 min-h-screen bg-white dark:bg-slate-950">
        <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full">
          <div>
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center gap-2 lg:hidden">
                <div className="relative h-6 w-24">
                  <Image
                    src="/Skilli-Logo-Vector.svg"
                    alt="Skilli"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Log In to Your Account
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Enter your registered institutional credentials to access your workspace.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border bg-[#ebf0f7] dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-colors border-slate-200/90 dark:border-slate-800"
                  placeholder="you@university.edu"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions have been dispatched to your institutional email.");
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border bg-[#ebf0f7] dark:bg-slate-900 px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-colors border-slate-200/90 dark:border-slate-800"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none"
                >
                  Remember this session
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1b7056] hover:bg-[#155a45] text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>{isLoading ? "Signing in..." : "Sign In"}</span>
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#f0f4f9] dark:bg-slate-900 px-3 text-slate-500 font-medium">
                    or
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUnifiedSSO}
                className="w-full border border-emerald-600/30 hover:border-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-2xs"
              >
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Sign in with Skilli Unified Account</span>
              </button>

              <div className="text-center pt-1 pb-1">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  New student?{" "}
                  <Link
                    href="/auth/register"
                    className="font-bold text-[#2D7F62] dark:text-emerald-400 hover:underline"
                  >
                    Register with Roll Number →
                  </Link>
                </p>
              </div>

              <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed pt-1">
                By signing in, you agree to our{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">
                  Terms of Service
                </span>{" "}
                and acknowledge our{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">
                  Privacy Policy
                </span>{" "}
                under the DPDP Act 2023.
              </p>
            </form>
          </div>

          <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-8 pb-2">
            © 2026 Skilli Platform Inc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
