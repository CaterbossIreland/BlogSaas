export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export interface SearchProvider {
  search(query: string, locale: string): Promise<SearchResult[]>;
}

export interface PageExtractionProvider {
  read(url: string): Promise<{ markdown: string }>;
}

export interface LlmProvider {
  complete(params: {
    systemPrompt: string;
    userPrompt: string;
    model: string;
  }): Promise<{ output: string }>;
}

export interface ImageGenerationProvider {
  generate(params: { prompt: string; fileName: string }): Promise<{ storageKey: string; altText: string }>;
}

export interface ShopifyPublishingProvider {
  publish(params: {
    shopDomain: string;
    accessToken: string;
    title: string;
    bodyHtml: string;
    summaryHtml: string;
    tags: string[];
  }): Promise<{ articleId: string; liveUrl: string }>;
}

export interface GoogleDocsExporter {
  exportDraft(params: { tenantId: string; draftId: string; markdown: string }): Promise<{ docUrl: string }>;
  syncDraft(params: { tenantId: string; draftId: string }): Promise<{ markdown: string }>;
}

export interface AirtableExporter {
  syncTopicBacklog(params: { tenantId: string }): Promise<{ synced: number }>;
}
