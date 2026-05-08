import ChatForm, { StepData } from "@/components/ChatForm";
import Image from "next/image";
import Link from "next/link";

const ABOUT_STEPS: StepData[] = [
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
    question: "Great, I'm starting to do some research in the background, Let me know what state you might need mortgage financing in and some other contact details and I'll be able to point you in a really good direction right after...",
    isInput: true,
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-200 blur-[120px]" />
      </div>

      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="relative w-[280px] h-14">
                <Image src="/mortlogo.png" alt="MortMatch" fill className="object-contain object-left" />
              </div>
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
          </nav>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12 md:py-16 flex flex-col items-center flex-1 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight">
            Meet <span className="text-blue-600">Mort</span>
          </h1>
          
          <div className="text-lg md:text-xl text-slate-600 space-y-6 text-left max-w-2xl mx-auto leading-relaxed bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <p>
              Mort is your friendly AI mortgage assistant, designed to simplify the complex world of home financing. Whether you are buying your first home, looking to refinance, or exploring reverse mortgages, Mort is here to guide you every step of the way.
            </p>
            <p>
              By asking a few simple questions about your unique situation, Mort intelligently matches you with the right mortgage options and connects you with a trusted professional who can help you secure the best possible terms.
            </p>
            <p className="font-semibold text-center text-slate-800 pt-4">
              Ready to find your perfect mortgage? Chat with Mort below to get started now!
            </p>
          </div>
        </div>

        <div className="w-full">
          <ChatForm steps={ABOUT_STEPS} campaignName="about" />
        </div>
      </main>

      <footer className="relative border-t border-slate-200 bg-white/50 py-8 mt-auto z-10">
        <div className="container mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} MortMatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
