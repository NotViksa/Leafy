import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { createPost } from "../api/posts";
import PostForm from "../components/PostForm";
import {
  EMPTY_POST,
  validatePost,
  toPayload,
} from "../lib/postForm";
import { profileName, profileAvatar } from "../lib/profile";

export default function Create() {
  const { user, accessToken } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_POST);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    const found = validatePost(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const created = await createPost(
        toPayload(form, profileName(user), profileAvatar(user)),
        accessToken
      );
      if (!created) throw new Error("Could not publish entry.");
      notify("Entry published.");
      navigate(`/feed/${created.id}`, { replace: true });
    } catch (err) {
      setApiError(err.message || "Could not create post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PostForm
      pageTitle="New entry"
      form={form}
      errors={errors}
      apiError={apiError}
      submitting={submitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Publish entry"
      submittingLabel="Publishing…"
      cancelTo="/feed"
      cancelLabel="Cancel"
    />
  );
}