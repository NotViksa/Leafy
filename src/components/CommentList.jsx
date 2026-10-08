export default function CommentList({ comments }) {
  if (comments.length === 0) {
    return <p className="comments-empty">No comments yet.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((c, i) => (
        <li key={c.id} className="comment">
          <span className="comment-num">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <p className="comment-body">{c.comment}</p>
            <p className="comment-meta">{new Date(c.created_at).toLocaleString()}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}