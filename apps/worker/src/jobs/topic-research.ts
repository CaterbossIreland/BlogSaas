import type { WorkerJobPayload } from "@blog-saas/domain";

import type { PageExtractionProvider, SearchProvider } from "../providers/interfaces";

export async function runTopicResearchJob(
  payload: WorkerJobPayload,
  searchProvider: SearchProvider,
  pageExtractionProvider: PageExtractionProvider,
) {
  const results = await searchProvider.search("irish stove installation advice", "google.ie");
  const firstPage = results[0];
  const extracted = firstPage ? await pageExtractionProvider.read(firstPage.url) : { markdown: "" };

  return {
    jobKind: "topic_research",
    tenantId: payload.tenantId,
    sourceCount: results.length,
    excerpt: extracted.markdown.slice(0, 200),
  };
}
