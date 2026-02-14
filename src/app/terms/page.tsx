import { ArrowLeft, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the ReplaySell platform.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-3 text-sm font-semibold text-text-muted">
            Last updated: June 14, 2025
          </p>
        </div>

        <div className="legal-content space-y-8">
          <Section title="1. Agreement to Terms">
            <p>
              By accessing or using ReplaySell (&quot;the Service&quot;), you agree to be bound by these Terms of
              Service. If you do not agree to these terms, do not use the Service.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              ReplaySell is a platform that enables sellers to create shoppable replay storefronts from
              live shopping events. The platform facilitates:
            </p>
            <ul>
              <li>Creation and management of replay storefronts with countdown timers</li>
              <li>Product listing and inventory management</li>
              <li>Buyer account creation, order placement, and purchase history</li>
              <li>Email and SMS alert subscriptions for buyers</li>
              <li>Payment processing through Stripe</li>
            </ul>
          </Section>

          <Section title="3. User Accounts">
            <h4>Seller Accounts</h4>
            <p>
              Sellers must create an account and subscribe to a monthly plan to access platform features.
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activity that occurs under your account.
            </p>
            <h4>Buyer Accounts</h4>
            <p>
              Buyers are required to create an account before making purchases. This allows order
              tracking, purchase history, and notification preference management.
            </p>
          </Section>

          <Section title="4. Payments and Billing">
            <h4>Seller Subscriptions</h4>
            <p>
              Seller plans are billed monthly at the stated rate via Stripe Billing. Subscriptions
              automatically renew unless cancelled. You may cancel at any time through your account
              settings.
            </p>
            <h4>Buyer Transactions</h4>
            <p>
              Buyer purchases are processed through Stripe Connect Express. Payments are directed to
              the seller&apos;s connected Stripe account. ReplaySell facilitates the transaction but is
              not the merchant of record.
            </p>
            <h4>Refunds</h4>
            <p>
              Refund policies are set by individual sellers. Disputes should be directed to the
              seller first. If unresolved, you may contact us at support@replaysell.com.
            </p>
          </Section>

          <Section title="5. Seller Obligations">
            <p>As a seller on ReplaySell, you agree to:</p>
            <ul>
              <li>Provide accurate product descriptions, pricing, and stock information</li>
              <li>Fulfill orders promptly and in good faith</li>
              <li>Comply with all applicable consumer protection and e-commerce laws</li>
              <li>Not list prohibited, illegal, or fraudulent products</li>
              <li>Maintain accurate business and tax information</li>
            </ul>
          </Section>

          <Section title="6. Buyer Obligations">
            <p>As a buyer on ReplaySell, you agree to:</p>
            <ul>
              <li>Provide accurate personal and payment information</li>
              <li>Not engage in fraudulent transactions</li>
              <li>Respect the terms set by individual sellers</li>
              <li>Not abuse the alert or notification system</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              The ReplaySell platform, including its design, code, and branding, is the intellectual
              property of ReplaySell. Sellers retain ownership of their product content, images, and
              replay media.
            </p>
          </Section>

          <Section title="8. Prohibited Activities">
            <p>You may not use the Service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Sell counterfeit, stolen, or illegal goods</li>
              <li>Engage in fraud, phishing, or other deceptive practices</li>
              <li>Interfere with or disrupt the Service&apos;s infrastructure</li>
              <li>Scrape, crawl, or otherwise extract data without permission</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              ReplaySell is provided &quot;as is&quot; without warranties of any kind. To the maximum extent
              permitted by law, ReplaySell shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of the Service.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of
              these terms, fraudulent activity, or any other reason we deem appropriate. You may
              terminate your account at any time by contacting support@replaysell.com.
            </p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>
              We may update these Terms of Service from time to time. We will notify registered users
              of material changes via email. Continued use of the Service after changes constitutes
              acceptance of the updated terms.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For questions about these Terms of Service, contact us:
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
