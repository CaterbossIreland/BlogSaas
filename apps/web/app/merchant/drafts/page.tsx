import { SectionPage } from "../../../components/section-page";

export default function DraftsPage() {
  return (
    <SectionPage
      title="Drafts"
      description="Canonical draft storage now lives in Postgres, with markdown, HTML, FAQ, CTA, image, and publish state in one place."
      bullets={[
        "Draft body and structured sections",
        "Prompt version and correlation tracking",
        "Hero image attachment and alt text",
      ]}
    />
  );
}
