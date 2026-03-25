import type { WorkerJobPayload } from "@blog-saas/domain";

export async function runAwaitApprovalJob(payload: WorkerJobPayload) {
  return {
    jobKind: "await_approval",
    tenantId: payload.tenantId,
    draftId: payload.draftId ?? null,
    status: "paused_for_review",
  };
}
