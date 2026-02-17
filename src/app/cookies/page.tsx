import type { Metadata } from "next";

import { LegalPageShell, LegalSection } from "@/components/legal/legal-page-shell";
import {
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_OPTIONAL_FEATURES_COOKIE_NAME,
} from "@/lib/cookies/consent";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How ReplaySell uses cookies and how you can manage preferences.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      lastUpdated="February 17, 2026"
      summary="This Cookie Policy describes the cookies and similar technologies used by ReplaySell, including what is essential, what is optional, and how your first-visit consent choices are applied."
    >
      <LegalSection title="1. What Cookies Are">
        <p>
          Cookies are small text files stored in your browser. They help keep you signed in,
          maintain security controls, remember settings, and understand service performance.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookie Categories We Use">
        <h4>Strictly Essential</h4>
        <p>
          Required for login sessions, checkout flows, fraud prevention, and core service operation.
          These cookies cannot be disabled through the consent banner.
        </p>
        <h4>Optional/Preference Cookies</h4>
        <p>
          Used only when you choose &quot;Accept all&quot;. They support optional experience and future
          optimization features.
        </p>
      </LegalSection>

      <LegalSection title="3. First-Visit Cookie Consent">
        <p>When you first visit ReplaySell, you are asked to choose:</p>
        <ul>
          <li>
            <strong>Essential only</strong> — only required cookies are used.
          </li>
          <li>
            <strong>Accept all</strong> — required cookies plus optional cookies are enabled.
          </li>
        </ul>
        <p>
          Your selection is saved and reused on later visits unless you clear browser storage or
          cookies.
        </p>
      </LegalSection>

      <LegalSection title="4. First-Party Cookies Currently Used">
        <ul>
          <li>
            <strong>{COOKIE_CONSENT_COOKIE_NAME}</strong> — stores your cookie consent choice.
          </li>
          <li>
            <strong>{COOKIE_OPTIONAL_FEATURES_COOKIE_NAME}</strong> — indicates whether optional
            cookies are enabled.
          </li>
          <li>
            <strong>Auth.js security/session cookies</strong> — used for authentication and CSRF
            protection (cookie names may vary by environment).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Third-Party Cookies and Technologies">
        <ul>
          <li>
            <strong>Stripe</strong> may set cookies related to payment and fraud detection during
            checkout.
          </li>
          <li>
            <strong>Auth.js / hosting stack</strong> may set service cookies needed for secure
            session behavior.
          </li>
        </ul>
        <p>
          Third-party cookie behavior is governed by the third party&apos;s own policies and controls.
        </p>
      </LegalSection>

      <LegalSection title="6. How to Manage Cookies">
        <ul>
          <li>Use the ReplaySell consent banner when first prompted.</li>
          <li>Delete browser cookies to reset your consent prompt.</li>
          <li>Manage cookie blocking and deletion in browser settings.</li>
          <li>Use private/incognito mode to reduce persistence across sessions.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Do Not Track">
        <p>
          Browser &quot;Do Not Track&quot; signals are not currently interpreted as a separate consent
          framework in this product.
        </p>
      </LegalSection>

      <LegalSection title="8. Policy Updates">
        <p>
          We may update this Cookie Policy from time to time. Any updates are published here with a
          revised date.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>Questions about cookie usage can be sent to:</p>
        <ul>
          <li>Email: support@replaysell.com</li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
}
