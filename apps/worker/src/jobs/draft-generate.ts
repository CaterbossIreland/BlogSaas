import type { WorkerJobPayload } from "@blog-saas/domain";

import { findPromptTemplateByName } from "@blog-saas/prompt-library";

import type { LlmProvider } from "../providers/interfaces";

export async function runDraftGenerateJob(payload: WorkerJobPayload, llmProvider: LlmProvider) {
  const researchPrompt = findPromptTemplateByName("Query Research 1.4");
  const styleGuide = findPromptTemplateByName("Writing Style Guide 1.0");

  const completion = await llmProvider.complete({
    systemPrompt: [researchPrompt?.systemPrompt, styleGuide?.systemPrompt].filter(Boolean).join("\n\n"),
    userPrompt: `Generate a tenant-safe draft for tenant ${payload.tenantId} and draft ${payload.draftId ?? "new"}.`,
    model: "openai/gpt-4.1",
  });

  return {
    jobKind: "draft_generate",
    tenantId: payload.tenantId,
    promptSources: [researchPrompt?.name, styleGuide?.name].filter(Boolean),
    outputPreview: completion.output.slice(0, 200),
  };
}
