import promptTemplates from "../seeds/default-prompt-templates.json";
import contentTypes from "../seeds/default-content-types.json";

export type PromptTemplateSeed = {
  name: string;
  usedIn: string[];
  systemPrompt: string;
  formatLabel: string | null;
  version: number;
};

export type ContentTypeSeed = {
  contentType: string;
  variants: string | null;
  status: string;
  category: string | null;
  journeyStage: string | null;
  outlineStructure: string | null;
};

export function getDefaultPromptTemplates(): PromptTemplateSeed[] {
  return promptTemplates as PromptTemplateSeed[];
}

export function getDefaultContentTypes(): ContentTypeSeed[] {
  return contentTypes as ContentTypeSeed[];
}

export function applyTenantPromptOverride(
  basePrompt: PromptTemplateSeed,
  override: Partial<Pick<PromptTemplateSeed, "systemPrompt" | "usedIn">>,
): PromptTemplateSeed {
  return {
    ...basePrompt,
    ...override,
    usedIn: override.usedIn ?? basePrompt.usedIn,
    version: basePrompt.version,
  };
}

export function findPromptTemplateByName(name: string) {
  return getDefaultPromptTemplates().find((template) => template.name === name) ?? null;
}
