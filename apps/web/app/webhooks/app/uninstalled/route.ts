import { NextRequest, NextResponse } from "next/server";

import { markShopUninstalled } from "../../../../lib/persistence";

export async function POST(request: NextRequest) {
  const shop = request.headers.get("x-shopify-shop-domain");
  if (!shop) {
    return NextResponse.json({ error: "Missing shop domain header" }, { status: 400 });
  }

  await markShopUninstalled(shop);
  return NextResponse.json({ ok: true });
}
