export function FormSectionHead({ num, title }) {
  return (
    <div className="editor-section-head">
      <span className="editor-section-num">{num}</span>
      <span className="editor-section-title">{title}</span>
    </div>
  );
}

export function FormField({ id, label, value, onChange, placeholder, hint, error }) {
  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} />
      {hint && (
        <span className="editor-field-foot">
          <span>{hint}</span>
        </span>
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
