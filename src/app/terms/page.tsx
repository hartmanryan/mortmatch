import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100/50 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="relative w-[280px] h-14">
                <Image src="/mortlogo.png" alt="MortMatch" fill className="object-contain object-left" />
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About Mort</Link>
            <Link href="/" className="hover:text-blue-600 transition-colors">Chat With Mort</Link>
          </nav>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12 md:py-16 flex flex-col items-center flex-1 max-w-4xl">
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm">Last updated: May 22, 2026</p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">1. Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and MortMatch, concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
            </p>
            <p>
              By accessing the website and using Mort's interactive chat or other services, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using the site and must discontinue use immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">2. Description of Services</h2>
            <p>
              MortMatch provides an AI-guided assistant ("Mort") to help users analyze their mortgage eligibility, explore financial scenarios, and optionally connect with licensed third-party mortgage professionals who can assist them in applying for home loans.
            </p>
            <p className="font-semibold text-slate-800">Please note:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Not a Lender:</strong> MortMatch is not a mortgage lender, broker, or financial institution. We do not originate, broker, underwrite, or fund residential mortgage loans.</li>
              <li><strong>No Financial Advice:</strong> The information and scenarios provided by Mort are for informational and educational purposes only and do not constitute formal financial, investment, or legal advice.</li>
              <li><strong>No State Authority:</strong> MortMatch is not authorized by the New York State Department of Financial Services. No mortgage solicitation activity or loan applications for properties located in the State of New York can be facilitated through this site.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">3. User Representations</h2>
            <p>
              By using our services, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All information you submit (including contact information and financial profile data) is true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update it as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
              <li>You are not a minor in the jurisdiction in which you reside.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">4. Prohibited Activities</h2>
            <p>
              You may not access or use the site for any purpose other than that for which we make the site available. Prohibited activities include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Systematically retrieving data or other content from the site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
              <li>Tricking, defrauding, or misleading us or other users, especially in any attempt to learn sensitive information.</li>
              <li>Circumventing, disabling, or otherwise interfering with security-related features of the website.</li>
              <li>Using the service to transmit spam, unsolicited SMS communications, or false inquiries.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">5. Limitation of Liability</h2>
            <p>
              In no event will MortMatch, or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site or any connection made with third-party mortgage professionals, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">6. Third-Party Links & Connections</h2>
            <p>
              Our service connects you with licensed independent mortgage professionals. We do not guarantee or warrant the terms, rates, approval, or service quality provided by any matched mortgage professional. Any agreement or interaction between you and a mortgage professional is solely between you and that third party.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">7. Governing Law</h2>
            <p>
              These Terms of Service and your use of the website are governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">8. Contact Us</h2>
            <p>
              In order to resolve a complaint regarding the site or to receive further information regarding use of the site, please contact us at <a href="mailto:support@mortmatch.com" className="text-blue-600 hover:underline">support@mortmatch.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer showProLink={false} />
    </div>
  );
}
