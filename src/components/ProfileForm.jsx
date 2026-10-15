import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfilePreview from "./ProfilePreview";
import { profileName } from "../lib/profile";

const MAX_NAME = 40;

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.display_name ?? "");
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url ?? "");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function change(setter, field) {
    return (e) => {
      setter(e.target.value);
      setSaved(false);
      if (errors[field]) setErrors({ ...errors, [field]: undefined });
    };
  }

  function validate() {
    const next = {};
    const trimmedName = name.trim();
    const trimmedAvatar = avatar.trim();

    if (trimmedName && trimmedName.length < 2)
      next.name = "Display name must be at least 2 characters.";
    else if (trimmedName.length > MAX_NAME)
      next.name = `Display name must be under ${MAX_NAME} characters.`;

    if (trimmedAvatar && !/^https?:\/\/\S+$/i.test(trimmedAvatar))
      next.avatar = "Avatar URL must start with http:// or https://";

    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await updateProfile({
        display_name: name.trim() || null,
        avatar_url: avatar.trim() || null,
      });
      setSaved(true);
    } catch (err) {
      setApiError(err.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editor">
      <header className="editor-head">
        <h1>Your profile</h1>
        <p>Signed in as {user.email}</p>
      </header>

      <div className="editor-grid">
        <form onSubmit={handleSubmit} className="editor-form" noValidate>
          {apiError && <p className="form-error">{apiError}</p>}

          <section className="editor-section">
            <SectionHead num="I." title="Identity" />
            <Field
              id="profile-name"
              label="Display name"
              value={name}
              onChange={change(setName, "name")}
              placeholder={profileName(user)}
              hint="Empty falls back to the name part of your email."
              error={errors.name}
            />
          </section>

          <section className="editor-section">
            <SectionHead num="II." title="Portrait" />
            <Field
              id="profile-avatar"
              label="Avatar image URL"
              value={avatar}
              onChange={change(setAvatar, "avatar")}
              placeholder="https://…"
              hint="A square image works best. Empty uses the gray placeholder."
              error={errors.avatar}
            />
          </section>

          <div className="editor-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </button>
            {saved && <span className="profile-saved">Profile saved.</span>}
          </div>
        </form>

        <ProfilePreview name={name} avatar={avatar} />
      </div>
    </div>
  );
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
      <input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {hint && (
        <span className="editor-field-foot">
          <span>{hint}</span>
        </span>
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
