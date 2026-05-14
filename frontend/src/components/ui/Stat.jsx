export function Stat({ icon: Icon, label, value }) {
  return (
    <article className="stat">
      <Icon size={22} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
