import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createComment } from "../api/comments";

const MAX_LEN = 500;

export default function CommentForm({ postId, onAdded }) {
  const { accessToken } = useAuth();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = text.trim();
    if (!trimmed) {
      setError("Comment cannot be empty.");
      return;
    }
    if (trimmed.length > MAX_LEN) {
      setError(`Comment is too long (max ${MAX_LEN} characters).`);
      return;
    }

    setSubmitting(true);
    try {
      const created = await createComment(
        { post_id: Number(postId), comment: trimmed },
        accessToken
      );
      onAdded(created);
      setText("");
    } catch (err) {
      setError(err.message || "Could not post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form" noValidate>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts…"
        rows={3}
        maxLength={MAX_LEN + 50}
      />
      {error && <p className="field-error">{error}</p>}
      <div className="comment-form-foot">
        <span className="comment-form-count">
          {text.length}/{MAX_LEN}
        </span>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
}