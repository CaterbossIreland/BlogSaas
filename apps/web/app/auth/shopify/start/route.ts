import { NextRequest, NextResponse } from "next/server";

import { buildShopifyAuthorizeUrl } from "../../../../lib/shopify";

export async function GET(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get("shop");
  if (!shop) {
    return NextResponse.json({ error: "Missing shop query parameter" }, { status: 400 });
  }

  return NextResponse.redirect(buildShopifyAuthorizeUrl(shop));
}
