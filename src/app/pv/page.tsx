import Image from "next/image";
import prisma from "@/lib/prisma";
import Footer from "@/components/Footer";
import AvmCalculator from "./AvmCalculator";

export default async function PropertyValuePage({ searchParams }: { searchParams: Promise<{ ref?: string, street?: string, street2?: string, city?: string, state?: string, zip?: string, estmortgage?: string }> }) {
  const params = await searchParams;
  const ref = params.ref;
  const street = params.street;
  const street2 = params.street2;
  const city = params.city;
  const state = params.state;
  const zip = params.zip;
  const estmortgage = params.estmortgage;

  let lender = null;
  if (ref) {
    try {
      lender = await prisma.lender.findFirst({
        where: {
          OR: [
            { authUserId: ref },
            { id: ref }
          ]
        }
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

  const refQuery = ref ? `?ref=${ref}` : '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 flex flex-col">
      {/* Dynamic Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/70 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100/70 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-[280px] h-14">
              <a href={`/${refQuery}`}>
                <Image src="/mortlogo.png" alt="MortMatch" fill className="object-contain object-left" />
              </a>
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
                <a href={`/first${refQuery}`} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 text-slate-700 hover:text-blue-600">First Time Buyer</a>
                <a href={`/refinance${refQuery}`} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 text-slate-700 hover:text-blue-600">Refinance</a>
                <a href={`/pv${refQuery}`} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 text-slate-700 hover:text-blue-600">Home Value Estimate</a>
                <a href={`/self-employed${refQuery}`} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 text-slate-700 hover:text-blue-600">Self Employed</a>
                <a href={`/reverse${refQuery}`} className="px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600">Reverse Mortgage</a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8 md:py-12 flex flex-col items-center flex-1 z-10 w-full max-w-5xl">
        <AvmCalculator
          lender={lender}
          refQuery={refQuery}
          initialStreet={street}
          initialStreet2={street2}
          initialCity={city}
          initialState={state}
          initialZip={zip}
          initialEstMortgage={estmortgage}
        />
      </main>

      <Footer lender={lender} />
    </div>
  );
}
