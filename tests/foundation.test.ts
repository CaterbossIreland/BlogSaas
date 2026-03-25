import { describe, expect, it } from "vitest";

import {
  ApproveDraftRequestSchema,
  GenerateTopicsRequestSchema,
  UpdateScheduleRequestSchema,
  assertValidLocalHours,
  createCorrelationId,
} from "@blog-saas/domain";
import {
  applyTenantPromptOverride,
  getDefaultContentTypes,
  getDefaultPromptTemplates,
} from "@blog-saas/prompt-library";

describe("domain contracts", () => {
  it("normalizes local publish hours", () => {
    expect(assertValidLocalHours([16, 10, 13, 10])).toEqual([10, 13, 16]);
  });

  it("validates topic generation requests", () => {
    const parsed = GenerateTopicsRequestSchema.parse({
      tenantId: "3e59f99c-7a96-4c46-86a0-5eb10d09fd97",
      requestedBy: "ciaran@blog-saas.ie",
      count: 3,
    });

    expect(parsed.count).toBe(3);
  });

  it("validates draft approval", () => {
    const parsed = ApproveDraftRequestSchema.parse({
      tenantId: "3e59f99c-7a96-4c46-86a0-5eb10d09fd97",
      reviewedBy: "ciaran@blog-saas.ie",
    });

    expect(parsed.reviewedBy).toContain("@");
  });

  it("validates schedule patch payloads", () => {
    const parsed = UpdateScheduleRequestSchema.parse({
      tenantId: "3e59f99c-7a96-4c46-86a0-5eb10d09fd97",
      timezone: "Europe/Dublin",
      localHours: [10, 13, 16],
      approvalRequired: true,
    });

    expect(parsed.localHours).toHaveLength(3);
  });

  it("creates uuid correlation ids", () => {
    expect(createCorrelationId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});

describe("prompt library", () => {
  it("loads prompt templates from seed", () => {
    expect(Array.isArray(getDefaultPromptTemplates())).toBe(true);
  });

  it("loads content types from seed", () => {
    expect(Array.isArray(getDefaultContentTypes())).toBe(true);
  });

  it("applies tenant overrides without mutating the source", () => {
    const base = {
      name: "Example Prompt",
      usedIn: ["Content Generator 2.0"],
      systemPrompt: "base",
      formatLabel: null,
      version: 1,
    };
    const overridden = applyTenantPromptOverride(base, { systemPrompt: "override" });

    expect(base.systemPrompt).toBe("base");
    expect(overridden.systemPrompt).toBe("override");
    expect(overridden.version).toBe(1);
  });
});
