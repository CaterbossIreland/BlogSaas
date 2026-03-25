import type { WorkerJobPayload } from "@blog-saas/domain";

import { findPromptTemplateByName } from "@blog-saas/prompt-library";

import type { ImageGenerationProvider, LlmProvider } from "../providers/interfaces";

export async function runImageGenerateJob(
  payload: WorkerJobPayload,
  llmProvider: LlmProvider,
  imageProvider: ImageGenerationProvider,
) {
  const promptTemplate =
    findPromptTemplateByName("Generate RT Featured Image Prompt")?.systemPrompt ??
    "Create a premium editorial hero image prompt for an Irish stove retailer.";

  const generatedPrompt = await llmProvider.complete({
    systemPrompt: promptTemplate,
    userPrompt: `Create a hero image prompt for draft ${payload.draftId ?? "unknown"}.`,
    model: "openai/gpt-4.1-mini",
  });

  const image = await imageProvider.generate({
    prompt: generatedPrompt.output,
    fileName: `${payload.draftId ?? payload.correlationId}.jpg`,
  });

  return {
    jobKind: "image_generate",
    tenantId: payload.tenantId,
    storageKey: image.storageKey,
    altText: image.altText,
  };
}
