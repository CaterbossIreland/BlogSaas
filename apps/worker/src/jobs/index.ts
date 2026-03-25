import type { JobKind, WorkerJobPayload } from "@blog-saas/domain";

import {
  noopAirtableExporter,
  noopGoogleDocsExporter,
  noopImageGenerationProvider,
  noopLlmProvider,
  noopPageExtractionProvider,
  noopSearchProvider,
  noopShopifyPublishingProvider,
} from "../providers/noop";
import { runAwaitApprovalJob } from "./await-approval";
import { runDraftEditJob } from "./draft-edit";
import { runDraftGenerateJob } from "./draft-generate";
import { runFaqFinalizeJob } from "./faq-finalize";
import { runImageGenerateJob } from "./image-generate";
import { runPublishShopifyJob } from "./publish-shopify";
import { runSyncMetricsJob } from "./sync-metrics";
import { runTopicBacklogGenerateJob } from "./topic-backlog-generate";
import { runTopicResearchJob } from "./topic-research";

export async function dispatchJob(jobKind: JobKind, payload: WorkerJobPayload) {
  switch (jobKind) {
    case "topic_backlog_generate":
      return runTopicBacklogGenerateJob(payload, noopSearchProvider);
    case "topic_research":
      return runTopicResearchJob(payload, noopSearchProvider, noopPageExtractionProvider);
    case "draft_generate":
      return runDraftGenerateJob(payload, noopLlmProvider);
    case "draft_edit":
      return runDraftEditJob(payload, noopLlmProvider);
    case "faq_finalize":
      return runFaqFinalizeJob(payload);
    case "image_generate":
      return runImageGenerateJob(payload, noopLlmProvider, noopImageGenerationProvider);
    case "await_approval":
      return runAwaitApprovalJob(payload);
    case "publish_shopify":
      return runPublishShopifyJob(payload, noopShopifyPublishingProvider);
    case "sync_metrics":
      return runSyncMetricsJob(payload, noopGoogleDocsExporter, noopAirtableExporter);
    default: {
      const exhaustiveCheck: never = jobKind;
      throw new Error(`Unhandled job kind: ${exhaustiveCheck}`);
    }
  }
}
