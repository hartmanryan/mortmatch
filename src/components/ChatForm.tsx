"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export type StepData = {
  id: string;
  question: string;
  options?: string[];
  isInput?: boolean;
};

type ChatFormProps = {
  steps: StepData[];
  campaignName: string;
  lenderName?: string;
  lenderPhone?: string;
  topic?: string;
  chatslug?: string;
  initialAnswers?: Record<string, string>;
  initialStreet?: string;
};

type FormMessage = {
  id: string;
  sender: "mort" | "user";
  text: string;
};

// Helper to extract text from a UIMessage regardless of SDK version
const getMsgText = (msg: any): string => {
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.parts)) return msg.parts.map((p: any) => p.text || '').join('');
  return '';
};

export default function ChatForm({ steps, campaignName, lenderName, lenderPhone, topic, chatslug, initialAnswers, initialStreet }: ChatFormProps) {
  const [formMessages, setFormMessages] = useState<FormMessage[]>(() => 
    campaignName === "connect" ? [] : [
      { id: "1", sender: "mort", text: steps[0].question }
    ]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => initialAnswers || {});
  const [contact, setContact] = useState({ name: "", phone: "", state: "", email: "", city: "", street: initialStreet || "" });

  const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isAiChatMode, setIsAiChatMode] = useState(campaignName === "connect");
  const [matchedLender, setMatchedLender] = useState<{name: string, phone: string} | null>(
    lenderName && lenderPhone ? { name: lenderName, phone: lenderPhone } : null
  );
  const [leadId, setLeadId] = useState<string | null>(null);

  const refId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("ref") : null;

  const activeLenderName = matchedLender?.name || lenderName;
  const activeLenderPhone = matchedLender?.phone || lenderPhone;

  useEffect(() => {
    setIsAiChatMode(campaignName === "connect");
  }, [campaignName]);

  const chatBodyRef = useRef({
    campaignName,
    leadProfile: answers,
    lenderName: activeLenderName,
    lenderPhone: activeLenderPhone,
    leadId,
    refId,
    topic,
    chatslug
  });

  // Keep ref up to date with latest render state
  chatBodyRef.current = {
    campaignName,
    leadProfile: answers,
    lenderName: activeLenderName,
    lenderPhone: activeLenderPhone,
    leadId,
    refId,
    topic,
    chatslug
  };

  console.log("=== ChatForm client-side render ===", {
    campaignName,
    topic,
    chatslug,
    lenderName,
    lenderPhone,
    activeLenderName,
    activeLenderPhone,
    leadId,
    refId
  });

  const [transport] = useState(() => new DefaultChatTransport({
    body: () => {
      console.log("=== TRANSPORT body function invoked ===", chatBodyRef.current);
      return chatBodyRef.current;
    }
  }));

  const { messages: aiMessages, sendMessage, status } = useChat({
    id: `chat-${campaignName || "default"}-${topic || "none"}-${chatslug || "none"}`,
    transport,
    messages: campaignName === "connect" ? [
      { id: "init-connect", role: "assistant" as any, parts: [{ type: "text" as const, text: steps[0].question }] }
    ] : []
  });

  const [aiInput, setAiInput] = useState("");
  const [showTextCta, setShowTextCta] = useState(false);

  useEffect(() => {
    if (campaignName === "connect") {
      const timer = setTimeout(() => {
        setShowTextCta(true);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [campaignName]);


  const handleAiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAiInput(e.target.value);
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    sendMessage({ role: "user", content: aiInput.trim() } as any);
    setAiInput("");
  };

  useEffect(() => {
    if (isAiChatMode && aiMessages.length === 0 && campaignName !== "connect") {
      sendMessage({ role: "user", content: `I just submitted my profile: ${JSON.stringify(answers)}. I am matched with ${activeLenderName || "a top lender"}. What are your initial thoughts, and what should I do next?` } as any);
    }
  }, [isAiChatMode, aiMessages.length, sendMessage, answers, activeLenderName, campaignName]);

  useEffect(() => {
    const toolMsg = aiMessages.find(
      m => (m.role as string) === "tool" && 
      typeof (m as any).content === "string" && 
      (m as any).content.includes("leadId")
    );
    if (toolMsg) {
      try {
        const data = JSON.parse((toolMsg as any).content);
        if (data.leadId && data.leadId !== leadId) {
          setLeadId(data.leadId);
        }
      } catch (e) {
        console.error("Error parsing tool message content:", e);
      }
    }
  }, [aiMessages, leadId]);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    // Only scroll if we have actually interacted recently, or use a small timeout to let render finish
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [formMessages, aiMessages, isTyping, currentStep]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const first = params.get('first') || "";
      const last = params.get('last') || "";
      const queryName = params.get('name') || (first || last ? `${first} ${last}`.trim() : "");
      const queryEmail = params.get('email') || "";
      const queryPhone = params.get('phone') || "";
      const queryAddress = params.get('address') || "";
      const queryState = params.get('state') || "";
      const queryStreet = params.get('street') || queryAddress;
      const queryCity = params.get('city') || "";

      if (queryName || queryEmail || queryPhone) {
        setContact({
          name: queryName,
          email: queryEmail,
          phone: queryPhone,
          state: queryState,
          street: queryStreet,
          city: queryCity,
        });

        // Automatically register the lead in the dashboard
        const registerLead = async () => {
          try {
            const response = await fetch("/api/leads", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                answers: {},
                contact: {
                  name: queryName,
                  email: queryEmail,
                  phone: queryPhone,
                  state: queryState,
                  street: queryStreet,
                  city: queryCity,
                },
                campaign: campaignName,
                refId,
              }),
            });
            const data = await response.json();
            if (data.success) {
              setLeadId(data.leadId);
            }
          } catch (e) {
            console.error("Auto lead registration failed:", e);
          }
        };
        registerLead();
      } else {
        // Simple fallback parsing for standard query params
        setContact(prev => ({
          ...prev,
          name: params.get('name') || prev.name,
          email: params.get('email') || prev.email,
          phone: params.get('phone') || prev.phone,
          state: params.get('state') || prev.state,
          street: params.get('street') || prev.street,
          city: params.get('city') || prev.city,
        }));
      }
    }
  }, [campaignName, refId]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    let formatted = val;
    if (val.length > 3 && val.length <= 6) {
      formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
    } else if (val.length > 6) {
      formatted = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
    }
    setContact({ ...contact, phone: formatted });
  };

  const handleOptionSelect = (option: string) => {
    const stepId = steps[currentStep].id;
    setFormMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: option }]);
    setAnswers(prev => ({ ...prev, [stepId]: option }));
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      if (nextStep < steps.length) {
        setFormMessages(prev => [...prev, { id: Date.now().toString(), sender: "mort", text: steps[nextStep].question }]);
      }
    }, 1000);
  };

  const handleTextInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const option = inputValue.trim();
    setInputValue("");
    handleOptionSelect(option);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name || !contact.phone || !contact.state) return;

    setFormMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: `${contact.name} (${contact.phone})` }]);
    setIsSubmitting(true);
    setIsTyping(true);

    try {
      const refId = new URLSearchParams(window.location.search).get("ref");
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, contact, campaign: campaignName, refId })
      });
      
      setIsTyping(false);
      if (response.ok) {
        const data = await response.json();
        
        if (data.lenderPhone && data.lenderName) {
          setMatchedLender({ name: data.lenderName, phone: data.lenderPhone });
        }
        if (data.leadId) {
          setLeadId(data.leadId);
        }
        
        if (campaignName === "connect") {
          setIsAiChatMode(false);
          const lenderDisplayName = data.lenderName || "your mortgage pro";
          setFormMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "mort",
              text: `Awesome, ${contact.name}! I've successfully connected you with ${lenderDisplayName}. They have been texted your situation and will text you back at ${contact.phone} shortly! 📱`
            }
          ]);
          setCurrentStep(steps.length);
        } else {
          setIsAiChatMode(true);
          setCurrentStep(steps.length);
        }
      } else {
        setFormMessages(prev => [...prev, { id: Date.now().toString(), sender: "mort", text: "Oops, something went wrong on my end. Please try refreshing!" }]);
      }
    } catch (error: any) {
      console.error("ChatForm submit error:", error);
      setIsTyping(false);
      setFormMessages(prev => [...prev, { id: Date.now().toString(), sender: "mort", text: `Error: ${error.message || error.toString()}` }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-auto min-h-[350px] max-h-[600px] transition-all duration-300">
      <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
        <div className="relative w-12 h-12 bg-white rounded-full p-1 overflow-hidden shrink-0 border-2 border-blue-400">
          <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Mort</h2>
          <p className="text-blue-200 text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
            Online • {isAiChatMode ? "Advisor Mode" : "Ready to match you"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-4">
        <AnimatePresence initial={false}>
          {/* Static Form Messages */}
          {formMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                {msg.sender === "mort" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden relative">
                     <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
                  </div>
                )}
                
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] ${
                  msg.sender === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}

          {/* AI Streaming Chat Messages (Skip trigger, system, tool, and empty messages) */}
          {isAiChatMode && aiMessages.filter((m: any) => {
            if (m.role === "system" || m.role === "tool") return false;
            const text = getMsgText(m);
            if (text.startsWith("I just submitted my profile")) return false;
            if (!text.trim()) return false;
            return true;
          }).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mt-4`}
            >
              <div className={`flex max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden relative">
                     <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
                  </div>
                )}
                
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] ${
                  msg.role === "user" 
                    ? "bg-orange-500 text-white rounded-br-none" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                }`}>
                  <div className="prose prose-sm prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: getMsgText(msg).replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* AI Loading State */}
          {isAiChatMode && status === "submitted" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mt-4"
            >
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden relative">
                   <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 rounded-bl-none flex items-center gap-2 text-sm text-slate-500 italic shadow-sm">
                  <span className="w-4 h-4 border-2 border-slate-300 border-t-orange-500 rounded-full animate-spin"></span>
                  Mort is grabbing advice...
                </div>
              </div>
            </motion.div>
          )}

          {isAiChatMode && activeLenderPhone && activeLenderName && campaignName !== "connect" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 mt-4 ml-11 items-start"
            >
              <a 
                href={`sms:${activeLenderPhone}?&body=${encodeURIComponent(`Hi ${activeLenderName}, Mortmatch just paired us! I'd love to quickly chat about my mortgage options.`)}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md font-medium flex items-center justify-center gap-2 transition-colors text-sm max-w-[200px]"
              >
                Text {activeLenderName} @ {activeLenderPhone}
              </a>
              
              <button 
                onClick={(e) => {
                  e.currentTarget.style.display = 'none';
                  sendMessage({ role: "user", content: `No thanks, tell ${activeLenderName} to email me instead.` } as any);
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm max-w-[200px]"
              >
                Book a Meeting With {activeLenderName}
              </button>
            </motion.div>
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start"
            >
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden relative">
                   <Image src="/mort_face.png" alt="Mort" fill className="object-cover" />
                </div>
                <div className="px-4 py-4 rounded-2xl bg-white border border-slate-100 rounded-bl-none flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        {!isAiChatMode && !isTyping && currentStep < steps.length && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {currentStepData.options ? (
              <div className="flex flex-wrap gap-2 justify-end">
                {currentStepData.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(opt)}
                    className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded-full text-sm border border-slate-200 transition-colors shadow-sm active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : currentStepData.id !== "contact" ? (
              <div className="flex flex-col gap-1 w-full">
                {campaignName === "connect" && currentStep === 0 && (
                  <div className="text-left text-lg text-slate-400 pl-2 select-none animate-bounce">
                    👇
                  </div>
                )}
                <form onSubmit={handleTextInputSubmit} className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-3">
                <div className="flex justify-center gap-2 text-slate-400 text-sm animate-bounce mb-1">
                  <span>👇</span><span>👇</span><span>👇</span>
                </div>
                <input required type="text" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} placeholder="Your Name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input required type="tel" value={contact.phone} onChange={handlePhoneChange} placeholder="Phone (e.g. 555-555-5555)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <select required value={contact.state} onChange={e => setContact({...contact, state: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700">
                  <option value="" disabled>State where you might need financing</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" disabled={isSubmitting} className="mt-2 w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium">
                  {isSubmitting ? "Sending..." : <>Continue <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {isAiChatMode && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col gap-1.5"
          >
            <>
              {campaignName === "connect" && (
                <div className="text-left text-lg text-slate-400 pl-2 select-none animate-bounce">
                  👇
                </div>
              )}
              <form onSubmit={handleAiSubmit} className="flex gap-2 w-full">
                <input
                  type="text"
                  value={aiInput}
                  onChange={handleAiInputChange}
                  placeholder="Type Your Response Here"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  autoFocus
                />
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
            {campaignName === "connect" && showTextCta && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-sm sm:text-base text-orange-600 mt-6 font-bold bg-orange-50/40 py-2.5 px-4 rounded-xl border border-orange-100/60 shadow-sm"
              >
                Optional - Send A Text Message To <a href={`sms:${activeLenderPhone || "215-900-4065"}`} className="underline hover:text-orange-700">{activeLenderPhone || "215-900-4065"}</a> {chatslug ? `to Talk with a real human about ${chatslug} now` : "To Talk With A Real Human Now"}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
