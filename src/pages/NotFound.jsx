import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found-num">404</p>
      <p className="not-found-title">This page has not been written.</p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary">Back home</Link>
        <Link to="/feed" className="btn btn-ghost">Open the feed</Link>
      </div>
    </div>
  );
}