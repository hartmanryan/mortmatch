import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const impersonatedLenderId = cookieStore.get("impersonate_lender_id")?.value;

  let lender = null;
  if (user?.email) {
    try {
      const currentLender = await prisma.lender.findUnique({
        where: { email: user.email.toLowerCase() }
      });

      if (impersonatedLenderId && currentLender?.isAdmin) {
        lender = await prisma.lender.findUnique({
          where: { id: impersonatedLenderId }
        });
      }

      if (!lender) {
        lender = currentLender;
        if (!lender && user.id) {
          lender = await prisma.lender.findUnique({
            where: { authUserId: user.id }
          });
        }
      }
    } catch (e) {
      console.error("Error loading profile on server:", e);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Profile</h1>
        <p className="text-slate-500 font-medium">Update your compliance information to display on your landing pages.</p>
      </div>

      <ProfileForm initialLender={lender} />
    </div>
  );
}
