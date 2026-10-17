export default function StatCard({ label, value, icon: Icon, tone = 'cyan' }) {
  return (
    <div className="stat-card">
      <span className={`stat-icon tone-${tone}`} aria-hidden="true">
        <Icon size={18} />
      </span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
