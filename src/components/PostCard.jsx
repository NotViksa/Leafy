    import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/feed/${post.id}`} className="post-card-image">
        {post.image_url ? (
          <img src={post.image_url} alt={post.title} loading="lazy" />
        ) : (
          <span className="post-card-image-empty">🌱</span>
        )}
      </Link>

      <div className="post-card-body">
        <div className="post-card-meta">
          <span className={`badge badge-${post.care_level}`}>
            {post.care_level}
          </span>
          <span className="badge badge-light">{post.light_need} light</span>
        </div>

        <h2>
          <Link to={`/feed/${post.id}`}>{post.title}</Link>
        </h2>

        <p className="post-card-plant">{post.plant_name}</p>
        <p className="post-card-desc">{post.description}</p>

        <Link to={`/feed/${post.id}`} className="post-card-cta">
          Read guide →
        </Link>
      </div>
    </article>
  );
}