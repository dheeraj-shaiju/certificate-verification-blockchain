// Title area at the top of each dashboard. "actions" is optional (e.g. buttons).
export default function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
