import Link from "next/link";

type FooterProps = {
  lender?: {
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    companyAddress: string | null;
    nmls: string | null;
    phone: string | null;
  } | null;
  showProLink?: boolean;
};

export default function Footer({ lender, showProLink = true }: FooterProps) {
  return (
    <footer className="relative border-t border-slate-200 bg-white/50 py-8 mt-auto z-10 w-full">
      <div className="container mx-auto px-4 text-center text-xs text-slate-500 space-y-3">
        {lender && (
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Provided by {lender.firstName} {lender.lastName}</p>
            {lender.companyName && <p>{lender.companyName}</p>}
            {lender.companyAddress && <p>{lender.companyAddress}</p>}
            {lender.nmls && <p>NMLS #{lender.nmls}</p>}
            {lender.phone && <p>Phone: {lender.phone}</p>}
            <p className="pt-2 text-slate-400 max-w-2xl mx-auto">
              This site is not authorized by the New York State Department of Financial Services. No mortgage solicitation activity or loan applications for properties located in the State of New York can be facilitated through this site.
            </p>
          </div>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 pt-4 text-slate-400">
          <span>© {new Date().getFullYear()} MortMatch. All rights reserved.</span>
          <span>•</span>
          <Link href="/privacy" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
            Terms of Service
          </Link>
          {showProLink && (
            <>
              <span>•</span>
              <Link href="/pro" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
                Mortgage Pro? Click Here
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
