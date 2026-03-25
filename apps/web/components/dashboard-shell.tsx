import Link from "next/link";
import type { PropsWithChildren } from "react";

const links = [
  ["Brand Profile", "/merchant/brand-profile"],
  ["Content Settings", "/merchant/content-settings"],
  ["Topic Backlog", "/merchant/topic-backlog"],
  ["Drafts", "/merchant/drafts"],
  ["Approval Queue", "/merchant/approval-queue"],
  ["Publish Calendar", "/merchant/publish-calendar"],
  ["Usage", "/merchant/usage"],
  ["Billing", "/merchant/billing"],
  ["Google Docs", "/merchant/google-docs"],
] as const;

export function DashboardShell({ children }: PropsWithChildren) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #e5e7eb", padding: "2rem 1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Blog SaaS</h1>
        <p style={{ color: "#4b5563", lineHeight: 1.5 }}>
          Agency-first content operations for multi-tenant Shopify blog automation.
        </p>
        <nav style={{ display: "grid", gap: ".75rem", marginTop: "1.5rem" }}>
          {links.map(([label, href]) => (
            <Link key={href} href={href} style={{ color: "#111827", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}
