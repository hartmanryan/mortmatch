import ChatForm, { StepData } from "@/components/ChatForm";
import Image from "next/image";
import prisma from "@/lib/prisma";

const FIRST_TIME_STEPS: StepData[] = [
  {
    id: "timeline",
    question: "Hi there! I'm Mort. 👋 I'm so excited to help you buy your very first home! First question: How soon do you want to buy?",
    options: ["ASAP", "1-3 months", "3-6 months", "Just exploring right now"],
  },
  {
    id: "location",
    question: "Awesome. What city and state are you thinking about buying in?",
    // No options means it will show a free-text input
  },
  {
    id: "priceRange",
    question: "Got it! What price range are you potentially shopping in?",
    options: ["Under $200k", "$200k - $500k", "$500k - $1 Million", "$1 Million+"],
  },
  {
    id: "employment",
    question: "Nice! And how are you currently employed?",
    options: ["Employed - W2 Earner", "Self Employed - 1099 / K1", "Not Employed"],
  },
  {
    id: "downPayment",
    question: "How much do you have saved up for a down payment?",
    options: ["Less Than $5,000", "$5,000 - $20,000", "$20,000 - $50,000", "$50,000+"],
  },
  {
    id: "creditScore",
    question: "Do you happen to know your credit score?",
    options: ["Under 600", "600 - 700", "700+", "I don't know it"],
  },
  {
    id: "contact",
    question: "Almost done! What's the best name and email to send your first-time buyer matches to?",
    isInput: true,
  }
];

export default async function FirstTimeHomeBuyerPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
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
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100 blur-[120px]" />
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
            Chat With Mort &amp; Find The Perfect <span className="text-orange-500">First Time</span> HomeBuyer Mortgage
          </h1>
        </div>

        <div className="w-full">
          <ChatForm steps={FIRST_TIME_STEPS} campaignName="first-time-buyer" />
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
