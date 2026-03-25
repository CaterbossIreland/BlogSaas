import { SectionPage } from "../../../components/section-page";

export default function GoogleDocsPage() {
  return (
    <SectionPage
      title="Google Docs Export"
      description="Google Docs is optional in the new system. It becomes an export or sync surface, not the place where the app stores truth."
      bullets={[
        "Export approved drafts to Docs",
        "Sync edited drafts back into the canonical draft record",
        "Disable Docs entirely per tenant",
      ]}
    />
  );
}
