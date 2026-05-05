import ChatForm, { StepData } from "@/components/ChatForm";
import Image from "next/image";
import prisma from "@/lib/prisma";

const GENERAL_STEPS: StepData[] = [
  {
    id: "situation",
    question: "Hi there! I'm Mort. 👋 I'm going to help you find the perfect mortgage. First, what's your current real estate situation?",
    options: ["I'm currently renting.", "Homeowner - Looking to upsize/downsize", "Buying my first investment property", "Experienced investor"],
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
    question: "How much do you have available for a down payment and closing costs?",
    options: ["Less Than $5,000", "$5,000 - $20,000", "$20,000 - $50,000", "$50,000+"],
  },
  {
    id: "creditScore",
    question: "Do you happen to know your credit score?",
    options: ["Under 600", "600 - 700", "700+", "I don't know it"],
  },
  {
    id: "contact",
    question: "Almost done! What's the best name and email to send your matches to?",
    isInput: true,
  }
];

export default async function Home({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
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
      {/* Light Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-200 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-[280px] h-14">
              <Image src="/mort_header_new.jpg" alt="MortMatch" fill className="object-contain object-left" />
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Purchase</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Refinance</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Rates</a>
          </nav>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12 md:py-16 flex flex-col items-center flex-1">
        
        {/* Header Section */}
        <div className="text-center mb-8 max-w-2xl flex flex-col items-center">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 leading-tight">
            Chat With Mort &amp; Find The <span className="text-blue-600">Perfect Mortgage</span>
          </h1>
        </div>

        {/* Interactive Chat UI */}
        <div className="w-full">
          <ChatForm steps={GENERAL_STEPS} campaignName="general" />
        </div>
        
        {/* Trust Badges */}
        <div className="mt-12 text-center text-slate-400 text-sm font-medium">
          <p>Bank-level security • 256-bit encryption • Fast & Secure</p>
        </div>
      </main>

      {/* Compliance Footer */}
      {lender && (
        <footer className="relative border-t border-slate-200 bg-white/50 py-8 mt-auto z-10">
          <div className="container mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Provided by {lender.firstName} {lender.lastName}</p>
            {lender.companyName && <p>{lender.companyName}</p>}
            {lender.nmls && <p>NMLS #{lender.nmls}</p>}
            {lender.phone && <p>Phone: {lender.phone}</p>}
            <p className="pt-4 text-slate-400 max-w-2xl mx-auto">
              This site is not authorized by the New York State Department of Financial Services. No mortgage solicitation activity or loan applications for properties located in the State of New York can be facilitated through this site.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
