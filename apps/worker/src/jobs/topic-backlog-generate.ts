import type { WorkerJobPayload } from "@blog-saas/domain";

import { getDefaultContentTypes } from "@blog-saas/prompt-library";

import type { SearchProvider } from "../providers/interfaces";

export async function runTopicBacklogGenerateJob(
  payload: WorkerJobPayload,
  searchProvider: SearchProvider,
) {
  const contentTypes = getDefaultContentTypes().filter((item) => item.status === "Production").slice(0, 5);
  const research = await searchProvider.search("best stove blog topics ireland", "google.ie");

  return {
    jobKind: "topic_backlog_generate",
    tenantId: payload.tenantId,
    contentTypesConsidered: contentTypes.map((item) => item.contentType),
    researchSources: research.map((item) => item.url),
  };
}
