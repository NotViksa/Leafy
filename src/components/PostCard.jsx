import { Link } from "react-router-dom";

const TYPE_LABELS = {
  guide: "Guide",
  question: "Question",
  showcase: "Showcase",
  tip: "Tip",
};

const CTA_LABELS = {
  guide: "Read the guide",
  question: "Answer this",
  showcase: "View entry",
  tip: "Read the tip",
};

function formatNum(id) {
  return String(id).padStart(3, "0");
}

export default function PostCard({ post }) {
  const type = post.post_type ?? "guide";
  const showImage = post.image_url && type !== "tip";

  return (
    <article className={`post post-type-${type}`}>
      <div className="post-num">N°{formatNum(post.id)}</div>

      <div className="post-body">
        <div className="post-meta">
          <span className={`type type-${type}`}>{TYPE_LABELS[type]}</span>
          {post.care_level && (
            <span className={`care care-${post.care_level}`}>{post.care_level}</span>
          )}
          {post.light_need && <span>{post.light_need} light</span>}
          <span className="post-author">by {post.author_name}</span>
          {post.plant_name && <span className="post-plant">{post.plant_name}</span>}
        </div>

        <h2 className="post-title">
          <Link to={`/feed/${post.id}`}>{post.title}</Link>
        </h2>

        {showImage && (
        <Link to={`/feed/${post.id}`} className="post-image">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              loading="lazy"
              width="1200"
              height="800"
            />
          ) : (
            <div className="post-image-empty">No image</div>
          )}
        </Link>
        )}

        <p className="post-desc">{post.description}</p>

        <div className="post-actions">
          <Link to={`/feed/${post.id}`} className="post-action">
            {CTA_LABELS[type]}
          </Link>
        </div>
      </div>
    </article>
  );
}