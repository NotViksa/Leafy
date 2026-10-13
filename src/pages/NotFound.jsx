import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found-num">404</p>
      <p className="not-found-title">This page has not been written.</p>
      <p className="not-found-message">
        The link may be wrong, or the entry may have been deleted by its author.
      </p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary">Back home</Link>
        <Link to="/feed" className="btn btn-ghost">Open the feed</Link>
      </div>
    </div>
  );
}