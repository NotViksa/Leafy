import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Page render failed:", error);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="empty-state">
        <span className="empty-state-kicker">Something went wrong</span>
        <p className="empty-state-title">This page could not be displayed.</p>
        <p className="empty-state-message">
          An unexpected error interrupted this page. You can try again, or head back to the feed.
        </p>
        <div className="error-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
          <Link to="/feed" className="btn btn-ghost">
            Back to the feed
          </Link>
        </div>
      </div>
    );
  }
}
