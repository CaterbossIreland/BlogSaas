import { SectionPage } from "../../../components/section-page";

export default function UsagePage() {
  return (
    <SectionPage
      title="Usage"
      description="Every expensive operation is metered per tenant so pricing, limits, and spend caps are enforceable in the worker layer."
      bullets={[
        "Draft generation counts",
        "Image generation counts",
        "Successful publish counts",
      ]}
    />
  );
}
