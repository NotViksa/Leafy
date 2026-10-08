import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPostById, updatePost } from "../api/posts";
import PostForm from "../components/PostForm";
import { EMPTY_POST, validatePost, toPayload, fromPost } from "../lib/postForm";

export default function Edit() {
  const { postId } = useParams();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_POST);
  const [authorName, setAuthorName] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getPostById(postId, controller.signal)
      .then((post) => {
        if (!post) return setApiError("Post not found.");
        if (user && post.owner_id !== user.id)
          return setApiError("You can only edit your own posts.");
        setForm(fromPost(post));
        setAuthorName(post.author_name);
        setReady(true);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setApiError(err.message || "Could not load post");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [postId, user]);

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
      await updatePost(postId, toPayload(form, authorName), accessToken);
      navigate(`/feed/${postId}`, { replace: true });
    } catch (err) {
      setApiError(err.message || "Could not update post");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="page-loading">Loading entry…</p>;

  if (!ready) {
    return (
      <div>
        <p className="form-error">{apiError || "Could not load post."}</p>
        <Link to="/feed" className="btn btn-ghost">Back to feed</Link>
      </div>
    );
  }

  return (
    <PostForm
      pageTitle="Edit entry"
      subtitle="Update your entry — changes appear immediately"
      form={form}
      errors={errors}
      apiError={apiError}
      submitting={submitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      submittingLabel="Saving…"
      cancelTo={`/feed/${postId}`}
      cancelLabel="Cancel"
    />
  );
}