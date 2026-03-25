import { SectionPage } from "../../../components/section-page";

export default function BillingPage() {
  return (
    <SectionPage
      title="Billing"
      description="The billing surface is ready for Shopify subscription state, plan limits, and agency override flows."
      bullets={[
        "Subscription plan status",
        "Monthly limits by feature",
        "Agency-managed upgrade flow",
      ]}
    />
  );
}
