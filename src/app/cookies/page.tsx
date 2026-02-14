import { ArrowLeft, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How ReplaySell uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b-[3px] border-line bg-panel">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_3px_0_#000]">
              <Package size={16} />
            </div>
            <p className="font-heading text-xl font-black leading-none sm:text-2xl">ReplaySell</p>
          </Link>
          <Link
            href="/"
            className="brutal-btn-secondary inline-flex h-10 items-center gap-2 px-4 font-dashboard text-xs"
          >
            <ArrowLeft size={13} />
            Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <article className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10">
          <p className="font-dashboard text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
            Legal
          </p>
          <h1 className="mt-2 font-heading text-4xl font-black tracking-tight sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm font-semibold text-text-muted">
            Last updated: June 14, 2025
          </p>
        </div>

        <div className="legal-content space-y-8">
          <Section title="1. What Are Cookies?">
            <p>
              Cookies are small text files placed on your device when you visit a website. They help
              the website remember your preferences, keep you signed in, and understand how you use
              the site.
            </p>
          </Section>

          <Section title="2. How We Use Cookies">
            <p>ReplaySell uses cookies for the following purposes:</p>

            <h4>Essential Cookies</h4>
            <p>
              These cookies are required for the platform to function. They handle authentication
              sessions, security tokens, and basic platform functionality. You cannot opt out of
              essential cookies.
            </p>

            <h4>Authentication Cookies</h4>
            <p>
              We use Clerk for authentication, which sets cookies to maintain your login session
              and manage secure access to your account.
            </p>

            <h4>Functional Cookies</h4>
            <p>
              These cookies remember your preferences, such as notification settings and UI
              preferences, to provide a better experience.
            </p>
          </Section>

          <Section title="3. Third-Party Cookies">
            <p>
              Some cookies are set by third-party services we use:
            </p>
            <ul>
              <li><strong>Clerk</strong> — Authentication session management</li>
              <li><strong>Stripe</strong> — Fraud prevention and payment security during checkout</li>
              <li><strong>Vercel</strong> — Performance analytics and deployment optimization</li>
            </ul>
            <p>
              These services set their own cookies according to their respective cookie policies.
            </p>
          </Section>

          <Section title="4. Cookie Duration">
            <p>We use two types of cookies based on duration:</p>
            <ul>
              <li>
                <strong>Session cookies</strong> — Temporary cookies that are deleted when you close
                your browser. Used for authentication and security.
              </li>
              <li>
                <strong>Persistent cookies</strong> — Cookies that remain on your device for a set
                period. Used for remembering your preferences and login state.
              </li>
            </ul>
          </Section>

          <Section title="5. Managing Cookies">
            <p>
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul>
              <li>View what cookies are stored on your device</li>
              <li>Delete individual or all cookies</li>
              <li>Block cookies from specific or all websites</li>
              <li>Set preferences for first-party vs. third-party cookies</li>
            </ul>
            <p>
              Please note that disabling essential cookies may prevent you from using core platform
              features like signing in or making purchases.
            </p>
          </Section>

          <Section title="6. Updates to This Policy">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or applicable regulations. The &quot;Last updated&quot; date at the top indicates when
              the policy was last revised.
            </p>
          </Section>

          <Section title="7. Contact Us">
            <p>
              If you have questions about our use of cookies, please contact us:
            </p>
            <ul>
              <li>Email: support@replaysell.com</li>
            </ul>
          </Section>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border-[3px] border-line bg-white p-6 shadow-[0_4px_0_#000] sm:p-8">
      <h2 className="mb-4 font-heading text-2xl font-black tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm font-semibold leading-relaxed text-text-muted [&_h4]:mt-4 [&_h4]:font-heading [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-text [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-text [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
