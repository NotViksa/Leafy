export default function CommentList({ comments }) {
  if (comments.length === 0) {
    return <p className="comments-empty">No comments yet.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <li key={c.id} className="comment">
          <p className="comment-body">{c.comment}</p>
          <p className="comment-meta">
            {new Date(c.created_at).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}