import { prisma } from "@blog-saas/db";
import { assertValidLocalHours } from "@blog-saas/domain";

function slugifyShopDomain(shopDomain: string) {
  return shopDomain.replace(".myshopify.com", "").replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();
}

export async function upsertInstalledShop(params: {
  shopDomain: string;
  accessTokenEncrypted: string;
  scope: string;
}) {
  const tenantSlug = slugifyShopDomain(params.shopDomain);

  const tenant = await prisma.tenant.upsert({
    where: { slug: tenantSlug },
    update: { status: "active" },
    create: {
      name: tenantSlug,
      slug: tenantSlug,
      countryCode: "IE",
      status: "active",
    },
  });

  await prisma.shopConnection.upsert({
    where: { shopDomain: params.shopDomain },
    update: {
      accessTokenEncrypted: params.accessTokenEncrypted,
      scope: params.scope,
      uninstalledAt: null,
    },
    create: {
      tenantId: tenant.id,
      shopDomain: params.shopDomain,
      accessTokenEncrypted: params.accessTokenEncrypted,
      scope: params.scope,
    },
  });

  await prisma.brandProfile.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      brandName: tenantSlug,
      primaryDomain: params.shopDomain,
      voiceSummary: "Helpful, brand-safe expert voice",
      internalLinkRules: [],
      complianceNotes: [],
    },
  });

  await prisma.contentPolicy.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      approvalRequired: true,
      searchLocale: "google.ie",
      imageProvider: "gemini",
      llmProvider: "openai",
      publishCadenceHours: [10, 13, 16],
    },
  });

  await prisma.publishSchedule.upsert({
    where: { tenantId: tenant.id },
    update: {
      localHours: assertValidLocalHours([10, 13, 16]),
    },
    create: {
      tenantId: tenant.id,
      timezone: "Europe/Dublin",
      localHours: [10, 13, 16],
      approvalRequired: true,
    },
  });

  return tenant;
}

export async function markShopUninstalled(shopDomain: string) {
  return prisma.shopConnection.update({
    where: { shopDomain },
    data: {
      uninstalledAt: new Date(),
    },
  });
}

export async function updateTenantSchedule(tenantId: string, localHours: number[], approvalRequired: boolean) {
  const normalizedHours = assertValidLocalHours(localHours);
  await prisma.contentPolicy.update({
    where: { tenantId },
    data: { approvalRequired, publishCadenceHours: normalizedHours },
  });

  return prisma.publishSchedule.upsert({
    where: { tenantId },
    update: {
      localHours: normalizedHours,
      approvalRequired,
    },
    create: {
      tenantId,
      timezone: "Europe/Dublin",
      localHours: normalizedHours,
      approvalRequired,
    },
  });
}
