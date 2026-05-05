"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const CAMPAIGNS = [
  {
    id: "general",
    name: "General Mortgage",
    description: "Standard chat flow for general refinance, purchase, and investor inquiries.",
    path: "/",
    color: "blue"
  },
  {
    id: "first-time",
    name: "First-Time Homebuyer",
    description: "Tailored zero-down and low-down-payment program discovery for new buyers.",
    path: "/first",
    color: "orange"
  },
  {
    id: "reverse",
    name: "Reverse Mortgage",
    description: "Specialized HECM consultation flow for seniors looking to access home equity.",
    path: "/reverse",
    color: "amber"
  }
];

export default function CampaignLinksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { user } = useUser();

  const handleCopy = (path: string, id: string) => {
    // Append the lender's unique Clerk ID as a referral parameter
    const refParam = user ? `?ref=${user.id}` : "";
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}${refParam}` : `${path}${refParam}`;
    
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Campaign Links</h1>
        <p className="text-slate-500 font-medium">Generate custom landing page links to share with your audience or run ads to.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {CAMPAIGNS.map((campaign) => (
          <div key={campaign.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold mb-3 bg-${campaign.color}-100 text-${campaign.color}-700 border border-${campaign.color}-200`}>
                  {campaign.name}
                </span>
                <p className="text-sm text-slate-500">{campaign.description}</p>
              </div>
            </div>

            <div className="mt-auto pt-6 flex gap-3">
              <button
                onClick={() => handleCopy(campaign.path, campaign.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                {copiedId === campaign.id ? (
                  <><Check className="w-4 h-4 text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copy Link</>
                )}
              </button>
              
              <Link
                href={user ? `${campaign.path}?ref=${user.id}` : campaign.path}
                target="_blank"
                className="flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-200"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
