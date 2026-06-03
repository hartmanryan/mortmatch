import { createClient } from "@/utils/supabase/server";
import CampaignLinksClient from "./CampaignLinksClient";

export default async function CampaignLinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || "";

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">Traffic & Campaign Links</h1>
        <p className="text-slate-500 font-medium">
          Generate dynamically customized URLs using the main home page link. Custom topic and chatslug parameters customize the page on the fly.
        </p>
      </div>

      <CampaignLinksClient userId={userId} />
    </div>
  );
}
