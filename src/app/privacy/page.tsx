import type { Metadata } from "next";

import { LegalPageShell, LegalSection } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ReplaySell collects, uses, and protects personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      lastUpdated="February 17, 2026"
      summary="This policy explains what personal data ReplaySell collects, why we process it, when we share it, and what rights you can exercise. This document is a product policy summary and not legal advice."
    >
      <LegalSection title="1. Scope and Roles">
        <p>
          This Privacy Policy applies to ReplaySell products, websites, checkout flows, and account
          dashboards that link to this policy.
        </p>
        <p>
          ReplaySell generally acts as a data controller for platform account data and product usage
          data. Sellers using ReplaySell may act as independent controllers for their storefront and
          customer communications.
        </p>
      </LegalSection>

      <LegalSection title="2. Data We Collect">
        <h4>Account Data</h4>
        <p>
          Name, email address, hashed password, login/session metadata, and account timestamps.
        </p>
        <h4>Commerce Data</h4>
        <p>
          Replay information, product details, order records, connected account IDs, subscription
          status, and billing identifiers.
        </p>
        <h4>Communication Data</h4>
        <p>
          Email and optional phone details used for timer reminders, stock alerts, and price-change
          notifications.
        </p>
        <h4>Technical Data</h4>
        <p>
          Device/browser metadata, IP-derived telemetry, logs, and security signals used to protect
          the service.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Collect Data">
        <ul>
          <li>Directly from you during signup, checkout, onboarding, and support requests.</li>
          <li>Automatically through cookies, logs, and security monitoring.</li>
          <li>From service providers that process payments, auth, hosting, and email delivery.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Why We Process Data">
        <ul>
          <li>Provide account access, storefront features, and replay commerce workflows.</li>
          <li>Process payments and subscription billing through Stripe.</li>
          <li>Send platform notifications and transactional communications.</li>
          <li>Prevent abuse, fraud, unauthorized access, and policy violations.</li>
          <li>Comply with legal, tax, accounting, and regulatory obligations.</li>
          <li>Improve product reliability and performance.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Legal Bases (Where Applicable)">
        <ul>
          <li>
            <strong>Contract</strong> — to provide the services you request.
          </li>
          <li>
            <strong>Legitimate interests</strong> — to secure and improve the platform.
          </li>
          <li>
            <strong>Legal obligation</strong> — to comply with applicable law.
          </li>
          <li>
            <strong>Consent</strong> — where required for optional cookies or communications.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Payments and Stripe Connect">
        <p>
          ReplaySell uses Stripe for platform subscription billing and Stripe Connect for seller
          onboarding and direct checkout on connected accounts.
        </p>
        <ul>
          <li>ReplaySell does not store full card numbers on its own servers.</li>
          <li>
            Buyer payment data is processed by Stripe under Stripe terms and privacy notices.
          </li>
          <li>
            Seller connected account compliance status may be synced to ReplaySell for operational
            purposes.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Sharing and Recipients">
        <p>We share data only as needed to operate the platform and meet legal obligations.</p>
        <ul>
          <li>
            <strong>Auth.js</strong> for authentication and session management.
          </li>
          <li>
            <strong>Stripe</strong> for payment processing, subscriptions, and Connect onboarding.
          </li>
          <li>
            <strong>Convex</strong> for backend database and API workflows.
          </li>
          <li>
            <strong>Resend</strong> for transactional notification delivery.
          </li>
          <li>
            <strong>Vercel</strong> for hosting, deployment, and runtime operations.
          </li>
          <li>Advisors, law enforcement, or regulators when legally required.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. International Transfers">
        <p>
          ReplaySell and its providers may process data in multiple countries. When required, we use
          appropriate safeguards for cross-border transfers.
        </p>
      </LegalSection>

      <LegalSection title="9. Retention">
        <p>
          We retain data for as long as needed to provide services, maintain records, resolve
          disputes, and satisfy legal obligations.
        </p>
        <ul>
          <li>Account records: retained while account is active and for compliance afterward.</li>
          <li>Transaction records: retained for tax, accounting, and fraud-prevention purposes.</li>
          <li>Support and security logs: retained according to operational security needs.</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Security">
        <p>
          We use administrative, technical, and physical safeguards, including encrypted transport,
          access controls, and monitoring. No internet system is completely risk free.
        </p>
      </LegalSection>

      <LegalSection title="11. Your Rights">
        <p>Depending on your location, you may have rights to:</p>
        <ul>
          <li>Access, correct, or delete personal data.</li>
          <li>Request a portable copy of eligible data.</li>
          <li>Object to or restrict certain processing.</li>
          <li>Withdraw consent for optional processing.</li>
          <li>Appeal a rights decision where local law permits.</li>
        </ul>
        <p>To exercise rights, contact support@replaysell.com.</p>
      </LegalSection>

      <LegalSection title="12. Children">
        <p>
          ReplaySell is not intended for children under 16, and we do not knowingly collect data
          from children under 16.
        </p>
      </LegalSection>

      <LegalSection title="13. Cookies and Tracking">
        <p>
          We use essential cookies for security and login functionality, and optional cookies only
          based on your consent preferences. See our Cookie Policy for details.
        </p>
      </LegalSection>

      <LegalSection title="14. Policy Updates">
        <p>
          We may update this policy from time to time. Material updates will be posted here with a
          revised date.
        </p>
      </LegalSection>

      <LegalSection title="15. Contact">
        <p>Questions or requests about privacy can be sent to:</p>
        <ul>
          <li>Email: support@replaysell.com</li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
}
