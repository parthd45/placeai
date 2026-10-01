"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [academicYear, setAcademicYear] = useState("SY MCA");
  const [division, setDivision] = useState("Division A");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans">
      {/* Left Column: Brand Graphic */}
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

      {/* Right Column: Student Registration Form */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12 min-h-screen bg-white dark:bg-slate-950">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to sign in</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Student Registration
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create your Skilli PMS student account. Your batch is automatically assigned from your roll number.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Official College Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student.roll@mesimcc.edu.in"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  7-Digit Student Roll Number <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">e.g. 2401098</span>
              </div>
              <input
                type="text"
                required
                maxLength={7}
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="2401098"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 font-mono text-sm tracking-wider font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
                >
                  <option value="FY MCA">FY MCA (1st Year)</option>
                  <option value="SY MCA">SY MCA (2nd Year)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Division <span className="text-red-500">*</span>
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
                >
                  <option value="Division A">Division A</option>
                  <option value="Division B">Division B</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Phone / WhatsApp Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 pr-10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#2D7F62] hover:bg-[#236B51] text-white font-bold py-3 text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isSubmitting ? "Creating Account..." : "Create Account & Enroll"}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already registered?{" "}
              <Link href="/auth/login" className="font-bold text-[#2D7F62] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
