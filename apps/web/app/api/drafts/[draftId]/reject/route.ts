import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@blog-saas/db";
import { RejectDraftRequestSchema } from "@blog-saas/domain";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const payload = RejectDraftRequestSchema.parse(await request.json());
  const { draftId } = await params;

  await prisma.draft.update({
    where: { id: draftId },
    data: {
      status: "rejected",
      rejectedBy: payload.reviewedBy,
      rejectedAt: new Date(),
      rejectionReason: payload.reason,
    },
  });

  return NextResponse.json({ ok: true, draftId, rejectionReason: payload.reason });
}
