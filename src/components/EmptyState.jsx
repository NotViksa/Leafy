import { Link } from "react-router-dom";

export default function EmptyState({ title, ctaTo, ctaLabel }) {
  return (
    <div className="empty-state">
      <p className="empty-state-title">{title}</p>
      {ctaTo && ctaLabel && (
        <Link to={ctaTo} className="btn btn-primary">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}