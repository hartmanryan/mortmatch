"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Video, Link2, HelpCircle, Sparkles, Sliders, ChevronDown, CheckCircle } from "lucide-react";
import Link from "next/link";

const SCENARIOS = [
  {
    id: "home-value-estimator",
    title: "Home Value & Cash Out Refinance Estimator",
    path: "/equity",
    topic: "",
    chatslug: "",
    description: "Provide clients with an instant home value estimate and show their potential cash-out refinance options."
  },
  {
    id: "reverse-mortgage-123-main",
    title: "Reverse Mortgage (Property Specific)",
    path: "/",
    topic: "See If A Reverse Mortgage Makes Sense at 123 Main Street",
    chatslug: "Reverse Mortgage For 123 Main Street",
    description: "Ideal for targeting a specific homeowner or property address with reverse mortgage information."
  },
  {
    id: "first-time-buyer",
    title: "First-Time Buyer Program",
    path: "/",
    topic: "Zero-Down & Low-Down Payment Options",
    chatslug: "First-Time Buyer Programs",
    description: "Attract renters and new buyers exploring grants and low-down loan programs."
  },
  {
    id: "refinance-rates",
    title: "Refinance Rate Comparison",
    path: "/",
    topic: "Compare Refinance Rates to Lower Your Payment",
    chatslug: "Refinancing Options",
    description: "Lower payment or cash-out marketing campaigns aimed at existing homeowners."
  }
];

type CampaignLinksClientProps = {
  userId: string;
};

