export function FormSectionHead({ title }) {
  return (
    <div className="editor-section-head">
      <h2 className="editor-section-title">{title}</h2>
    </div>
  );
}

export function FormField({ id, label, value, onChange, error }) {
  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} value={value} onChange={onChange} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
