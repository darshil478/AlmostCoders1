export default function PlaceholderPage({ title, description }) {
  return (
    <div style={{ padding: "30px" }}>
      <h2>{title}</h2>
      <p style={{ marginTop: "12px", color: "#64748b" }}>{description}</p>
    </div>
  );
}
