"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import type { LoginFormData, SignupFormData } from "@/lib/validations/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSubmit = (data: LoginFormData) => {
    console.log("Login data:", data);
    // TODO: Implement login logic
  };

  const handleSignupSubmit = (data: SignupFormData) => {
    console.log("Signup data:", data);
    // TODO: Implement signup logic
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      {/* Floating Background Elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-72 h-72 bg-linear-to-br from-blue-500 to-cyan-400 rounded-full opacity-10 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-linear-to-br from-cyan-500 to-teal-400 rounded-full opacity-10 blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-2xl relative z-10">
        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-3xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Toastmaster Manager
              </span>
            </div>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-8 bg-slate-800/50 p-2 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  isLogin
                    ? "bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  !isLogin
                    ? "bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isLogin ? (
                  <LoginForm onSubmit={handleLoginSubmit} />
                ) : (
                  <SignupForm onSubmit={handleSignupSubmit} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Text */}
          <p className="text-center text-slate-400 text-sm mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
            >
              {isLogin ? "Sign up for free" : "Login here"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
