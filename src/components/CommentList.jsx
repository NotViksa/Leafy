import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteComment } from "../api/comments";

export default function CommentList({ comments, onDeleted }) {
  const { user, accessToken, isAdmin } = useAuth();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  if (comments.length === 0) {
    return <p className="comments-empty">No comments yet.</p>;
  }

  function canDelete(comment) {
    if (!user) return false;
    return isAdmin || comment.owner_id === user.id;
  }

  async function handleDelete(comment) {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    setError("");
    setDeletingId(comment.id);
    try {
      const deleted = await deleteComment(comment.id, accessToken);
      if (!deleted) {
        setError("Could not delete comment.");
        return;
      }
      onDeleted(comment.id);
    } catch (err) {
      setError(err.message || "Could not delete comment");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {error && <p className="field-error">{error}</p>}
      <ul className="comment-list">
        {comments.map((c, i) => (
          <li key={c.id} className="comment">
            <span className="comment-num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="comment-body">{c.comment}</p>
              <p className="comment-meta">
                {new Date(c.created_at).toLocaleString()}
                {canDelete(c) && (
                  <>
                    {" · "}
                    <button
                      type="button"
                      className="comment-delete"
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                    >
                      {deletingId === c.id ? "Deleting…" : "Delete"}
                    </button>
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
