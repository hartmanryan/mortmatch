import React from 'react';
import { Users, Search, ShieldAlert, LogIn, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const currentUserLender = await prisma.lender.findUnique({
    where: { email: user.email!.toLowerCase() }
  });

  if (!currentUserLender || !currentUserLender.isAdmin) {
    redirect('/dashboard');
  }

  // Fetch real lenders from the database
  const lenders = await prisma.lender.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200">
              <ShieldAlert className="w-3 h-3" />
              Super Admin Access
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Lender Directory</h1>
            <p className="text-slate-500">Manage and impersonate active MortMatch lenders.</p>
          </div>
        </div>

        {/* Add Lender Form */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Manually Pre-Add Lender</h2>
          <form action={async (formData: FormData) => {
            'use server';
            try {
              const email = formData.get('email')?.toString();
              if (!email) return;

              const firstName = (formData.get('firstName')?.toString() || '').trim() || email.split('@')[0];
              const lastName = (formData.get('lastName')?.toString() || '').trim() || 'Lender';

              await prisma.lender.upsert({
                where: { email: email.toLowerCase().trim() },
                update: {},
                create: {
                  email: email.toLowerCase().trim(),
                  firstName,
                  lastName,
                  isActive: true,
                  isAdmin: false,
                }
              });

              const { revalidatePath } = await import('next/cache');
              revalidatePath('/admin');
            } catch (error) {
              console.error("Failed to add lender:", error);
            }
          }} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
              <input type="email" name="email" required className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64 text-slate-900" placeholder="lender@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">First Name (Optional)</label>
              <input type="text" name="firstName" className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-40 text-slate-900" placeholder="First" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Last Name (Optional)</label>
              <input type="text" name="lastName" className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-40 text-slate-900" placeholder="Last" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors h-[38px]">
              + Add to Directory
            </button>
          </form>
        </div>

        {/* Directory Table */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Lender</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">NMLS</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lenders.map((lender) => {
                  const lenderName = `${lender.firstName || ""} ${lender.lastName || ""}`.trim() || "Unnamed Lender";
                  return (
                    <tr key={lender.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase shrink-0">
                            {lenderName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{lenderName}</p>
                            <p className="text-xs font-medium text-slate-500">{lender.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {lender.companyName || "Not Set"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {lender.nmls || "Not Set"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          lender.isAdmin 
                            ? 'bg-rose-100 text-rose-700 border-rose-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {lender.isAdmin ? 'Admin' : 'Lender'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action="/api/admin/impersonate" method="POST">
                          <input type="hidden" name="lenderId" value={lender.id} />
                          <button 
                            type="submit"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            Login As
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
