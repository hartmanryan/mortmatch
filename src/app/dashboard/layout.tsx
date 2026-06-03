import { LayoutDashboard, Users, Settings, Link as LinkIcon, ShieldAlert, LogOut, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const impersonatedLenderId = cookieStore.get("impersonate_lender_id")?.value;

  let lender = null;
  let isImpersonating = false;
  let isAdmin = false;

  // 1. Resolve real user from Supabase Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let realLender = null;
  if (user?.email) {
    console.log("[DashboardLayout] Auth User Email:", user.email);
    try {
      realLender = await prisma.lender.findUnique({
        where: { email: user.email.toLowerCase() }
      });
      console.log("[DashboardLayout] Resolved database lender:", realLender);
      isAdmin = realLender?.isAdmin || false;
    } catch (e) {
      console.error("[DashboardLayout] Database error fetching real user", e);
    }
  } else {
    console.log("[DashboardLayout] No user session email found. User object:", user);
  }

  // 2. Load lender details based on impersonation or standard session
  if (impersonatedLenderId) {
    try {
      lender = await prisma.lender.findUnique({
        where: { id: impersonatedLenderId }
      });
      isImpersonating = true;
    } catch (e) {
      console.error("Error fetching impersonated lender profile", e);
    }
  } else {
    lender = realLender;
  }

  const displayName = lender 
    ? `${lender.firstName || ""} ${lender.lastName || ""}`.trim() || lender.email 
    : "Lender";

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="w-full bg-rose-600 text-white px-4 py-2.5 flex items-center justify-center gap-4 text-sm font-bold shadow-md z-50 shrink-0 select-none animate-pulse">
          <span className="flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 animate-spin-slow" />
            You are currently viewing the portal as: <span className="underline">{displayName}</span>
          </span>
          <form action="/api/admin/stop-impersonate" method="POST">
            <button type="submit" className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800 px-3 py-1 rounded-full text-xs font-black transition-all border border-rose-500 hover:scale-105 active:scale-95 cursor-pointer">
              Stop Impersonating
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 bg-white shrink-0">
              <Image src="/mort_face.png" alt="MortMatch" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                Mortmatch<span className="text-blue-600">.</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Lender Portal</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 mt-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 text-slate-400" />
              Lead Pipeline
            </Link>
            <Link
              href="/dashboard/links"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              <LinkIcon className="w-5 h-5 text-slate-400" />
              Campaign Links
            </Link>
            <Link
              href="/dashboard/leads"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Done-For-You Leads
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              <Users className="w-5 h-5 text-slate-400" />
              My Profile
            </Link>

            {/* Admin panel link */}
            {isAdmin && (
              <div className="pt-4 border-t border-slate-100 mt-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold transition-colors border border-dashed border-rose-200"
                >
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  Admin Panel
                </Link>
              </div>
            )}
          </nav>

          {/* User Details & Sign Out */}
          <div className="p-4 border-t border-slate-150 flex flex-col gap-3">
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                {displayName.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 truncate leading-snug">{displayName}</p>
                <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase truncate">
                  {isAdmin ? "Super Admin" : "Lender"}
                </p>
              </div>
            </div>
            
            <form action="/api/auth/signout" method="POST" className="w-full">
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-500 text-xs font-bold transition-all border border-slate-200 hover:border-red-100 active:scale-[0.98] cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
