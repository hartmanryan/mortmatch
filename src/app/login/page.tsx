'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

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
    <div className="min-h-screen relative overflow-hidden bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-950/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm font-medium">Sign in to your MortMatch Lender Portal</p>
        </div>

        {sent ? (
          <div className="text-center space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-left flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-400 text-sm font-bold">Check your email!</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  We sent a magic sign-in link to <span className="font-semibold text-slate-200">{email}</span>. Please click the link in your inbox to complete signing in.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSent(false)}
              className="text-slate-400 hover:text-blue-400 text-sm font-semibold transition-colors duration-200 underline underline-offset-4"
            >
              Use a different email address
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lender@mortmatch.com"
                className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-4 py-3.5 font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/10 cursor-pointer"
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
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl text-center font-medium">
                {errorMsg}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
