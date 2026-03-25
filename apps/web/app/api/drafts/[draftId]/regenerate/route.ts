import { NextRequest, NextResponse } from "next/server";

import { RegenerateDraftRequestSchema } from "@blog-saas/domain";

import { enqueueTenantJob } from "../../../../../lib/queue";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const payload = RegenerateDraftRequestSchema.parse(await request.json());
  const { draftId } = await params;

  const queued = await enqueueTenantJob("draft_generate", {
    tenantId: payload.tenantId,
    draftId,
    templateVersion: 1,
    attempt: 1,
  });

  return NextResponse.json(
    {
      ok: true,
      draftId,
      stage: payload.stage,
      reason: payload.reason,
      queued,
    },
    { status: 202 },
  );
}
