import { NextRequest, NextResponse } from "next/server";

import { GenerateTopicsRequestSchema } from "@blog-saas/domain";

import { enqueueTenantJob } from "../../../../lib/queue";

export async function POST(request: NextRequest) {
  const payload = GenerateTopicsRequestSchema.parse(await request.json());

  const queued = await enqueueTenantJob("topic_backlog_generate", {
    tenantId: payload.tenantId,
    templateVersion: 1,
    attempt: 1,
  });

  return NextResponse.json(
    {
      ok: true,
      queued,
      requestedCount: payload.count,
      requestedBy: payload.requestedBy,
      seedKeyword: payload.seedKeyword ?? null,
    },
    { status: 202 },
  );
}
