import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <h1>404 — Not found</h1>
      <p>That page doesn't exist. <Link to="/">Go home</Link></p>
    </div>
  );
}