export default function CampaignLinksClient({ userId }: CampaignLinksClientProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Integration builder state
  const [selectedTemplate, setSelectedTemplate] = useState(SCENARIOS[0].id);
  const [integrationPreset, setIntegrationPreset] = useState<"thanks" | "custom">("thanks");
  
  // Custom mock values for the integration builder
  const [mockValues, setMockValues] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    street: "123 Main St",
    city: "Tampa",
    state: "FL",
    zip: "33602",
    partner: "CustomPartner"
  });

  const getFullUrl = (scenario: typeof SCENARIOS[0]) => {
    const refParam = userId ? `ref=${userId}` : "";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://mortmatch.com";
    
    if (scenario.path === "/equity") {
      const params = [refParam].filter(Boolean).join("&");
      return `${origin}/equity${params ? `?${params}` : ""}`;
    }
    
    const topicParam = `topic=${encodeURIComponent(scenario.topic)}`;
    const slugParam = `chatslug=${encodeURIComponent(scenario.chatslug)}`;
    const params = [refParam, topicParam, slugParam].filter(Boolean).join("&");
    
    return `${origin}/?${params}`;
  };

  const getBaseUrl = () => {
    const refParam = userId ? `ref=${userId}` : "";
    const params = [refParam, "topic=", "chatslug="].filter(Boolean).join("&");
    const origin = typeof window !== "undefined" ? window.location.origin : "https://mortmatch.com";
    return `${origin}/?${params}`;
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate Personalized URL based on Builder options
  const getPersonalizedUrl = () => {
    const scenario = SCENARIOS.find(s => s.id === selectedTemplate) || SCENARIOS[0];
    const origin = typeof window !== "undefined" ? window.location.origin : "https://mortmatch.com";
    
    const baseParams: string[] = [];
    if (userId) baseParams.push(`ref=${userId}`);

    if (scenario.path === "/equity") {
      if (integrationPreset === "thanks") {
        baseParams.push(`name=~FIRST_NAME~+~LAST_NAME~`);
        baseParams.push(`email=~EMAIL~`);
        baseParams.push(`phone=~PHONE~`);
        baseParams.push(`street=~ADDRESS~`);
        baseParams.push(`city=~CITY~`);
        baseParams.push(`state=~STATE~`);
        baseParams.push(`zip=~ZIP~`);
        baseParams.push(`partner=thanks.io`);
      } else {
        if (mockValues.street) baseParams.push(`street=${encodeURIComponent(mockValues.street)}`);
        if (mockValues.city) baseParams.push(`city=${encodeURIComponent(mockValues.city)}`);
        if (mockValues.state) baseParams.push(`state=${encodeURIComponent(mockValues.state)}`);
        if (mockValues.zip) baseParams.push(`zip=${encodeURIComponent(mockValues.zip)}`);
        if (mockValues.partner) baseParams.push(`partner=${encodeURIComponent(mockValues.partner)}`);
      }
      return `${origin}/equity?${baseParams.join("&")}`;
    }

    baseParams.push(`topic=${encodeURIComponent(scenario.topic)}`);
    baseParams.push(`chatslug=${encodeURIComponent(scenario.chatslug)}`);

    if (integrationPreset === "thanks") {
      baseParams.push(`name=~FIRST_NAME~+~LAST_NAME~`);
      baseParams.push(`email=~EMAIL~`);
      baseParams.push(`phone=~PHONE~`);
      baseParams.push(`street=~ADDRESS~`);
      baseParams.push(`city=~CITY~`);
      baseParams.push(`state=~STATE~`);
      baseParams.push(`partner=thanks.io`);
    } else {
      if (mockValues.name) baseParams.push(`name=${encodeURIComponent(mockValues.name)}`);
      if (mockValues.email) baseParams.push(`email=${encodeURIComponent(mockValues.email)}`);
      if (mockValues.phone) baseParams.push(`phone=${encodeURIComponent(mockValues.phone)}`);
      if (mockValues.street) baseParams.push(`street=${encodeURIComponent(mockValues.street)}`);
      if (mockValues.city) baseParams.push(`city=${encodeURIComponent(mockValues.city)}`);
      if (mockValues.state) baseParams.push(`state=${encodeURIComponent(mockValues.state)}`);
      if (mockValues.partner) baseParams.push(`partner=${encodeURIComponent(mockValues.partner)}`);
    }

    return `${origin}/?${baseParams.join("&")}`;
  };

  return (
    <div className="space-y-10">
      {/* Dynamic Base URL & How-To Video Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Base URL Box */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Base Campaign URL</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Add your own custom parameters at the end of this link to customize the headline and welcome chat message dynamically.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 select-all font-mono text-xs text-slate-700 break-all mb-4">
              {getBaseUrl()}
            </div>
          </div>
          <button
            onClick={() => handleCopy(getBaseUrl(), "base-url")}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            {copiedId === "base-url" ? (
              <><Check className="w-4 h-4 text-emerald-400" /> Copied Base URL</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy Base URL</>
            )}
          </button>
        </div>

        {/* Video Placeholder */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-700 text-sm mb-1">How-To Video Guide</h3>
          <p className="text-xs text-slate-400 max-w-[200px]">
            A step-by-step video guide explaining traffic routing will be placed here soon.
          </p>
        </div>
      </div>

      {/* Bulleted Scenarios List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended Marketing Links</h2>
            <p className="text-xs text-slate-500 font-medium">Preconfigured campaigns for common client search queries.</p>
          </div>
          <HelpCircle className="w-5 h-5 text-slate-400" />
        </div>

        <ul className="divide-y divide-slate-150">
          {SCENARIOS.map((scenario) => {
            const fullUrl = getFullUrl(scenario);
            return (
              <li key={scenario.id} className="p-6 hover:bg-slate-50/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="font-bold text-slate-800 text-base">{scenario.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500">{scenario.description}</p>
                  
                  {/* Parameter Details */}
                  {scenario.path === "/equity" ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-500 font-mono">
                      <div>
                        <span className="font-bold text-slate-700">Path:</span> &quot;/equity&quot;
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Parameters:</span> street, city, state, zip
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-500 font-mono">
                      <div>
                        <span className="font-bold text-slate-700">Headline (topic):</span> &quot;{scenario.topic}&quot;
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Greeting (chatslug):</span> &quot;{scenario.chatslug}&quot;
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions: Preview -> Copy Link -> Get Traffic */}
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={fullUrl}
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-200 animate-fade-in"
                    title="Preview Live URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Preview</span>
                  </Link>

                  <button
                    onClick={() => handleCopy(fullUrl, scenario.id)}
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    {copiedId === scenario.id ? (
                      <><Check className="w-4 h-4 text-emerald-400" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Link</>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* URL Personalization & Direct Mail Integration Builder */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personalization & CRM/Direct Mail Builder</h2>
              <p className="text-xs text-slate-500 font-medium">Auto-fill customer name, address, and email from systems like Thanks.io.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-600">
            Append contact information to the landing page URL. When a prospect scans a QR code or clicks the link, MortMatch will automatically greet them by name and register their contact info before they start chatting!
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column: Configuration */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1. Select Campaign Template</label>
                <div className="relative">
                  <select 
                    value={selectedTemplate} 
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer text-slate-800"
                  >
                    {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">2. Choose Integration Preset</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIntegrationPreset("thanks")}
                    className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      integrationPreset === "thanks"
                        ? "bg-orange-50 border-orange-200 text-orange-700 shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📩 Thanks.io Mailer
                  </button>
                  <button
                    onClick={() => setIntegrationPreset("custom")}
                    className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      integrationPreset === "custom"
                        ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🛠️ Custom Test Link
                  </button>
                </div>
              </div>

              {/* Dynamic Preset Inputs */}
              {integrationPreset === "thanks" ? (
                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 text-xs space-y-2 text-slate-600">
                  <h4 className="font-bold text-orange-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Done-For-You Placeholders Enabled
                  </h4>
                  <p>We have mapped the following standard Thanks.io recipient placeholders onto the URL parameters:</p>
                  {(SCENARIOS.find(s => s.id === selectedTemplate)?.path === "/equity") ? (
                    <ul className="list-disc list-inside space-y-1 font-mono text-slate-700 pl-1">
                      <li>name = <span className="font-bold text-orange-700">~FIRST_NAME~ ~LAST_NAME~</span></li>
                      <li>email = <span className="font-bold text-orange-700">~EMAIL~</span></li>
                      <li>phone = <span className="font-bold text-orange-700">~PHONE~</span></li>
                      <li>street = <span className="font-bold text-orange-700">~ADDRESS~</span></li>
                      <li>city = <span className="font-bold text-orange-700">~CITY~</span></li>
                      <li>state = <span className="font-bold text-orange-700">~STATE~</span></li>
                      <li>zip = <span className="font-bold text-orange-700">~ZIP~</span></li>
                      <li>partner = <span className="font-bold text-orange-700">thanks.io</span></li>
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 font-mono text-slate-700 pl-1">
                      <li>name = <span className="font-bold text-orange-700">~FIRST_NAME~ ~LAST_NAME~</span></li>
                      <li>email = <span className="font-bold text-orange-700">~EMAIL~</span></li>
                      <li>phone = <span className="font-bold text-orange-700">~PHONE~</span></li>
                      <li>street = <span className="font-bold text-orange-700">~ADDRESS~</span></li>
                      <li>city = <span className="font-bold text-orange-700">~CITY~</span></li>
                      <li>state = <span className="font-bold text-orange-700">~STATE~</span></li>
                      <li>partner = <span className="font-bold text-orange-700">thanks.io</span></li>
                    </ul>
                  )}
                  <p className="pt-2 text-slate-500 italic">Copy the generated URL below and paste it directly into your thanks.io campaign dashboard destination link.</p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Test Values Simulator</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {(SCENARIOS.find(s => s.id === selectedTemplate)?.path !== "/equity") && (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Name</label>
                          <input 
                            type="text" 
                            value={mockValues.name} 
                            onChange={(e) => setMockValues({...mockValues, name: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                          <input 
                            type="email" 
                            value={mockValues.email} 
                            onChange={(e) => setMockValues({...mockValues, email: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone</label>
                          <input 
                            type="text" 
                            value={mockValues.phone} 
                            onChange={(e) => setMockValues({...mockValues, phone: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Street Address</label>
                      <input 
                        type="text" 
                        value={mockValues.street} 
                        onChange={(e) => setMockValues({...mockValues, street: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
                      <input 
                        type="text" 
                        value={mockValues.city} 
                        onChange={(e) => setMockValues({...mockValues, city: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State</label>
                      <input 
                        type="text" 
                        value={mockValues.state} 
                        onChange={(e) => setMockValues({...mockValues, state: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                      />
                    </div>
                    {SCENARIOS.find(s => s.id === selectedTemplate)?.path === "/equity" && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Zip Code</label>
                        <input 
                          type="text" 
                          value={mockValues.zip} 
                          onChange={(e) => setMockValues({...mockValues, zip: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Partner</label>
                      <input 
                        type="text" 
                        value={mockValues.partner} 
                        onChange={(e) => setMockValues({...mockValues, partner: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Output */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-inner relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20 pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Generated Integration URL</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-blue-300 break-all select-all min-h-[140px] leading-relaxed">
                  {getPersonalizedUrl()}
                </div>
              </div>

              <div className="flex gap-3 mt-6 relative z-10">
                <button
                  onClick={() => handleCopy(getPersonalizedUrl(), "integration-url")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  {copiedId === "integration-url" ? (
                    <><Check className="w-4 h-4 text-emerald-300" /> Copied URL</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Integration Link</>
                  )}
                </button>

                <Link
                  href={getPersonalizedUrl()}
                  target="_blank"
                  className="flex items-center justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-all border border-slate-700"
                >
                  <ExternalLink className="w-4.5 h-4.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
