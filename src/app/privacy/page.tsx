import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">Last updated: May 22, 2026</p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">1. Introduction</h2>
            <p>
              Welcome to MortMatch. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy or our practices with regard to your personal information, please contact us.
            </p>
            <p>
              When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services, when participating in activities on the services, or otherwise contacting us.
            </p>
            <p className="font-semibold text-slate-800">The personal information we collect includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Data:</strong> Name, phone number, email address, street address, city, and state.</li>
              <li><strong>Financial Profile Data:</strong> Self-reported credit scores, employment status, down payment savings, property details, and mortgage preferences provided during your chat with Mort.</li>
              <li><strong>Interaction Data:</strong> Conversations, questions asked, and answers provided to our AI assistant.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>To facilitate connection with a licensed mortgage professional:</strong> With your explicit consent, we share your contact and financial profile details with your designated or matched mortgage professional to assist you with home financing.</li>
              <li><strong>To deliver and improve our services:</strong> We use interaction logs to train, monitor, and optimize Mort's responses and overall chat flow.</li>
              <li><strong>To protect our services:</strong> We may use your information as part of our efforts to keep our services safe and secure (for example, for fraud monitoring and prevention).</li>
            </ul>
          </section>

          <section className="space-y-3 border-l-4 border-blue-500 bg-blue-50/50 p-6 rounded-r-2xl">
            <h2 className="text-xl font-bold text-blue-900">4. Sharing Your Information</h2>
            <p className="text-blue-950">
              <strong>Your trust is paramount.</strong> We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
            <p className="text-blue-950 font-semibold mt-2">
              We DO NOT rent, sell, or share your personal information with third-party marketing companies, unsolicited lenders, or list brokers. Your information is strictly shared with the pre-vetted, licensed mortgage professional displayed on your screen to help facilitate your inquiry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">5. Data Security</h2>
            <p>
              We use appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our services is at your own risk. You should only access the services within a secure environment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">6. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have rights under applicable data protection laws. These may include the right to request access and obtain a copy of your personal information, to request rectification or erasure of your data, or to restrict the processing of your personal information. To make such a request, please contact us. We will consider and act upon any request in accordance with applicable data protection laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">7. Updates to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">8. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at <a href="mailto:support@mortmatch.com" className="text-blue-600 hover:underline">support@mortmatch.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer showProLink={false} />
    </div>
  );
}
