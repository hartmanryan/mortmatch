'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { 
        emailRedirectTo: `${window.location.origin}/auth/callback` 
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 flex flex-col font-sans">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="relative w-[280px] h-14">
              <Image src="/mortlogo.png" alt="MortMatch" fill className="object-contain object-left" />
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About Mort</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-4 border border-blue-100">
              <Mail className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm font-medium">Sign in to your MortMatch Lender Portal</p>
          </div>

          {sent ? (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-left flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-800 text-sm font-bold">Check your email!</p>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    We sent a magic sign-in link to <span className="font-semibold text-slate-900">{email}</span>. Please check your inbox and click the link to complete signing in.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSent(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200 underline underline-offset-4 cursor-pointer"
              >
                Use a different email address
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lender@mortmatch.com"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-4 py-3.5 font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Magic Link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              {errorMsg && (
                <div className="mt-4 p-4 bg-red-50 border border-red-150 text-red-600 text-sm rounded-2xl text-center font-semibold">
                  {errorMsg}
                </div>
              )}
            </form>
          )}
        </div>
        
        <div className="mt-8 text-center text-slate-400 text-sm font-medium">
          <p>Bank-level security • 256-bit encryption • Fast & Secure</p>
        </div>
      </main>
    </div>
  );
}
