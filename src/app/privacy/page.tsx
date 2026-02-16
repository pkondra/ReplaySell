import { ArrowLeft, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ReplaySell collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm font-semibold text-text-muted">
            Last updated: June 14, 2025
          </p>
        </div>

        <div className="legal-content space-y-8">
          <Section title="1. Introduction">
            <p>
              ReplaySell (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the replaysell.com website and
              platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our service.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information in the following ways:</p>
            <h4>Account Information</h4>
            <p>
              When you create an account (as a seller or buyer), we collect your name, email address,
              and authentication credentials through our authentication stack (Auth.js).
            </p>
            <h4>Transaction Data</h4>
            <p>
              When you make a purchase or subscribe to a seller plan, we process payment information
              through Stripe. We do not store your full credit card number on our servers.
            </p>
            <h4>Usage Data</h4>
            <p>
              We automatically collect information about how you interact with our platform, including
              pages visited, features used, replay pages viewed, and alert preferences.
            </p>
            <h4>Communication Data</h4>
            <p>
              If you subscribe to alerts for a replay page, we collect your email address and
              optionally your phone number to deliver notifications.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>To provide and maintain our platform</li>
              <li>To process transactions and send related information</li>
              <li>To send you timer reminders, stock alerts, and price change notifications you&apos;ve opted into</li>
              <li>To manage your account and provide customer support</li>
              <li>To improve and personalize your experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We use the following third-party services that may process your data:</p>
            <ul>
              <li><strong>Auth.js</strong> — Authentication and session management</li>
              <li><strong>Stripe</strong> — Payment processing (seller subscriptions and buyer checkout via Stripe Connect)</li>
              <li><strong>Convex</strong> — Real-time database and backend infrastructure</li>
              <li><strong>Resend</strong> — Transactional email delivery for alerts and notifications</li>
              <li><strong>Vercel</strong> — Hosting and deployment</li>
            </ul>
            <p>
              Each of these services has their own privacy policy and data handling practices. We
              encourage you to review their respective policies.
            </p>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain your personal information for as long as your account is active or as needed
              to provide you services. You can request deletion of your account and associated data by
              contacting us at support@replaysell.com.
            </p>
          </Section>

          <Section title="6. Data Security">
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              data. All data is transmitted over HTTPS, and we use industry-standard encryption for
              data at rest. However, no method of transmission over the Internet is 100% secure.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
              <li>Data portability</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at support@replaysell.com.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our service is not intended for individuals under the age of 16. We do not knowingly
              collect personal information from children. If we become aware that we have collected
              data from a child, we will take steps to delete it.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have questions about this Privacy Policy, please contact us:
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
