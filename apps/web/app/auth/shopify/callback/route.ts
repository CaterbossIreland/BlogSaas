import { NextRequest, NextResponse } from "next/server";

import {
  exchangeShopifyOfflineToken,
  isValidShopifyShopDomain,
  normalizeShopifyShopDomain,
  SHOPIFY_OAUTH_STATE_COOKIE,
  verifyShopifyHmac,
} from "../../../../lib/shopify";
import { upsertInstalledShop } from "../../../../lib/persistence";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawShop = params.get("shop");
  const code = params.get("code");
  const state = params.get("state");
  const expectedState = request.cookies.get(SHOPIFY_OAUTH_STATE_COOKIE)?.value;

  if (!rawShop || !code) {
    return NextResponse.json({ error: "Missing shop or code" }, { status: 400 });
  }

  const shop = normalizeShopifyShopDomain(rawShop);
  if (!isValidShopifyShopDomain(shop)) {
    return NextResponse.json({ error: "Invalid Shopify shop domain" }, { status: 400 });
  }

  if (!verifyShopifyHmac(params)) {
    return NextResponse.json({ error: "Invalid Shopify HMAC" }, { status: 401 });
  }

  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.json({ error: "Invalid Shopify OAuth state" }, { status: 401 });
  }

  const tokenResponse = await exchangeShopifyOfflineToken(shop, code);
  const tenant = await upsertInstalledShop({
    shopDomain: shop,
    accessTokenEncrypted: tokenResponse.access_token,
    scope: tokenResponse.scope,
  });

  const redirectUrl = new URL(`/onboarding?tenant=${tenant.slug}`, request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: SHOPIFY_OAUTH_STATE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 0,
  });
  return response;
}
