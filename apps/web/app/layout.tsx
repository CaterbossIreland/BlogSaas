import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Blog SaaS",
  description: "Agency-first multi-tenant Shopify blog automation platform",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#f8fafc",
          color: "#111827",
        }}
      >
        {children}
      </body>
    </html>
  );
}
