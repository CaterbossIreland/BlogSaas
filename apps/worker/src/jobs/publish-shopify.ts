import type { WorkerJobPayload } from "@blog-saas/domain";

import type { ShopifyPublishingProvider } from "../providers/interfaces";

export async function runPublishShopifyJob(
  payload: WorkerJobPayload,
  publishingProvider: ShopifyPublishingProvider,
) {
  const published = await publishingProvider.publish({
    shopDomain: "example.myshopify.com",
    accessToken: "encrypted-token-placeholder",
    title: `Draft ${payload.draftId ?? payload.correlationId}`,
    bodyHtml: "<p>Placeholder publish body.</p>",
    summaryHtml: "<p>Placeholder summary.</p>",
    tags: ["blog-saas", "automation"],
  });

  return {
    jobKind: "publish_shopify",
    tenantId: payload.tenantId,
    articleId: published.articleId,
    liveUrl: published.liveUrl,
  };
}
