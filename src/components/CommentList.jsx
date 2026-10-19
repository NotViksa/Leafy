import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { deleteComment, updateComment } from "../api/comments";
import { COMMENT_MAX_LEN, validateCommentText } from "../lib/comments";
import { DEFAULT_AVATAR } from "../lib/profile";
import ConfirmDialog from "./ConfirmDialog";

export default function CommentList({ comments, onDeleted, onUpdated }) {
  const { user, accessToken, isAdmin } = useAuth();
  const notify = useToast();
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
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
    const invalid = validateCommentText(draft);
    if (invalid) {
      setError(invalid);
      return;
    }
    const trimmed = draft.trim();

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
      notify("Comment updated.");
    } catch (err) {
      setError(err.message || "Could not save comment");
    } finally {
      setSavingId(null);
    }
  }

  function startDelete(comment) {
    setDeleteError("");
    setPendingDelete(comment);
  }

  async function handleDelete() {
    const id = pendingDelete.id;
    setDeleteError("");
    setDeletingId(id);
    try {
      const deleted = await deleteComment(id, accessToken);
      if (!deleted) {
        setDeleteError("Could not delete comment.");
        return;
      }
      setPendingDelete(null);
      onDeleted(id);
      notify("Comment deleted.");
    } catch (err) {
      setDeleteError(err.message || "Could not delete comment");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {error && <p className="field-error" role="alert">{error}</p>}
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
                        onClick={() => startDelete(c)}
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

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this comment?"
        message="This cannot be undone."
        error={deleteError}
        confirmLabel="Delete comment"
        busy={deletingId !== null}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
