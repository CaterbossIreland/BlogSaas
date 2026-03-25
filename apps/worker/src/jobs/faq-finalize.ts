import type { WorkerJobPayload } from "@blog-saas/domain";

import { findPromptTemplateByName } from "@blog-saas/prompt-library";

export async function runFaqFinalizeJob(payload: WorkerJobPayload) {
  const faqPrompt = findPromptTemplateByName("FAQ & CTA 1.0") ?? findPromptTemplateByName("Edit Content 2.5");

  return {
    jobKind: "faq_finalize",
    tenantId: payload.tenantId,
    promptName: faqPrompt?.name ?? null,
  };
}
