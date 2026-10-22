import { POST_TYPE_LABELS } from "../lib/postForm";

export default function PostPreview({ form }) {
  const type = form.post_type ?? "guide";

  return (
    <aside className="preview" aria-label="Live preview">
      <div className="preview-card">
        <div className="preview-meta">
          <span className={`type type-${type}`}>{POST_TYPE_LABELS[type]}</span>
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
          <div className="post-image">
            <img
              src={form.image_url}
              alt={form.title}
              loading="lazy"
              width="1200"
              height="800"
            />
          </div>
        )}

        {form.description.trim() && (
          <p className="preview-desc">{form.description}</p>
        )}
      </div>
    </aside>
  );
}
