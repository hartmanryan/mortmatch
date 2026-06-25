"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  role: string;
  content: string;
}

interface Lead {
  id: string;
  situation: string;
  priceRange: string;
  employment: string;
  downPayment: string;
  creditScore: string;
  campaign: string;
  timeline: string | null;
  location: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string | null;
  city: string | null;
  state: string | null;
  chatTranscript: any;
  status: string;
  partner?: string | null;
  createdAt: string;
}

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleLead = (leadId: string) => {
    if (expandedLeadId === leadId) {
      setExpandedLeadId(null);
    } else {
      setExpandedLeadId(leadId);
    }
  };

  const filteredLeads = initialLeads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
    const email = lead.email.toLowerCase();
    const phone = lead.phone.toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || email.includes(term) || phone.includes(term);
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search leads by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <div className="absolute left-3.5 top-2.5 text-slate-400 select-none">
            🔍
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4">Lead Name</th>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Situation / Timeline</th>
                <th className="px-6 py-4">Price Range</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500 bg-slate-50/30">
                    <p className="font-medium text-slate-600 mb-1">No leads found.</p>
                    <p className="text-sm">When Mort matches a lead to you, it will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isExpanded = expandedLeadId === lead.id;
                  const rawTranscript = lead.chatTranscript;
                  let transcript: Message[] = [];
                  if (Array.isArray(rawTranscript)) {
                    transcript = rawTranscript as Message[];
                  } else if (typeof rawTranscript === "string") {
                    try {
                      transcript = JSON.parse(rawTranscript);
                    } catch (e) {}
                  }

                  const hasTranscript = transcript.length > 0;

                  return (
                    <>
                      <tr 
                        key={lead.id} 
                        onClick={() => toggleLead(lead.id)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer select-none"
                      >
                        <td className="px-6 py-4 text-center">
                          <button className="text-slate-400 font-bold text-lg hover:text-slate-600">
                            {isExpanded ? "▼" : "▶"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{lead.email}</div>
                          <div className="text-xs text-slate-500 font-medium">{lead.phone}</div>
                          {lead.location && <div className="text-xs text-blue-600 font-medium mt-1">📍 {lead.location}</div>}
                          {lead.partner && <div className="text-xs text-purple-600 font-semibold mt-1">🤝 Partner: {lead.partner}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold capitalize border border-slate-200">
                            {lead.campaign.replace("-", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-sm">
                          <div>{lead.situation}</div>
                          {lead.timeline && <div className="text-xs text-slate-400 mt-0.5">Timeline: {lead.timeline}</div>}
                        </td>
                        <td className="px-6 py-4 font-medium">{lead.priceRange}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            lead.status === 'NEW' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            lead.status === 'CONTACTED' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400 text-xs font-medium">
                          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={7} className="px-8 py-6 border-t border-b border-slate-100">
                            <div className="grid md:grid-cols-2 gap-8">
                              {/* Left Side: Details */}
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Lead Profile Details</h4>
                                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm text-sm">
                                  <div className="grid grid-cols-2 gap-y-2.5">
                                    <div className="text-slate-400 font-medium">Credit Score:</div>
                                    <div className="text-slate-800 font-semibold">{lead.creditScore}</div>
                                    <div className="text-slate-400 font-medium">Down Payment:</div>
                                    <div className="text-slate-800 font-semibold">{lead.downPayment}</div>
                                    <div className="text-slate-400 font-medium">Employment:</div>
                                    <div className="text-slate-800 font-semibold">{lead.employment}</div>
                                    {lead.street && (
                                      <>
                                        <div className="text-slate-400 font-medium">Address:</div>
                                        <div className="text-slate-800 font-semibold">
                                          {lead.street}, {lead.city}, {lead.state}
                                        </div>
                                      </>
                                    )}
                                    {lead.partner && (
                                      <>
                                        <div className="text-slate-400 font-medium">Partner:</div>
                                        <div className="text-slate-800 font-semibold text-purple-600">
                                          {lead.partner}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right Side: Chat Transcript */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Chat Transcript</h4>
                                  {hasTranscript && (
                                    <span className="text-xs text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded font-semibold">
                                      {transcript.filter(m => m.role === 'user').length} Messages
                                    </span>
                                  )}
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                                  {hasTranscript ? (
                                    transcript.map((msg, index) => {
                                      const isUser = msg.role === 'user';
                                      return (
                                        <div 
                                          key={index} 
                                          className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                                        >
                                          <div className={`text-[10px] font-semibold text-slate-400 mb-0.5 px-1`}>
                                            {isUser ? 'User' : 'Mort'}
                                          </div>
                                          <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                            isUser 
                                              ? 'bg-orange-500 text-white rounded-br-none shadow-sm shadow-orange-500/10' 
                                              : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                          }`}>
                                            {msg.content}
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="text-center text-slate-400 py-12 text-xs">
                                      No chat history recorded for this lead yet.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
