"use client";

import { useState } from "react";
import { Save } from "lucide-react";

type ProfileFormProps = {
  initialLender: {
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    companyAddress: string | null;
    nmls: string | null;
    phone: string | null;
  } | null;
};

export default function ProfileForm({ initialLender }: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: initialLender?.firstName || "",
    lastName: initialLender?.lastName || "",
    companyName: initialLender?.companyName || "",
    companyAddress: initialLender?.companyAddress || "",
    nmls: initialLender?.nmls || "",
    phone: initialLender?.phone || ""
  });
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      if (res.ok) {
        setMessage("Profile saved successfully!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to save profile.");
      }
    } catch (err) {
      setMessage("A network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">First Name</label>
            <input
              required
              type="text"
              value={profile.firstName}
              onChange={e => setProfile({...profile, firstName: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Last Name</label>
            <input
              required
              type="text"
              value={profile.lastName}
              onChange={e => setProfile({...profile, lastName: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Company Name</label>
            <input
              type="text"
              value={profile.companyName}
              onChange={e => setProfile({...profile, companyName: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">NMLS #</label>
            <input
              type="text"
              value={profile.nmls}
              onChange={e => setProfile({...profile, nmls: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Company Address</label>
            <input
              type="text"
              value={profile.companyAddress}
              onChange={e => setProfile({...profile, companyAddress: e.target.value})}
              placeholder="e.g. 123 Main St, Suite 100, City, State ZIP"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Business Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile({...profile, phone: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
          {message && (
            <span className={`text-sm font-medium ${message.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
