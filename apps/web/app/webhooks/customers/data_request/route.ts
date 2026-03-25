import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: true, action: "customer_data_request_received" });
}
