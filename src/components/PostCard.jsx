import { Link } from "react-router-dom";

function formatNum(id) {
  return String(id).padStart(3, "0");
}

export default function PostCard({ post }) {
  return (
    <article className="post">
      <div className="post-num">N°{formatNum(post.id)}</div>

      <div className="post-body">
        <div className="post-meta">
          <span className={`care care-${post.care_level}`}>{post.care_level}</span>
          <span>{post.light_need} light</span>
          <span className="post-plant">{post.plant_name}</span>
        </div>

        <h2 className="post-title">
          <Link to={`/feed/${post.id}`}>{post.title}</Link>
        </h2>

        <Link to={`/feed/${post.id}`} className="post-image">
          {post.image_url ? (
            <img src={post.image_url} alt={post.title} loading="lazy" />
          ) : (
            <div className="post-image-empty">No image</div>
          )}
        </Link>

        <p className="post-desc">{post.description}</p>

        <div className="post-actions">
          <Link to={`/feed/${post.id}`} className="post-action">
            Read the guide
          </Link>
        </div>
      </div>
    </article>
  );
}