import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPostById, deletePost } from "../api/posts";
import { getCommentsForPost } from "../api/comments";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import EmptyState from "../components/EmptyState";
import { DetailsSkeleton } from "../components/Skeleton";
import { DEFAULT_AVATAR } from "../lib/profile";

const TYPE_LABELS = {
  guide: "Guide",
  question: "Question",
  showcase: "Showcase",
  tip: "Tip",
};

const COMMENT_HEADINGS = {
  guide: "Annotations",
  question: "Answers",
  showcase: "Comments",
  tip: "Notes",
};

export default function Details() {
  const { postId } = useParams();
  const { user, accessToken, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
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
        if (!controller.signal.aborted) {
          setLoading(false);
          setHasLoaded(true);
        }
      });

    return () => controller.abort();
  }, [postId]);

  async function handleDelete() {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const deleted = await deletePost(post.id, accessToken);
      if (!deleted) {
        setError("Could not delete post");
        setDeleting(false);
        return;
      }
      navigate("/feed", { replace: true });
    } catch (err) {
      setError(err.message || "Could not delete post");
      setDeleting(false);
    }
  }

  function handleCommentAdded(newComment) {
    setComments((prev) => [...prev, newComment]);
  }

  function handleCommentDeleted(id) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  function handleCommentUpdated(updated) {
    setComments((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }

if (loading && !hasLoaded) return <DetailsSkeleton />;
if (error) return <p className="form-error">{error}</p>;
if (!post) {
  return (
    <EmptyState
      kicker="404 · Missing entry"
      title="This entry does not exist."
      message="It may have been deleted by its author, or the link may be wrong."
      ctaTo="/feed"
      ctaLabel="Back to the feed"
    />
  );
}

  const type = post.post_type ?? "guide";
  const isOwner = user && post.owner_id === user.id;
  const entryNum = String(post.id).padStart(3, "0");
  const isGuide = type === "guide";

  return (
    <article className={`details details-${type}`}>
      <Link to="/feed" className="back-link">← Back to the feed</Link>

      <header className="details-head">
        <p className="details-kicker">
          {TYPE_LABELS[type]} · N°{entryNum}
        </p>
        <h1 className="details-title">{post.title}</h1>
        {post.plant_name && <p className="details-plant">{post.plant_name}</p>}
        <div className="details-author author-line">
          <img
            className="avatar avatar-md"
            src={post.author_avatar || DEFAULT_AVATAR}
            alt=""
            width="40"
            height="40"
          />
          <div>
            <span className="author-line-name">{post.author_name}</span>
            <span className="author-line-label">Author</span>
          </div>
        </div>
      </header>

      {post.image_url && (
        <figure className="plate">
          <div className="plate-frame">
            <img
              src={post.image_url}
              alt={post.title}
              width="1200"
              height="800"
            />
          </div>
          {isGuide && (
            <figcaption className="plate-caption">
              Plate {entryNum} - {post.plant_name}
            </figcaption>
          )}
        </figure>
      )}

      {isGuide && (
        <dl className="specs">
          <div className="spec">
            <dt>Care</dt>
            <dd><span className={`care care-${post.care_level}`}>{post.care_level}</span></dd>
          </div>
          <div className="spec">
            <dt>Light</dt>
            <dd>{post.light_need}</dd>
          </div>
          <div className="spec">
            <dt>Water</dt>
            <dd>{post.water_frequency}</dd>
          </div>
        </dl>
      )}

      <p className="details-desc">{post.description}</p>

      {post.content && <div className="details-content">{post.content}</div>}

      {(isOwner || isAdmin) && (
        <div className="details-owner">
          {isOwner && (
            <Link to={`/feed/${post.id}/edit`} className="btn btn-ghost">Edit entry</Link>
          )}
          <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}

      <section className="comments">
        <h2 className="comments-heading">
          {COMMENT_HEADINGS[type]} <span>{comments.length} total</span>
        </h2>

        <CommentList
          comments={comments}
          onDeleted={handleCommentDeleted}
          onUpdated={handleCommentUpdated}
        />

        {user ? (
          <CommentForm postId={post.id} onAdded={handleCommentAdded} />
        ) : (
          <p className="comments-login">
            <Link to="/login">Log in</Link> to leave a reply.
          </p>
        )}
      </section>
    </article>
  );
}