import { NextRequest, NextResponse } from "next/server";

import { UpdateScheduleRequestSchema } from "@blog-saas/domain";

import { updateTenantSchedule } from "../../../../lib/persistence";

export async function PATCH(request: NextRequest) {
  const payload = UpdateScheduleRequestSchema.parse(await request.json());

  const schedule = await updateTenantSchedule(
    payload.tenantId,
    payload.localHours,
    payload.approvalRequired,
  );

  return NextResponse.json({ ok: true, schedule });
}
