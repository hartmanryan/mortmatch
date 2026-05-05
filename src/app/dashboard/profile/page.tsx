"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Save } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    nmls: "",
    phone: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.id) {
      // Fetch existing profile
      fetch(`/api/profile?clerkId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.lender) {
            setProfile({
              firstName: data.lender.firstName || user.firstName || "",
              lastName: data.lender.lastName || user.lastName || "",
              companyName: data.lender.companyName || "",
              nmls: data.lender.nmls || "",
              phone: data.lender.phone || ""
            });
          } else {
            // Default to clerk info if no db record yet
            setProfile(prev => ({
              ...prev,
              firstName: user.firstName || "",
              lastName: user.lastName || ""
            }));
          }
        });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          ...profile
        })
      });

      if (res.ok) {
        setMessage("Profile saved successfully!");
      } else {
        setMessage("Failed to save profile.");
      }
    } catch (err) {
      setMessage("A network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Profile</h1>
        <p className="text-slate-500 font-medium">Update your compliance information to display on your landing pages.</p>
      </div>

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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
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
    </div>
  );
}
