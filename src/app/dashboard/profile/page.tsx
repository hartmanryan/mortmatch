import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let lender = null;
  if (user?.email) {
    try {
      lender = await prisma.lender.findUnique({
        where: { email: user.email.toLowerCase() }
      });
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
