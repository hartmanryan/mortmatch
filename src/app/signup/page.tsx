'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const supabase = createClient();
      
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
    } catch (err: any) {
      console.error("Magic link request failed:", err);
      setErrorMsg(err?.message || "An unexpected error occurred. Please check your network and configuration.");
    } finally {
      setLoading(false);
    }
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
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About Mort</Link>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2">
                Mortgage Types
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="absolute top-full right-0 mt-0 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col z-50">
                <Link href="/first" className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 text-slate-700 hover:text-blue-600">First Time Buyer</Link>
                <Link href="/refinance" className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 text-slate-700 hover:text-blue-600">Refinance</Link>
                <Link href="/self-employed" className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 text-slate-700 hover:text-blue-600">Self Employed</Link>
                <Link href="/reverse" className="px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600">Reverse Mortgage</Link>
              </div>
            </div>
            <Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
        <div className="text-center mb-8 max-w-2xl flex flex-col items-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 leading-tight">
            Create Your Lender Account
          </h1>
        </div>

        {/* Chat UI Form Box */}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col transition-all duration-300">
          {/* Blue Chat Header */}
          <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
            <div className="relative w-12 h-12 bg-white rounded-full p-1 overflow-hidden shrink-0 border-2 border-blue-400">
              <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Mort</h2>
              <p className="text-blue-200 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                Online • Lender Onboarding
              </p>
            </div>
          </div>

          {/* Chat Body Area */}
          <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-4 min-h-[220px]">
            {/* Mort Greeting 1 */}
            <div className="flex justify-start">
              <div className="flex max-w-[85%] flex-row items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden relative">
                  <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
                </div>
                <div className="px-4 py-3 rounded-2xl shadow-sm text-[15px] bg-white text-slate-700 border border-slate-100 rounded-bl-none">
                  Hi there! Welcome to MortMatch. Let's get your lender account set up! 👋
                </div>
              </div>
            </div>

            {/* Mort Greeting 2 */}
            <div className="flex justify-start">
              <div className="flex max-w-[85%] flex-row items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden relative">
                  <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
                </div>
                <div className="px-4 py-3 rounded-2xl shadow-sm text-[15px] bg-white text-slate-700 border border-slate-100 rounded-bl-none">
                  Please enter your email address below to create your account and receive your secure magic access link:
                </div>
              </div>
            </div>

            {/* If sent, show user message and Mort response */}
            {sent && (
              <>
                <div className="flex justify-end">
                  <div className="flex max-w-[85%] flex-row-reverse items-end gap-2">
                    <div className="px-4 py-3 rounded-2xl shadow-sm text-[15px] bg-blue-600 text-white rounded-br-none font-medium">
                      {email}
                    </div>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="flex max-w-[85%] flex-row items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden relative">
                      <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl shadow-sm text-[15px] bg-white text-slate-700 border border-slate-100 rounded-bl-none space-y-2">
                      <p className="font-bold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Check your email!
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        We sent a magic sign-up link to <span className="font-semibold text-slate-900">{email}</span>. Click the link in your inbox to complete setting up your account.
                      </p>
                      <button 
                        onClick={() => setSent(false)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-semibold underline underline-offset-4 cursor-pointer block pt-1.5"
                      >
                        Use a different email address
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Form Area */}
          {!sent && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <form onSubmit={handleSignup} className="space-y-4 max-w-md mx-auto">
                <div className="space-y-1.5">
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
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
                      Create Free Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-150 text-red-600 text-sm rounded-2xl text-center font-semibold">
                    {errorMsg}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center text-slate-400 text-sm font-medium">
          <p>Bank-level security • 256-bit encryption • Fast & Secure</p>
        </div>
      </main>

      <Footer showProLink={false} />
    </div>
  );
}
