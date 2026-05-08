import Image from "next/image";
import Link from "next/link";

export default function ProPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
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
                <Link href="/reverse" className="px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600">Reverse Mortgage</Link>
              </div>
            </div>
            <Link href="/sign-in" className="hover:text-blue-600 transition-colors">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-16 flex flex-col items-center flex-1 justify-center text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight">
            Supercharge Your <span className="text-blue-600">Mortgage Business</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10">
            Join MortMatch to generate high-intent leads and manage them effortlessly with our AI-powered chat and CRM.
          </p>
          <Link href="/sign-up" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform hover:scale-105 shadow-lg">
            Create Free Account
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Chat Leads</h3>
            <p className="text-slate-600">Engage prospects automatically with Mort, our friendly AI assistant.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl">📱</div>
            <h3 className="text-xl font-bold mb-2">Modern CRM</h3>
            <p className="text-slate-600">Manage all your contacts and leads in one easy-to-use dashboard.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl">🔗</div>
            <h3 className="text-xl font-bold mb-2">Custom Links</h3>
            <p className="text-slate-600">Share your personalized chat links on social media and ads.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/50 py-8 mt-auto text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} MortMatch. All rights reserved.</p>
      </footer>
    </div>
  );
}
