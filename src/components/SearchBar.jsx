export default function SearchBar({
  value,
  onChange,
  label = "Find",
  placeholder,
}) {
  return (
    <div className="search-bar">
      <label className="search-label" htmlFor="search-input">
        {label}
      </label>
      <div className="search-input-wrap">
        <input
          id="search-input"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Search entries…"}
          autoComplete="off"
          spellCheck={false}
        />
        {value && (
          <button
            type="button"
            className="search-clear"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}