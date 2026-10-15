import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteComment, updateComment } from "../api/comments";
import { COMMENT_MAX_LEN } from "../lib/comments";
import { DEFAULT_AVATAR } from "../lib/profile";

export default function CommentList({ comments, onDeleted, onUpdated }) {
  const { user, accessToken, isAdmin } = useAuth();
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  if (comments.length === 0) {
    return <p className="comments-empty">No comments yet.</p>;
  }

  function canEdit(comment) {
    if (!user) return false;
    return comment.owner_id === user.id;
  }

  function canDelete(comment) {
    if (!user) return false;
    return isAdmin || comment.owner_id === user.id;
  }

  function startEdit(comment) {
    setError("");
    setEditingId(comment.id);
    setDraft(comment.comment);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft("");
  }

  async function handleSave(comment) {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Comment cannot be empty.");
      return;
    }
    if (trimmed.length > COMMENT_MAX_LEN) {
      setError(`Comment is too long (max ${COMMENT_MAX_LEN} characters).`);
      return;
    }

    setSavingId(comment.id);
    setError("");
    try {
      const updated = await updateComment(comment.id, trimmed, accessToken);
      if (!updated) {
        setError("Could not save comment.");
        return;
      }
      onUpdated(updated);
      cancelEdit();
    } catch (err) {
      setError(err.message || "Could not save comment");
    } finally {
      setSavingId(null);
    }
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
            <img
              className="avatar avatar-md"
              src={c.author_avatar || DEFAULT_AVATAR}
              alt=""
              width="40"
              height="40"
              loading="lazy"
            />
            <div className="comment-content">
              <div className="comment-head">
                <span className="comment-author">
                  {c.author_name || "Gardener"}
                </span>
                <span className="comment-date">
                  {new Date(c.created_at).toLocaleString()}
                </span>
                {editingId !== c.id && (canEdit(c) || canDelete(c)) && (
                  <span className="comment-actions">
                    {canEdit(c) && (
                      <button
                        type="button"
                        className="comment-action"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </button>
                    )}
                    {canDelete(c) && (
                      <button
                        type="button"
                        className="comment-action comment-action-danger"
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                      >
                        {deletingId === c.id ? "Deleting…" : "Delete"}
                      </button>
                    )}
                  </span>
                )}
              </div>

              {editingId === c.id ? (
                <>
                  <textarea
                    className="comment-edit"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    maxLength={COMMENT_MAX_LEN + 50}
                  />
                  <div className="comment-edit-actions">
                    <button
                      type="button"
                      className="comment-action comment-action-primary"
                      onClick={() => handleSave(c)}
                      disabled={savingId === c.id}
                    >
                      {savingId === c.id ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="comment-action"
                      onClick={cancelEdit}
                      disabled={savingId === c.id}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="comment-body">{c.comment}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
