"use client";

import { useState } from "react";

function normalizeShopInput(rawShop: string) {
  const cleaned = rawShop
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");

  if (!cleaned) {
    return "";
  }

  if (cleaned.endsWith(".myshopify.com")) {
    return cleaned;
  }

  return `${cleaned}.myshopify.com`;
}

function isValidMyShopifyDomain(shop: string) {
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.myshopify\.com$/.test(shop);
}

const fieldStyle = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  padding: ".9rem 1rem",
  fontSize: "1rem",
  fontFamily: "inherit",
  background: "#fff",
} as const;

export function InstallShopForm() {
  const [shop, setShop] = useState("");

  const normalizedShop = normalizeShopInput(shop);
  const isValid = normalizedShop ? isValidMyShopifyDomain(normalizedShop) : false;
  const authorizeHref = normalizedShop ? `/auth/shopify/start?shop=${encodeURIComponent(normalizedShop)}` : "#";

  return (
    <form
      action={authorizeHref}
      style={{
        display: "grid",
        gap: "1rem",
      }}
    >
      <label style={{ display: "grid", gap: ".45rem", fontWeight: 600, color: "#111827" }}>
        Shopify store domain
        <input
          value={shop}
          onChange={(event) => setShop(event.target.value)}
          placeholder="your-store or your-store.myshopify.com"
          style={fieldStyle}
        />
      </label>

      {normalizedShop ? (
        <p style={{ margin: 0, color: isValid ? "#166534" : "#991b1b" }}>
          {isValid ? `OAuth will start for ${normalizedShop}` : "Enter a valid Shopify subdomain, for example your-store.myshopify.com"}
        </p>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: ".9rem", flexWrap: "wrap" }}>
        <button
          type="submit"
          disabled={!isValid}
          style={{
            border: 0,
            borderRadius: 999,
            padding: ".85rem 1.25rem",
            background: isValid ? "#0f172a" : "#94a3b8",
            color: "#fff",
            fontWeight: 700,
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          Connect Shopify
        </button>
        <span style={{ color: "#4b5563" }}>OAuth will install the app and create the tenant automatically.</span>
      </div>
    </form>
  );
}
