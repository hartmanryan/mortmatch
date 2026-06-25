"use client";

import { useState } from "react";
import { Search, Home, DollarSign, ArrowUpRight, Percent, Loader2, Sparkles, HelpCircle } from "lucide-react";
import ChatForm, { StepData } from "@/components/ChatForm";

type AvmCalculatorProps = {
  lender: any;
  refQuery: string;
  initialStreet?: string;
  initialStreet2?: string;
  initialCity?: string;
  initialState?: string;
  initialZip?: string;
  initialEstMortgage?: string;
};

export default function AvmCalculator({
  lender,
  refQuery,
  initialStreet,
  initialStreet2,
  initialCity,
  initialState,
  initialZip,
  initialEstMortgage
}: AvmCalculatorProps) {
  const [streetAddress, setStreetAddress] = useState(initialStreet || "");
  const [unit, setUnit] = useState(initialStreet2 || "");
  const [city, setCity] = useState(initialCity || "");
  const [state, setState] = useState(initialState || "");
  const [zipCode, setZipCode] = useState(initialZip || "");

  const [mortgageBalance, setMortgageBalance] = useState(() => {
    if (!initialEstMortgage) return "";
    const cleanNum = parseInt(initialEstMortgage.replace(/[^\d]/g, ""));
    return isNaN(cleanNum) ? "" : cleanNum.toLocaleString();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  // Valuation Results
  const [results, setResults] = useState<{
    success: boolean;
    mocked: boolean;
    address: string;
    avm: {
      amount: number;
      confidence_score: number;
      range_low: number;
      range_high: number;
      valuation_date: string;
    };
  } | null>(null);

  const [showChat, setShowChat] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!streetAddress.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      setError("Please fill out all required fields: Street, City, State, and Zip Code.");
      return;
    }

    const balanceNum = parseFloat(mortgageBalance.replace(/,/g, "")) || 0;
    if (balanceNum < 0) {
      setError("Mortgage balance cannot be negative.");
      return;
    }

    // Compile address components for AVM API
    const streetCombined = [streetAddress.trim(), unit.trim()].filter(Boolean).join(" ");
    const cityStateZip = `${city.trim()}, ${state.trim()} ${zipCode.trim()}`;
    const compiledAddress = `${streetCombined}, ${cityStateZip}`;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/avm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: compiledAddress }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch valuation. Please try again.");
      }

      const data = await response.json();
      if (data.success) {
        setResults(data);
      } else {
        throw new Error(data.error || "Failed to fetch valuation.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const balance = results ? parseFloat(mortgageBalance.replace(/,/g, "")) || 0 : 0;
  const valuation = results?.avm.amount || 0;
  const equity = results ? Math.max(0, valuation - balance) : 0;
  const ltv = results && valuation > 0 ? Math.min(100, Math.round((balance / valuation) * 100)) : 0;
  
  // Standard maximum refinance LTV is typically 80% for cash-out refinance
  const maxRefiLtv = 0.8;
  const maxCashOutLimit = results ? Math.max(0, Math.round(valuation * maxRefiLtv - balance)) : 0;

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formattedValuation = formatCurrency(valuation);
  const formattedEquity = formatCurrency(equity);
  const formattedCashOut = formatCurrency(maxCashOutLimit);
  const formattedBalance = formatCurrency(balance);

  // Setup Chat Steps dynamically with calculations
  const avmSteps: StepData[] = results ? [
    {
      id: "situation",
      question: `Hi there! I'm Mort. 👋 I see your home at ${results.address} is estimated at ${formattedValuation} and you have around ${formattedEquity} in equity! Let's explore your refinance and cash-out options. First, how would you describe your credit score?`,
      options: ["Excellent (720+)", "Good (660-719)", "Fair (620-659)", "Poor (Under 620)"],
    },
    {
      id: "contact",
      question: `Great! Let me know where you're located and your name so I can connect you with a specialist to review these refinance scenarios.`,
      isInput: true,
    }
  ] : [];

  const initialAnswers = results ? ({
    situation: `Refinance / Cash Out - Property Value: ${formattedValuation}, Mortgage Balance: ${formattedBalance}, Est. Equity: ${formattedEquity}`,
    homeValue: formattedValuation,
    currentBalance: formattedBalance,
    goal: maxCashOutLimit > 0 ? "Cash Out" : "Lower My Rate"
  } as Record<string, string>) : undefined;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Headline Section */}
      <div className="text-center mb-10 max-w-3xl animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 leading-tight">
          Check your property value & refinance <span className="text-blue-600">cash-out</span> equity{initialStreet ? ` at ${initialStreet}` : ""}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Enter your address to instantly estimate your property value and see how much cash you could pull out of your equity with a refinance.
        </p>
      </div>

      {!results ? (
        /* Valuation Input Form Card */
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-6 -mt-6"></div>
          
          <form onSubmit={handleCalculate} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-blue-500" />
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  required
                  placeholder="e.g. 1200 S Harrison St"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="unit" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Apt / Suite / Unit (Optional)
                </label>
                <input
                  id="unit"
                  type="text"
                  placeholder="e.g. Apt 4B"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label htmlFor="city" className="block text-xs font-semibold text-slate-500 mb-1.5">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-semibold text-slate-500 mb-1.5">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    required
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white text-slate-700"
                  />
                </div>

                <div>
                  <label htmlFor="zip" className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Zip Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    required
                    placeholder="Zip"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="balance" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-500" />
                Estimated Mortgage Balance (Optional)
              </label>
              <div className="relative">
                <input
                  id="balance"
                  type="text"
                  placeholder="e.g. 250,000"
                  value={mortgageBalance}
                  onChange={(e) => {
                    // Only allow numbers and commas
                    const val = e.target.value.replace(/[^\d]/g, "");
                    setMortgageBalance(val ? parseInt(val).toLocaleString() : "");
                  }}
                  className="w-full border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <span className="font-semibold text-slate-400 absolute left-5 top-1/2 -translate-y-1/2">$</span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Leave blank or enter 0 if you own the home outright.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold text-base shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Valuation...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-blue-200" />
                  Get Valuation & Cash Estimate
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Interactive Results Section */
        <div className="w-full space-y-8 animate-fade-in-up">
          {!showChat ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Valuation Dashboard Metrics */}
              <div className="md:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8 space-y-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      AVM Valuation Ready
                    </span>
                    {results.mocked && (
                      <span className="text-[11px] text-slate-400 font-medium">Estimated Market Value</span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-slate-500 uppercase tracking-wide">Property Address</h3>
                  <p className="text-xl font-bold text-slate-800 mt-1">{results.address}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Estimated Property Value</h4>
                    <p className="text-3xl font-extrabold text-blue-600 tracking-tight mt-1">{formattedValuation}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Range: {formatCurrency(results.avm.range_low)} - {formatCurrency(results.avm.range_high)}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Estimated Equity</h4>
                    <p className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">{formattedEquity}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Mortgage Balance: {formattedBalance}
                    </div>
                  </div>
                </div>

                {/* Loan-to-Value Gauge */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>LOAN-TO-VALUE (LTV) RATIO</span>
                    <span>{ltv}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        ltv > 80 ? 'bg-red-500' : ltv > 60 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${ltv}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0% (Fully Owned)</span>
                    <span className="font-semibold text-slate-500">80% Refinance Limit</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Cash-Out Offer Panel */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[50px] pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[50px] pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/20">
                    Refinance Analysis
                  </span>
                  
                  {maxCashOutLimit > 0 ? (
                    <>
                      <h3 className="text-xl font-bold tracking-tight leading-tight">Your Max Refinance Cash Out Potential</h3>
                      <div className="pt-2">
                        <div className="text-[13px] text-slate-400 font-medium uppercase tracking-wider">Unlockable Capital</div>
                        <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 tracking-tight mt-1">
                          {formattedCashOut}
                        </p>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed pt-2">
                        You qualify for cash-out refinancing up to a maximum 80% LTV. This means you could refinance your existing mortgage and walk away with up to <strong className="text-white">{formattedCashOut} in cash</strong> at closing.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold tracking-tight leading-tight">No Cash-Out Potential Detected</h3>
                      <div className="pt-2">
                        <div className="text-[13px] text-slate-400 font-medium uppercase tracking-wider">Estimated Equity</div>
                        <p className="text-4xl font-extrabold text-slate-300 tracking-tight mt-1">
                          {formattedEquity}
                        </p>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed pt-2">
                        To pull cash out, lenders typically require you to keep at least 20% equity in your home. However, you can still refinance to lower your monthly payments or shorten your loan term!
                      </p>
                    </>
                  )}
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    onClick={() => setShowChat(true)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    Explore Your Refinance Scenarios
                    <ArrowUpRight className="w-5 h-5 text-blue-200 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                  <button 
                    onClick={() => setResults(null)}
                    className="w-full text-center text-xs text-slate-400 hover:text-white mt-4 font-semibold transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Check Another Address
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Embedding Mort Chat Form pre-loaded with values */
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
                <button
                  onClick={() => setShowChat(false)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 border-none bg-transparent cursor-pointer"
                >
                  ← Back to Valuation Details
                </button>
                <span className="text-xs text-slate-400 font-bold">Refinance Campaign: PV</span>
              </div>
              <ChatForm
                steps={avmSteps}
                campaignName="refinance" // map to refinance to utilize correct knowledge-base guidelines
                lenderName={lender ? `${lender.firstName || ""} ${lender.lastName || ""}`.trim() : undefined}
                lenderPhone={lender?.phone || undefined}
                topic={`Refinance valuation details for ${results.address}`}
                chatslug="refinance"
                initialAnswers={initialAnswers}
                initialStreet={results.address}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
