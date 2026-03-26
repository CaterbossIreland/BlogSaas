"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";

import type { ConnectedTenantSummary } from "../lib/merchant-console";

const links = [
  ["Overview", "/merchant"],
  ["Brand Profile", "/merchant/brand-profile"],
  ["Content Settings", "/merchant/content-settings"],
  ["Topic Backlog", "/merchant/topic-backlog"],
  ["Drafts", "/merchant/drafts"],
  ["Approval Queue", "/merchant/approval-queue"],
  ["Publish Calendar", "/merchant/publish-calendar"],
  ["Usage", "/merchant/usage"],
  ["Billing", "/merchant/billing"],
  ["Google Docs", "/merchant/google-docs"],
  ["Admin", "/admin"],
  ["Install Store", "/install"],
] as const;

type DashboardShellProps = PropsWithChildren<{
  tenants: ConnectedTenantSummary[];
}>;

export function DashboardShell({ children, tenants }: DashboardShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const activeTenant = tenants.find((item) => item.slug === tenant) ?? null;

  const withTenant = (href: string) => {
    if (!tenant || !href.startsWith("/merchant")) {
      return href;
    }

    const separator = href.includes("?") ? "&" : "?";
    return `${href}${separator}tenant=${encodeURIComponent(tenant)}`;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f8fb 0%, #eef4ff 100%)",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #e5e7eb",
          padding: "2rem 1.25rem",
          background: "#0f172a",
          color: "#f8fafc",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: ".78rem",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "#93c5fd",
          }}
        >
          Merchant Console
        </p>
        <h1 style={{ margin: ".4rem 0 0", fontSize: "1.5rem" }}>Blog SaaS</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
          Agency-first content operations for multi-tenant Shopify blog automation.
        </p>
        <div
          style={{
            marginTop: "1rem",
            padding: ".9rem",
            borderRadius: 16,
            background: "rgba(148, 163, 184, 0.12)",
            display: "grid",
            gap: ".65rem",
          }}
        >
          <div style={{ display: "grid", gap: ".2rem" }}>
            <span style={{ fontSize: ".76rem", textTransform: "uppercase", letterSpacing: ".08em", color: "#93c5fd" }}>
              Active tenant
            </span>
            <strong>{activeTenant?.name ?? "Demo preview"}</strong>
            <span style={{ color: "#cbd5e1", fontSize: ".92rem" }}>
              {activeTenant?.shopDomain ?? "Install a Shopify store to manage a live tenant."}
            </span>
          </div>
          <label style={{ display: "grid", gap: ".35rem", color: "#e2e8f0", fontSize: ".92rem" }}>
            Switch store
            <select
              value={activeTenant?.slug ?? ""}
              onChange={(event) => {
                const nextSlug = event.target.value;
                if (!nextSlug) {
                  router.push("/merchant");
                  return;
                }
                router.push(`/merchant?tenant=${encodeURIComponent(nextSlug)}`);
              }}
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid rgba(148, 163, 184, 0.3)",
                padding: ".75rem .85rem",
                fontSize: ".95rem",
                fontFamily: "inherit",
                background: "#0b1220",
                color: "#f8fafc",
              }}
            >
              <option value="">Demo / no tenant selected</option>
              {tenants.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name} ({item.shopDomain})
                </option>
              ))}
            </select>
          </label>
        </div>
        <nav style={{ display: "grid", gap: ".35rem", marginTop: "1.75rem" }}>
          {links.map(([label, href]) => (
            <Link
              key={`${href}-${tenant ?? "default"}`}
              href={withTenant(href)}
              style={{
                color: "#e2e8f0",
                textDecoration: "none",
                padding: ".65rem .8rem",
                borderRadius: 12,
                background: "rgba(148, 163, 184, 0.08)",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ padding: "2rem 2.25rem" }}>{children}</main>
    </div>
  );
}
