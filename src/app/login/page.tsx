"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); 
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        name,
        password,
        redirect: false,
      });

      if (res?.error) {
        showToast("Invalid Name or Password!", "error");
        setIsLoading(false);
      } else {
        showToast("Login Successful! 🚀 Redirecting...", "success");
        setTimeout(() => {
          window.location.href = "/"; 
        }, 1000);
      }
    } else {
      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, password }),
        });

        if (res.ok) {
          showToast("Account created successfully! 🎉 Now you can login.", "success");
          setIsLogin(true); 
          setName("");
          setPassword("");
        } else {
          showToast("Explorer name already taken! Try another one.", "error");
        }
      } catch (error) {
        console.log("Signup error:", error);
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center pt-24 px-4 min-h-screen relative">
      
      {toast && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full border backdrop-blur-md shadow-2xl transition-all animate-bounce ${
          toast.type === 'success' 
            ? 'bg-green-500/20 border-green-500/50 text-green-400' 
            : 'bg-red-500/20 border-red-500/50 text-red-400'
        }`}>
          <span className="font-semibold flex items-center gap-2">
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </span>
        </div>
      )}

      <div className="backdrop-blur-xl bg-black/40 p-8 md:p-12 rounded-3xl border border-white/10 w-full max-w-md shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden mt-10">
        
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-cyan-500/30 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-purple-500/30 rounded-full blur-[80px]"></div>

        <h2 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 relative z-10">
          {isLogin ? "Welcome Back, Explorer" : "Join the Universe"}
        </h2>
        <p className="text-sm text-gray-400 mb-8 text-center relative z-10">
          {isLogin ? "Sign in to continue your journey." : "Create an account to start exploring."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Explorer Name</label>
            <input 
              required 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" 
              placeholder="e.g. Arnab" 
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 py-3.5 rounded-xl font-bold text-white mt-2 transition-all shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Processing..." : (isLogin ? "Launch 🚀" : "Sign Up")}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 relative z-10">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">OR</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* 🌟 Google Login Button সাথে callbackUrl যোগ করা হয়েছে 🌟 */}
        <button 
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-3 transition-colors relative z-10 text-sm font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-6 relative z-10">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

      </div>
    </main>
  );
}