"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase"; // Assuming this path is correct for your Firebase config
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link"; // Make sure Link is imported if used

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect or refresh on success
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      // More user-friendly error messages based on Firebase error codes
      let errorMessage = "Failed to login. Please try again.";
      if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4 font-sans">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 hover:scale-[1.01]"
      >
        <h1 className="text-3xl font-extrabold text-yellow-800 mb-8 text-center tracking-wide">
          Admin Login
        </h1>

        {error && (
          <p className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
            {error}
          </p>
        )}

        <div className="mb-5">
          <label htmlFor="email" className="sr-only">Email</label> {/* Accessible label */}
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username" // Improve autofill UX
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="sr-only">Password</label> {/* Accessible label */}
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // Improve autofill UX
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* This is the place for the "Manage Products" button, if you want it on the login page */}
       
        
      </form>
    </div>
  );
}