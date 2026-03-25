import { SectionPage } from "../../../components/section-page";

export default function ApprovalQueuePage() {
  return (
    <SectionPage
      title="Approval Queue"
      description="Approval-required publishing is the default. Drafts move here after generation and stay blocked until reviewed."
      bullets={[
        "Approve and schedule",
        "Reject with reason",
        "Request targeted regeneration",
      ]}
    />
  );
}
