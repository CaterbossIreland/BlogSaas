import { NextRequest, NextResponse } from "next/server";

import {
  buildShopifyAuthorizeUrl,
  createShopifyOauthState,
  isValidShopifyShopDomain,
  normalizeShopifyShopDomain,
  SHOPIFY_OAUTH_STATE_COOKIE,
} from "../../../../lib/shopify";

export async function GET(request: NextRequest) {
  const rawShop = request.nextUrl.searchParams.get("shop");
  if (!rawShop) {
    return NextResponse.json({ error: "Missing shop query parameter" }, { status: 400 });
  }

  const shop = normalizeShopifyShopDomain(rawShop);
  if (!isValidShopifyShopDomain(shop)) {
    return NextResponse.json({ error: "Shop must be a valid *.myshopify.com domain" }, { status: 400 });
  }

  const state = createShopifyOauthState();
  const response = NextResponse.redirect(buildShopifyAuthorizeUrl(shop, state));
  response.cookies.set({
    name: SHOPIFY_OAUTH_STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
