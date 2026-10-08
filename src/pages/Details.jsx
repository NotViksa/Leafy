import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPostById, deletePost } from "../api/posts";
import { getCommentsForPost } from "../api/comments";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

export default function Details() {
  const { postId } = useParams();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    Promise.all([
      getPostById(postId, controller.signal),
      getCommentsForPost(postId, controller.signal),
    ])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setComments(commentsData);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Could not load post");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [postId]);

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deletePost(post.id, accessToken);
      navigate("/feed", { replace: true });
    } catch (err) {
      setError(err.message || "Could not delete post");
      setDeleting(false);
    }
  }

  function handleCommentAdded(newComment) {
    setComments((prev) => [...prev, newComment]);
  }

  if (loading) return <p className="page-loading">Loading post…</p>;
  if (error) return <p className="form-error">{error}</p>;
  if (!post) return <p className="empty">Post not found.</p>;

  const isOwner = user && post.owner_id === user.id;

  return (
    <article className="details">
      <Link to="/feed" className="back-link">← Feed</Link>

      <header className="details-head">
        <div className="post-meta">
          <span className={`care care-${post.care_level}`}>{post.care_level}</span>
          <span>{post.light_need} light</span>
          <span>{post.water_frequency}</span>
        </div>
        <h1 className="details-title">{post.title}</h1>
        <p className="details-plant">{post.plant_name}</p>
      </header>

      {post.image_url && (
        <div className="details-image">
          <img src={post.image_url} alt={post.title} />
        </div>
      )}

      <p className="details-desc">{post.description}</p>
      <div className="details-content">{post.content}</div>

      {isOwner && (
        <div className="details-owner">
          <Link to={`/feed/${post.id}/edit`} className="btn btn-ghost">
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}

      <section className="comments">
        <h2 className="comments-heading">
          Comments <span className="comments-count">{comments.length}</span>
        </h2>

        <CommentList comments={comments} />

        {user ? (
          <CommentForm postId={post.id} onAdded={handleCommentAdded} />
        ) : (
          <p className="comments-login">
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}
      </section>
    </article>
  );
}