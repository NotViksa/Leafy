import { Link } from "react-router-dom";
import PostPreview from "./PostPreview";
import { FormSectionHead, FormField } from "./FormElements";
import {
  POST_TYPES,
  CARE_LEVELS,
  LIGHT_NEEDS,
  fieldsFor,
  descriptionLabel,
} from "../lib/postForm";

export default function PostForm({
  pageTitle,
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
      </header>

      <div className="editor-grid">
        <form onSubmit={onSubmit} className="editor-form" noValidate>
          {apiError && <p className="form-error" role="alert">{apiError}</p>}

          <section className="editor-section">
            <FormSectionHead title="Type" />
            <div className="type-tabs">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`type-tab ${form.post_type === t.value ? "active" : ""}`}
                  aria-pressed={form.post_type === t.value}
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
            <FormSectionHead title="Identity" />
            <FormField
              id="title"
              label="Title"
              value={form.title}
              onChange={onChange}
              error={errors.title}
            />
            <FormField
              id="plant_name"
              label="Plant name"
              value={form.plant_name}
              onChange={onChange}
              error={errors.plant_name}
            />
            <FormField
              id="image_url"
              label="Image URL"
              value={form.image_url}
              onChange={onChange}
              error={errors.image_url}
            />
          </section>

          {f.care && (
            <section className="editor-section">
              <FormSectionHead title="Care" />
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
                <FormField
                  id="water_frequency"
                  label="Watering"
                  value={form.water_frequency}
                  onChange={onChange}
                  error={errors.water_frequency}
                />
              </div>
            </section>
          )}

          <section className="editor-section">
            <FormSectionHead title="Content" />
            <Textarea
              id="description"
              label={descriptionLabel(form.post_type)}
              value={form.description}
              onChange={onChange}
              maxLength={520}
              counter={`${form.description.trim().length}/500`}
              error={errors.description}
            />
            {f.content && (
              <Textarea
                id="content"
                label="The full guide"
                value={form.content}
                onChange={onChange}
                className="tall"
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

function Textarea({ id, label, value, onChange, maxLength, counter, error, className = "" }) {
  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={className}
      />
      {counter && <span className="editor-field-count">{counter}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
