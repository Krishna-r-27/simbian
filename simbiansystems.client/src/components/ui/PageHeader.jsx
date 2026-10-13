import { Link } from 'react-router-dom';

export default function PageHeader({ title, description, action, backTo }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        {backTo && (
          <Link to={backTo} className="admin-link mb-1 inline-block text-sm">
            ← Back
          </Link>
        )}
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
