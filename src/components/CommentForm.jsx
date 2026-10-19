import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { createComment } from "../api/comments";
import { COMMENT_MAX_LEN, validateCommentText } from "../lib/comments";
import { profileName, profileAvatar } from "../lib/profile";

export default function CommentForm({ postId, onAdded }) {
  const { user, accessToken } = useAuth();
  const notify = useToast();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const invalid = validateCommentText(text);
    if (invalid) {
      setError(invalid);
      return;
    }
    const trimmed = text.trim();

    setSubmitting(true);
    try {
      const created = await createComment(
        {
          post_id: Number(postId),
          comment: trimmed,
          author_name: profileName(user),
          author_avatar: profileAvatar(user),
        },
        accessToken
      );
      if (!created) throw new Error("Could not post comment");
      onAdded(created);
      setText("");
      notify("Comment posted.");
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
        maxLength={COMMENT_MAX_LEN + 50}
      />
      {error && <p className="field-error" role="alert">{error}</p>}
      <div className="comment-form-foot">
        <span className="comment-form-count">
          {text.length}/{COMMENT_MAX_LEN}
        </span>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
}