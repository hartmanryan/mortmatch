import ChatForm, { StepData } from "@/components/ChatForm";
import Image from "next/image";
import prisma from "@/lib/prisma";

const REVERSE_STEPS: StepData[] = [
  {
    id: "ageEligibility",
    question: "Hi there! I'm Mort. 👋 I help homeowners discover if a reverse mortgage is the right fit. First, are you or your spouse currently 62 years of age or older?",
    options: ["Yes, we are 62+", "No, not yet"],
  },
  {
    id: "homeValue",
    question: "Great! Roughly what is the estimated value of your current home?",
    options: ["Under $250k", "$250k - $500k", "$500k - $800k", "$800k+"],
  },
  {
    id: "mortgageBalance",
    question: "And about how much do you currently owe on your existing mortgage?",
    options: ["Free & Clear (No Mortgage)", "Under $50k", "$50k - $150k", "$150k+"],
  },
  {
    id: "primaryGoal",
    question: "Got it. What is your primary goal if you were to get a Reverse Mortgage?",
    options: ["Eliminate Monthly Mortgage Payment", "Cash for Retirement / Medical", "Home Improvements", "Just Exploring Options"],
  },
  {
    id: "contact",
    question: "Almost done! What's the best name and email to send your customized reverse mortgage matches to?",
    isInput: true,
  }
];

export default async function ReverseMortgagePage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams;
  const ref = params.ref;
  
  let lender = null;
  if (ref) {
    try {
      lender = await prisma.lender.findUnique({
        where: { clerkId: ref }
      });
    } catch (e) {
      console.error("Error fetching lender compliance:", e);
    }
  }

  // Fallback to organic admin user
  if (!lender) {
    try {
      lender = await prisma.lender.findUnique({
        where: { email: 'propknocks@gmail.com' }
      });
    } catch (e) {
      console.error("Error fetching default lender compliance:", e);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-100 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-[280px] h-14">
              <Image src="/mortlogo.png" alt="MortMatch" fill className="object-contain object-left" />
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="/about" className="hover:text-blue-600 transition-colors">About Mort</a>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2">
                Mortgage Types
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="absolute top-full right-0 mt-0 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col z-50">
                <a href="/first" className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 text-slate-700 hover:text-blue-600">First Time Buyer</a>
                <a href="/reverse" className="px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600">Reverse Mortgage</a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12 md:py-16 flex flex-col items-center flex-1">
        
        <div className="text-center mb-8 max-w-2xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 leading-tight">
            Chat With Mort &amp; See If A <span className="text-amber-500">Reverse Mortgage</span>{" "}Makes Sense For You &amp; Your Family
          </h1>
        </div>

        <div className="w-full">
          <ChatForm steps={REVERSE_STEPS} campaignName="reverse" />
        </div>
        
        <div className="mt-12 text-center text-slate-400 text-sm font-medium">
          <p>Bank-level security • 256-bit encryption • Fast & Secure</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-200 bg-white/50 py-8 mt-auto z-10">
        <div className="container mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
          {lender && (
            <>
              <p className="font-semibold text-slate-700">Provided by {lender.firstName} {lender.lastName}</p>
              {lender.companyName && <p>{lender.companyName}</p>}
              {lender.nmls && <p>NMLS #{lender.nmls}</p>}
              {lender.phone && <p>Phone: {lender.phone}</p>}
              <p className="pt-4 text-slate-400 max-w-2xl mx-auto">
                This site is not authorized by the New York State Department of Financial Services. No mortgage solicitation activity or loan applications for properties located in the State of New York can be facilitated through this site.
              </p>
            </>
          )}
          <div className="pt-6">
            <a href="/pro" className="text-blue-500 hover:text-blue-600 transition-colors">Mortgage Pro? Click Here</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
