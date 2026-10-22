import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import ProfilePreview from "./ProfilePreview";
import { FormField } from "./FormElements";

const MAX_NAME = 40;

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const notify = useToast();
  const [name, setName] = useState(user?.user_metadata?.display_name ?? "");
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url ?? "");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  function change(setter, field) {
    return (e) => {
      setter(e.target.value);
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
      next.name = `Display name must be ${MAX_NAME} characters or fewer.`;

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
      notify("Profile saved.");
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
      </header>

      <div className="editor-grid">
        <form onSubmit={handleSubmit} className="editor-form" noValidate>
          {apiError && <p className="form-error" role="alert">{apiError}</p>}

          <section className="editor-section">
            <FormField
              id="profile-name"
              label="Display name"
              value={name}
              onChange={change(setName, "name")}
              error={errors.name}
            />
            <FormField
              id="profile-avatar"
              label="Avatar URL"
              value={avatar}
              onChange={change(setAvatar, "avatar")}
              error={errors.avatar}
            />
          </section>

          <div className="editor-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>

        <ProfilePreview name={name} avatar={avatar} />
      </div>
    </div>
  );
}
