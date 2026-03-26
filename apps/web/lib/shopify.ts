import crypto from "node:crypto";

import { getShopifyApiKey, getShopifyApiSecret, getShopifyAppUrl, webEnv } from "./env";

export const SHOPIFY_OAUTH_STATE_COOKIE = "blog_saas_shopify_oauth_state";

export function normalizeShopifyShopDomain(rawShop: string) {
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

export function isValidShopifyShopDomain(shop: string) {
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.myshopify\.com$/.test(shop);
}

export function createShopifyOauthState() {
  return crypto.randomUUID();
}

export function buildShopifyAuthorizeUrl(shop: string, state = createShopifyOauthState()) {
  const url = new URL(`https://${shop}/admin/oauth/authorize`);
  url.searchParams.set("client_id", getShopifyApiKey());
  url.searchParams.set("scope", webEnv.shopifyScopes);
  url.searchParams.set("redirect_uri", `${getShopifyAppUrl()}/auth/shopify/callback`);
  url.searchParams.set("state", state);
  return url.toString();
}

export function verifyShopifyHmac(input: URLSearchParams) {
  const hmac = input.get("hmac");
  if (!hmac) {
    return false;
  }

  const message = Array.from(input.entries())
    .filter(([key]) => key !== "hmac")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const digest = crypto
    .createHmac("sha256", getShopifyApiSecret())
    .update(message)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(hmac, "utf8"), Buffer.from(digest, "utf8"));
}

export async function exchangeShopifyOfflineToken(shop: string, code: string) {
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: getShopifyApiKey(),
      client_secret: getShopifyApiSecret(),
      code,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange Shopify token: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as {
    access_token: string;
    scope: string;
  };
}
