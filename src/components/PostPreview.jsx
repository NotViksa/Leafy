const TYPE_LABELS = {
  guide: "Guide",
  question: "Question",
  showcase: "Showcase",
  tip: "Tip",
};

export default function PostPreview({ form }) {
  const type = form.post_type ?? "guide";
  const hasAny = form.title.trim() || form.description.trim() || form.image_url.trim();

  if (!hasAny) {
    return (
      <div className="preview">
        <span className="preview-label">Live preview</span>
        <div className="preview-card">
          <p className="preview-empty">Start typing to see how this will look on the feed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview">
      <span className="preview-label">Live preview</span>
      <div className="preview-card">
        <div className="preview-meta">
          <span className={`type type-${type}`}>{TYPE_LABELS[type]}</span>
          {type === "guide" && (
            <>
              <span className={`care care-${form.care_level}`}>{form.care_level}</span>
              <span>{form.light_need} light</span>
            </>
          )}
          {form.plant_name.trim() && (
            <span className="preview-plant">{form.plant_name}</span>
          )}
        </div>

        <p className="preview-title">{form.title.trim() || "Untitled entry"}</p>

        {form.image_url.trim() && type !== "tip" && (
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

        {form.description.trim() && (
          <p className="preview-desc">{form.description}</p>
        )}
      </div>
    </div>
  );
}