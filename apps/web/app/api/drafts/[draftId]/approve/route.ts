import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@blog-saas/db";
import { ApproveDraftRequestSchema } from "@blog-saas/domain";

import { enqueueTenantJob } from "../../../../../lib/queue";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const payload = ApproveDraftRequestSchema.parse(await request.json());
  const { draftId } = await params;

  await prisma.draft.update({
    where: { id: draftId },
    data: {
      status: "scheduled",
      approvedBy: payload.reviewedBy,
      approvedAt: new Date(),
    },
  });

  const queued = await enqueueTenantJob("publish_shopify", {
    tenantId: payload.tenantId,
    draftId,
    templateVersion: 1,
    attempt: 1,
  });

  return NextResponse.json({ ok: true, draftId, queued }, { status: 202 });
}
