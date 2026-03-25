import type { WorkerJobPayload } from "@blog-saas/domain";

import type { AirtableExporter, GoogleDocsExporter } from "../providers/interfaces";

export async function runSyncMetricsJob(
  payload: WorkerJobPayload,
  docsExporter: GoogleDocsExporter,
  airtableExporter: AirtableExporter,
) {
  const [docsResult, airtableResult] = await Promise.all([
    docsExporter.exportDraft({
      tenantId: payload.tenantId,
      draftId: payload.draftId ?? payload.correlationId,
      markdown: "Placeholder draft markdown",
    }),
    airtableExporter.syncTopicBacklog({ tenantId: payload.tenantId }),
  ]);

  return {
    jobKind: "sync_metrics",
    tenantId: payload.tenantId,
    docsUrl: docsResult.docUrl,
    airtableSynced: airtableResult.synced,
  };
}
