import { Link } from "react-router-dom";

export default function EmptyState({ kicker, title, message, ctaTo, ctaLabel }) {
  return (
    <div className="empty-state">
      <span className="empty-state-kicker">{kicker ?? "Nothing here"}</span>
      <p className="empty-state-title">{title}</p>
      {message && <p className="empty-state-message">{message}</p>}
      {ctaTo && ctaLabel && (
        <Link to={ctaTo} className="btn btn-primary" style={{ marginTop: 20 }}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}