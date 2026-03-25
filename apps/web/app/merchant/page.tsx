import { SectionPage } from "../../components/section-page";

export default function MerchantHomePage() {
  return (
    <SectionPage
      title="Merchant console"
      description="The merchant UI is approval-first by default. Every route here maps to a tenant-scoped feature that replaces the prior Airtable/Google Docs surface."
      bullets={[
        "Approve drafts before publish",
        "Set publish windows per tenant",
        "Review usage and billing state",
        "Optionally export or sync drafts with Google Docs",
      ]}
    />
  );
}
