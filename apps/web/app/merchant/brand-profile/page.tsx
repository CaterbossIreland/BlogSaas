import { SectionPage } from "../../../components/section-page";

export default function BrandProfilePage() {
  return (
    <SectionPage
      title="Brand Profile"
      description="Tenant-owned brand voice, domain rules, and compliance settings replace the old config doc path."
      bullets={[
        "Primary domain and Irish market targeting",
        "Voice summary and style constraints",
        "Internal linking rules",
        "Compliance notes for editorial and publishing",
      ]}
    />
  );
}
