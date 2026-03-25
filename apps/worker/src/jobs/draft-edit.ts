import type { WorkerJobPayload } from "@blog-saas/domain";

import { findPromptTemplateByName } from "@blog-saas/prompt-library";

import type { LlmProvider } from "../providers/interfaces";

export async function runDraftEditJob(payload: WorkerJobPayload, llmProvider: LlmProvider) {
  const editPrompt = findPromptTemplateByName("Edit Content 2.5");

  const completion = await llmProvider.complete({
    systemPrompt: editPrompt?.systemPrompt ?? "Edit the content safely.",
    userPrompt: `Edit draft ${payload.draftId ?? "unknown"} for tenant ${payload.tenantId}.`,
    model: "openai/gpt-4.1",
  });

  return {
    jobKind: "draft_edit",
    tenantId: payload.tenantId,
    outputPreview: completion.output.slice(0, 200),
  };
}
