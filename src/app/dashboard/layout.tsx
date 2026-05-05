import { LayoutDashboard, Users, Settings, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 bg-white shrink-0">
            <Image src="/mort_face.png" alt="MortMatch" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Mortmatch<span className="text-blue-600">.</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Lender Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            Lead Pipeline
          </Link>
          <Link
            href="/dashboard/links"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <LinkIcon className="w-5 h-5 text-slate-400" />
            Campaign Links
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <Users className="w-5 h-5 text-slate-400" />
            My Profile
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            Billing & Subscriptions
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">My Account</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {children}
      </main>
    </div>
  );
}
