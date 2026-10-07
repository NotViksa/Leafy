import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await signIn(form.email.trim(), form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" noValidate>
      <h1>Welcome back</h1>

      {apiError && <p className="form-error">{apiError}</p>}

      <label>
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </label>
      {errors.email && <span className="field-error">{errors.email}</span>}

      <label>
        Password
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
      </label>
      {errors.password && <span className="field-error">{errors.password}</span>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </button>

      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
        No account? <Link to="/register">Create one</Link>
      </p>
    </form>
  );
}