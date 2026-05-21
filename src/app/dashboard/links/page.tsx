"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Video, Link2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const SCENARIOS = [
  {
    id: "reverse-mortgage-123-main",
    title: "Reverse Mortgage (Property Specific)",
    topic: "See If A Reverse Mortgage Makes Sense at 123 Main Street",
    chatslug: "Reverse Mortgage For 123 Main Street",
    description: "Ideal for targeting a specific homeowner or property address with reverse mortgage information."
  },
  {
    id: "first-time-buyer",
    title: "First-Time Buyer Program",
    topic: "Zero-Down & Low-Down Payment Options",
    chatslug: "First-Time Buyer Programs",
    description: "Attract renters and new buyers exploring grants and low-down loan programs."
  },
  {
    id: "refinance-rates",
    title: "Refinance Rate Comparison",
    topic: "Compare Refinance Rates to Lower Your Payment",
    chatslug: "Refinancing Options",
    description: "Lower payment or cash-out marketing campaigns aimed at existing homeowners."
  }
];

export default function CampaignLinksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { user } = useUser();

  const getFullUrl = (topic: string, chatslug: string) => {
    const refParam = user ? `ref=${user.id}` : "";
    const topicParam = `topic=${encodeURIComponent(topic)}`;
    const slugParam = `chatslug=${encodeURIComponent(chatslug)}`;
    const params = [refParam, topicParam, slugParam].filter(Boolean).join("&");
    
    const origin = typeof window !== "undefined" ? window.location.origin : "https://mortmatch.com";
    return `${origin}/?${params}`;
  };

  const getBaseUrl = () => {
    const refParam = user ? `ref=${user.id}` : "";
    const params = [refParam, "topic=", "chatslug="].filter(Boolean).join("&");
    const origin = typeof window !== "undefined" ? window.location.origin : "https://mortmatch.com";
    return `${origin}/?${params}`;
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Traffic & Campaign Links</h1>
        <p className="text-slate-500 font-medium">
          Generate dynamically customized URLs using the main home page link. Custom topic and chatslug parameters customize the page on the fly.
        </p>
      </div>

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
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
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
            const fullUrl = getFullUrl(scenario.topic, scenario.chatslug);
            return (
              <li key={scenario.id} className="p-6 hover:bg-slate-50/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="font-bold text-slate-800 text-base">{scenario.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500">{scenario.description}</p>
                  
                  {/* Parameter Details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-500 font-mono">
                    <div>
                      <span className="font-bold text-slate-700">Headline (topic):</span> &quot;{scenario.topic}&quot;
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Greeting (chatslug):</span> &quot;{scenario.chatslug}&quot;
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleCopy(fullUrl, scenario.id)}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
                  >
                    {copiedId === scenario.id ? (
                      <><Check className="w-4 h-4 text-emerald-300 animate-pulse" /> Copied!</>
                    ) : (
                      <>Get Traffic</>
                    )}
                  </button>

                  <Link
                    href={fullUrl}
                    target="_blank"
                    className="flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-200"
                    title="Preview Live URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
