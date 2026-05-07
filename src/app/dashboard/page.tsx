import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  let leads: any[] = [];
  try {
    leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Database not connected yet", e);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Lead Pipeline</h1>
        <p className="text-slate-500 font-medium">View and manage your incoming mortgage leads.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-6 py-4">Lead Name</th>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Goal / Timeline</th>
                <th className="px-6 py-4">Price Range</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500 bg-slate-50/30">
                    <p className="font-medium text-slate-600 mb-1">No leads available yet.</p>
                    <p className="text-sm">When Mort matches a lead to you, it will appear here.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{lead.email}</div>
                      {lead.location && <div className="text-xs text-blue-600 font-medium mt-1">📍 {lead.location}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold capitalize border border-slate-200">
                        {lead.campaign.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm">
                      <div>{lead.situation}</div>
                      {lead.timeline && <div className="text-xs text-slate-400">Timeline: {lead.timeline}</div>}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
