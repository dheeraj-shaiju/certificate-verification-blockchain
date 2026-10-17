// Shown when there is nothing to display, with a hint about what to do next.
export default function EmptyState({ icon: Icon, title, message, children }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={32} aria-hidden="true" />}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}
