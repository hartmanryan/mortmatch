import prisma from "@/lib/prisma";
import LeadsTable from "@/components/LeadsTable";

export default async function DashboardPage() {
  let leads: any[] = [];
  try {
    leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Database not connected yet", e);
  }

  // Convert Date objects to ISO strings to make it serializable for client component props
  const serializableLeads = leads.map(lead => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Lead Pipeline</h1>
        <p className="text-slate-500 font-medium">View, search, and manage your incoming mortgage leads and AI chat transcripts.</p>
      </div>

      <LeadsTable initialLeads={serializableLeads} />
    </div>
  );
}
