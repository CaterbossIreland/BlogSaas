import { SectionPage } from "../../../components/section-page";

export default function TopicBacklogPage() {
  return (
    <SectionPage
      title="Topic Backlog"
      description="Keyword opportunities and approved content ideas queue here before research and drafting jobs run."
      bullets={[
        "Generate topic batches on demand",
        "Track backlog and research states",
        "Preserve tenant-specific market context",
      ]}
    />
  );
}
