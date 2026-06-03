import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import LeadsTable from "@/components/LeadsTable";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const impersonatedLenderId = cookieStore.get("impersonate_lender_id")?.value;

  let lender = null;

  // 1. Resolve real user from Supabase Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Load lender details based on session/impersonation
  if (impersonatedLenderId) {
    try {
      lender = await prisma.lender.findUnique({
        where: { id: impersonatedLenderId }
      });
    } catch (e) {
      console.error("Error fetching impersonated lender", e);
    }
  } else if (user?.email) {
    try {
      lender = await prisma.lender.findUnique({
        where: { email: user.email.toLowerCase() }
      });
      
      if (!lender && user.id) {
        lender = await prisma.lender.findUnique({
          where: { authUserId: user.id }
        });
      }
    } catch (e) {
      console.error("Error fetching logged-in lender", e);
    }
  }

  let leads: any[] = [];
  if (lender) {
    try {
      const isDefaultAdmin = lender.email === 'propknocks@gmail.com';
      leads = await prisma.lead.findMany({
        where: isDefaultAdmin
          ? {
              OR: [
                { lenderId: lender.id },
                { lenderId: null }
              ]
            }
          : { lenderId: lender.id },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.error("Error fetching leads from database", e);
    }
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
