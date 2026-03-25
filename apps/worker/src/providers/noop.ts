import type {
  AirtableExporter,
  GoogleDocsExporter,
  ImageGenerationProvider,
  LlmProvider,
  PageExtractionProvider,
  SearchProvider,
  ShopifyPublishingProvider,
} from "./interfaces";

export const noopSearchProvider: SearchProvider = {
  async search(query, locale) {
    return [
      {
        title: `Placeholder search result for ${query}`,
        url: `https://${locale}/search?q=${encodeURIComponent(query)}`,
        snippet: "Replace with Google Custom Search or another research provider.",
      },
    ];
  },
};

export const noopPageExtractionProvider: PageExtractionProvider = {
  async read(url) {
    return { markdown: `Stub page extraction for ${url}` };
  },
};

export const noopLlmProvider: LlmProvider = {
  async complete({ systemPrompt, userPrompt, model }) {
    return {
      output: `Model ${model} would run here.\n\nSYSTEM:\n${systemPrompt.slice(0, 200)}\n\nUSER:\n${userPrompt.slice(0, 200)}`,
    };
  },
};

export const noopImageGenerationProvider: ImageGenerationProvider = {
  async generate({ prompt, fileName }) {
    return {
      storageKey: `stub/${fileName}`,
      altText: `Placeholder image for prompt: ${prompt.slice(0, 64)}`,
    };
  },
};

export const noopShopifyPublishingProvider: ShopifyPublishingProvider = {
  async publish({ shopDomain, title }) {
    return {
      articleId: "stub-article-id",
      liveUrl: `https://${shopDomain}/blogs/news/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    };
  },
};

export const noopGoogleDocsExporter: GoogleDocsExporter = {
  async exportDraft({ draftId }) {
    return { docUrl: `https://docs.google.com/document/d/stub-${draftId}` };
  },
  async syncDraft({ draftId }) {
    return { markdown: `Synced markdown for ${draftId}` };
  },
};

export const noopAirtableExporter: AirtableExporter = {
  async syncTopicBacklog() {
    return { synced: 0 };
  },
};
