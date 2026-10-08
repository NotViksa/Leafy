import { Link } from "react-router-dom";
import PostPreview from "./PostPreview";
import {
  POST_TYPES,
  CARE_LEVELS,
  LIGHT_NEEDS,
  fieldsFor,
  descriptionLabel,
  descriptionHint,
} from "../lib/postForm";

export default function PostForm({
  pageTitle,
  subtitle,
  form,
  errors,
  apiError,
  submitting,
  onChange,
  onSubmit,
  submitLabel,
  submittingLabel,
  cancelTo,
  cancelLabel,
}) {
  const f = fieldsFor(form.post_type);

  return (
    <div className="editor">
      <header className="editor-head">
        <h1>{pageTitle}</h1>
        <p>{subtitle}</p>
      </header>

      <div className="editor-grid">
        <form onSubmit={onSubmit} className="editor-form" noValidate>
          {apiError && <p className="form-error">{apiError}</p>}

          <section className="editor-section">
            <SectionHead num="I." title="Type" />
            <div className="type-tabs">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`type-tab ${form.post_type === t.value ? "active" : ""}`}
                  onClick={() =>
                    onChange({ target: { name: "post_type", value: t.value } })
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="editor-section">
            <SectionHead num="II." title="Identity" />
            <Field
              id="title"
              label="Title"
              value={form.title}
              onChange={onChange}
              placeholder={placeholderFor(form.post_type, "title")}
              error={errors.title}
            />
            <Field
              id="plant_name"
              label={f.plant ? "Plant name" : "Plant name (optional)"}
              value={form.plant_name}
              onChange={onChange}
              placeholder="Monstera Deliciosa"
              error={errors.plant_name}
            />
            <Field
              id="image_url"
              label={f.imageRequired ? "Image URL" : "Image URL (optional)"}
              value={form.image_url}
              onChange={onChange}
              placeholder="https://…"
              hint={
                f.imageRequired
                  ? "Required for a showcase — the full image is shown, never cropped."
                  : "The full image is shown, never cropped."
              }
              error={errors.image_url}
            />
          </section>

          {f.care && (
            <section className="editor-section">
              <SectionHead num="III." title="Care" />
              <div className="editor-row-3">
                <Select
                  id="care_level"
                  label="Care level"
                  value={form.care_level}
                  onChange={onChange}
                  options={CARE_LEVELS}
                  error={errors.care_level}
                />
                <Select
                  id="light_need"
                  label="Light"
                  value={form.light_need}
                  onChange={onChange}
                  options={LIGHT_NEEDS}
                  error={errors.light_need}
                />
                <Field
                  id="water_frequency"
                  label="Watering"
                  value={form.water_frequency}
                  onChange={onChange}
                  placeholder="Once a week"
                  error={errors.water_frequency}
                />
              </div>
            </section>
          )}

          <section className="editor-section">
            <SectionHead num={f.care ? "IV." : "III."} title="Content" />
            <Textarea
              id="description"
              label={descriptionLabel(form.post_type)}
              value={form.description}
              onChange={onChange}
              placeholder={placeholderFor(form.post_type, "description")}
              maxLength={520}
              hint={descriptionHint(form.post_type)}
              counter={`${form.description.trim().length}/500`}
              error={errors.description}
            />
            {f.content && (
              <Textarea
                id="content"
                label="The full guide"
                value={form.content}
                onChange={onChange}
                placeholder="Care instructions, tips, common mistakes, personal notes…"
                className="tall"
                hint="Shown on the details page. Blank lines create paragraphs."
                error={errors.content}
              />
            )}
          </section>

          <div className="editor-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? submittingLabel : submitLabel}
            </button>
            <Link to={cancelTo} className="btn btn-ghost">{cancelLabel}</Link>
          </div>
        </form>

        <PostPreview form={form} />
      </div>
    </div>
  );
}

function placeholderFor(type, field) {
  if (field === "title") {
    return {
      guide: "Monstera care 101",
      question: "Why are my leaves yellowing?",
      showcase: "My monstera hit the ceiling",
      tip: "Water less in winter",
    }[type] ?? "Title";
  }
  return {
    guide: "One or two sentences that appear on the feed card.",
    question: "Give context — pot, light, watering, how long this has been happening.",
    showcase: "A few words about the photo.",
    tip: "A short piece of advice.",
  }[type] ?? "";
}

function SectionHead({ num, title }) {
  return (
    <div className="editor-section-head">
      <span className="editor-section-num">{num}</span>
      <span className="editor-section-title">{title}</span>
    </div>
  );
}

function Field({ id, label, value, onChange, placeholder, hint, error }) {
  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} />
      {hint && <span className="editor-field-foot"><span>{hint}</span></span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function Select({ id, label, value, onChange, options, error }) {
  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={id} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function Textarea({ id, label, value, onChange, placeholder, maxLength, hint, counter, error, className = "" }) {
  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={className}
      />
      {(hint || counter) && (
        <span className="editor-field-foot">
          {hint && <span>{hint}</span>}
          {counter && <span>{counter}</span>}
        </span>
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}