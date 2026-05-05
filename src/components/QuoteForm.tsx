"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";

type StepData = {
  question: string;
  options: string[];
};

const STEPS: StepData[] = [
  {
    question: "Which best describes your real estate situation?",
    options: [
      "I'm currently renting.",
      "I'm a homeowner - Looking to upsize/downsize",
      "I'm trying to buy my first investment property.",
      "I'm an experienced investor looking to add to my portfolio.",
    ],
  },
  {
    question: "What price range are you potentially shopping in?",
    options: [
      "Under $200k",
      "$200k - $500k",
      "$500k - $1 Million",
      "$1 Million+",
    ],
  },
  {
    question: "Your employment status?",
    options: [
      "Employed - W2 Earner",
      "Self Employed - 1099 / K1",
      "Not Employed",
    ],
  },
  {
    question: "Amount available for down payment and closing costs?",
    options: [
      "Less Than $5,000",
      "$5,000 - $20,000",
      "$20,000 - $50,000",
      "$50,000+",
    ],
  },
  {
    question: "Do you know your credit score?",
    options: [
      "Yes, it's under 600",
      "Yes, it's 600-700",
      "Yes, it's 700+",
      "No, I don't know it.",
    ],
  },
];

export default function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: option }));
    // Automatically proceed to next step after a brief delay for UX
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 400);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, contact })
      });
      
      if (response.ok) {
        setIsSuccess(true);
      } else {
        console.error("Failed to submit lead");
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center shadow-2xl"
      >
        <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>
        <p className="text-slate-300 text-lg">
          We've received your information and are matching you with the perfect lending partners. 
          Expect to hear from us shortly.
        </p>
      </motion.div>
    );
  }

  const progress = ((currentStep) / (STEPS.length + 1)) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
          )}
          <span className="text-sm font-medium text-slate-400 ml-auto">
            Step {currentStep + 1} of {STEPS.length + 1}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep < STEPS.length ? (
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                {STEPS[currentStep].question}
              </h2>

              <div className="flex flex-col gap-3 mt-auto">
                {STEPS[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className={`group relative w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      answers[currentStep] === option
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-200"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-between font-medium">
                      {option}
                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${
                          answers[currentStep] === option ? "translate-x-1 text-blue-400" : "text-slate-500 group-hover:text-white group-hover:translate-x-1"
                        }`}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="contact"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                Almost there!
              </h2>
              <p className="text-slate-400 mb-8">
                Where should we send your matches?
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Submit & Start The Process"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
