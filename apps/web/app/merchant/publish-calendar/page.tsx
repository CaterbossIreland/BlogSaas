import { SectionPage } from "../../../components/section-page";

export default function PublishCalendarPage() {
  return (
    <SectionPage
      title="Publish Calendar"
      description="Publish windows are stored per tenant and used by queued publish jobs rather than hard-coded cron combinations."
      bullets={[
        "Timezone-aware daily publish windows",
        "Approval-required toggles",
        "Run-now support for urgent publishes",
      ]}
    />
  );
}
