import "server-only";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "noreply@hello.ringreceptionist.com";

export async function sendReplayAlertEmail({
  to,
  subject,
  heading,
  body,
  ctaUrl,
  ctaLabel,
}: {
  to: string;
  subject: string;
  heading: string;
  body: string;
  ctaUrl?: string;
  ctaLabel?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const html = `
    <div style="font-family:Manrope,Arial,sans-serif;background:#FCFAF7;padding:24px;color:#1A1A1A;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border:3px solid #1A1A1A;border-radius:16px;box-shadow:0 6px 0 #000;padding:20px;">
        <h1 style="font-family:Outfit,Arial,sans-serif;font-size:28px;line-height:1.1;margin:0 0 12px;">${heading}</h1>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${body}</p>
        ${ctaUrl && ctaLabel
          ? `<a href="${ctaUrl}" style="display:inline-block;padding:12px 18px;border:3px solid #1A1A1A;border-radius:12px;background:#FF9ECD;color:#1A1A1A;text-decoration:none;font-weight:700;box-shadow:0 4px 0 #000;">${ctaLabel}</a>`
          : ""
        }
      </div>
    </div>
  `;

  return await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to,
    subject,
    html,
  });
}
