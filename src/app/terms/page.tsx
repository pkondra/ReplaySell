import type { Metadata } from "next";

import { LegalPageShell, LegalSection } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the ReplaySell platform.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      lastUpdated="February 17, 2026"
      summary="These Terms govern use of ReplaySell by sellers and buyers. They define account rules, billing and checkout responsibilities, prohibited behavior, and legal limits. This document is a policy template and not legal advice."
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using ReplaySell, you agree to be bound by these Terms. If you do not
          agree, do not use the platform.
        </p>
        <p>
          If you use ReplaySell on behalf of a business, you represent that you are authorized to
          bind that business to these Terms.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility and Accounts">
        <ul>
          <li>You must provide accurate account information and keep it up to date.</li>
          <li>You are responsible for all actions under your account credentials.</li>
          <li>
            You must promptly notify ReplaySell of suspected account compromise or unauthorized
            access.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Platform Description and Role">
        <p>
          ReplaySell provides tools for replay storefronts, product listings, buyer alerts, and
          checkout orchestration.
        </p>
        <p>
          Buyer purchases are processed on seller connected Stripe accounts. ReplaySell is a
          software platform provider and is not the merchant of record for seller catalog items.
        </p>
      </LegalSection>

      <LegalSection title="4. Seller Subscription Billing">
        <ul>
          <li>Seller plans are billed through Stripe and renew automatically unless canceled.</li>
          <li>Any trial period, if offered, transitions to paid billing unless canceled in time.</li>
          <li>
            Plan prices, features, and billing terms may change with prior notice where required by
            law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Seller Responsibilities">
        <p>Sellers are responsible for all catalog and transaction conduct on their storefront.</p>
        <ul>
          <li>Provide truthful and lawful product descriptions, pricing, and inventory.</li>
          <li>Fulfill orders and customer support obligations in a timely manner.</li>
          <li>Comply with tax, consumer, advertising, and product safety laws.</li>
          <li>Maintain valid Stripe onboarding and payout eligibility information.</li>
          <li>Handle refunds, exchanges, and disputes according to applicable law.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Buyer Responsibilities">
        <ul>
          <li>Use accurate account and payment details.</li>
          <li>Do not attempt fraudulent purchases or charge abuse.</li>
          <li>Respect seller-specific terms, shipping windows, and return policies.</li>
          <li>Do not misuse notifications, messaging, or checkout flows.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Payments, Refunds, and Chargebacks">
        <p>
          Payment processing is provided by Stripe. Sellers are primarily responsible for
          transaction-level customer outcomes, including refunds and order issues.
        </p>
        <ul>
          <li>
            ReplaySell may share transaction metadata with Stripe and other providers as required.
          </li>
          <li>
            Chargebacks, disputes, and payment reversals may affect seller account standing and
            access.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Fees and Taxes">
        <p>
          Sellers are responsible for taxes, duties, and reporting obligations related to their
          sales, unless law requires otherwise.
        </p>
        <p>
          ReplaySell currently configures no platform fee for connected-account purchases in your
          current setup, but reserved rights in these Terms still apply if fee models change later.
        </p>
      </LegalSection>

      <LegalSection title="9. Prohibited Conduct">
        <p>You may not use ReplaySell to:</p>
        <ul>
          <li>Sell illegal, stolen, counterfeit, unsafe, or prohibited goods.</li>
          <li>Commit fraud, impersonation, phishing, or deceptive practices.</li>
          <li>Interfere with platform reliability, security, or availability.</li>
          <li>Reverse engineer or scrape data beyond permitted usage.</li>
          <li>Violate intellectual property, privacy, or contractual rights.</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Intellectual Property and Content Rights">
        <p>
          ReplaySell owns the platform software, branding, and service design. Sellers retain
          ownership of their content but grant ReplaySell a limited license to host, display, and
          process that content to provide the service.
        </p>
      </LegalSection>

      <LegalSection title="11. Suspension and Termination">
        <p>
          ReplaySell may suspend or terminate accounts for violations, fraud risk, legal risk,
          non-payment, or abuse. You may stop using ReplaySell at any time.
        </p>
      </LegalSection>

      <LegalSection title="12. Disclaimers">
        <p>
          ReplaySell is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the extent permitted by
          law, ReplaySell disclaims warranties of merchantability, fitness for a particular purpose,
          and non-infringement.
        </p>
      </LegalSection>

      <LegalSection title="13. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, ReplaySell is not liable for indirect, incidental,
          special, consequential, exemplary, or punitive damages, or for loss of profits, revenue,
          data, or goodwill.
        </p>
      </LegalSection>

      <LegalSection title="14. Indemnification">
        <p>
          You agree to indemnify and hold ReplaySell harmless from claims, liabilities, losses, and
          costs arising from your content, sales, legal violations, or misuse of the platform.
        </p>
      </LegalSection>

      <LegalSection title="15. Governing Law and Disputes">
        <p>
          These Terms are governed by applicable law in the jurisdiction where ReplaySell operates,
          unless mandatory law in your jurisdiction requires otherwise.
        </p>
        <p>
          Before filing a legal claim, both parties agree to attempt good-faith informal resolution
          by contacting support@replaysell.com.
        </p>
      </LegalSection>

      <LegalSection title="16. Changes to Terms">
        <p>
          We may update these Terms periodically. Updated Terms become effective when posted, unless
          a later date is specified.
        </p>
      </LegalSection>

      <LegalSection title="17. Contact">
        <p>Questions about these Terms can be sent to:</p>
        <ul>
          <li>Email: support@replaysell.com</li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
}
