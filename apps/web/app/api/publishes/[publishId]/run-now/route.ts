import { NextRequest, NextResponse } from "next/server";

import { RunPublishRequestSchema } from "@blog-saas/domain";

import { enqueueTenantJob } from "../../../../../lib/queue";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ publishId: string }> },
) {
  const payload = RunPublishRequestSchema.parse(await request.json());
  const { publishId } = await params;

  const queued = await enqueueTenantJob("publish_shopify", {
    tenantId: payload.tenantId,
    draftId: publishId,
    templateVersion: 1,
    attempt: 1,
  });

  return NextResponse.json({ ok: true, publishId, requestedBy: payload.requestedBy, queued });
}
