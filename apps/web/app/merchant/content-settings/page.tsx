import { SectionPage } from "../../../components/section-page";

export default function ContentSettingsPage() {
  return (
    <SectionPage
      title="Content Settings"
      description="Prompt versions, content types, cadence, and provider choices are configured per tenant instead of scattered across Airtable and n8n."
      bullets={[
        "Prompt template version selection",
        "Search locale and market defaults",
        "Draft volume caps",
        "LLM and image provider selection",
      ]}
    />
  );
}
