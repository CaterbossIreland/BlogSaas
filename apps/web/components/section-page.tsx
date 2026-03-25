type SectionPageProps = {
  title: string;
  description: string;
  bullets: string[];
};

export function SectionPage({ title, description, bullets }: SectionPageProps) {
  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <header>
        <h2 style={{ marginBottom: ".5rem" }}>{title}</h2>
        <p style={{ color: "#4b5563", lineHeight: 1.6 }}>{description}</p>
      </header>
      <ul style={{ display: "grid", gap: ".75rem", paddingLeft: "1.25rem" }}>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}
