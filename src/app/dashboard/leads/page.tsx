export default function LeadsServicePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Want Mort To Fill Your Pipeline?
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          Don&apos;t have time to manage ads yourself? Let our expert media buying team drive highly qualified traffic directly into your MortMatch funnel. We use a proprietary mix of channels to ensure you get the highest intent borrowers.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
            📈
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Omni-Channel PPC</h3>
          <p className="text-sm text-slate-500">
            We run high-converting campaigns across Google, Facebook, Instagram, and YouTube.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
            🎯
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Custom Fit Targeting</h3>
          <p className="text-sm text-slate-500">
            Whether you want First-Time Buyers or Reverse Mortgages, we tailor the audience specifically to your goals.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
            ✉️
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Direct Mail Integration</h3>
          <p className="text-sm text-slate-500">
            We augment digital efforts with high-impact physical mailers sent directly to high-equity homeowners.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 mb-12 text-white overflow-hidden relative shadow-lg">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-50" />
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Transparent, Tiered Pricing</h2>
          <p className="text-slate-300 mb-6">
            Every lead generation campaign is custom-fit to your specific needs and geographic area. Our management fees are tied directly to your monthly ad spend budget:
          </p>
          <ul className="space-y-4 font-medium">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm">✓</span>
              <strong>Starter ($1k - $3k Spend):</strong> $500 Flat Management Fee
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm">✓</span>
              <strong>Growth ($3k - $10k Spend):</strong> 15% of Ad Spend
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm">✓</span>
              <strong>Enterprise ($10k+ Spend):</strong> 10% of Ad Spend
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden" id="book">
        <div className="p-8 border-b border-slate-100 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Book Your Strategy Session</h2>
          <p className="text-slate-500 mt-2">Let&apos;s map out exactly how many leads you need this month.</p>
        </div>
        <div className="w-full h-[700px]">
          <iframe 
            src="https://api.leadconnectorhq.com/widget/bookings/ryan-hartman-personal-calendar-iaf4mhk9e" 
            style={{ width: '100%', height: '100%', border: 'none' }} 
            scrolling="yes" 
            id="iaf4mhk9e"
          />
        </div>
      </div>
    </div>
  );
}
