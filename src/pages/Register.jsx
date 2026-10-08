import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
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
    else if (form.password.length < 6)
      next.password = "Password must be at least 6 characters";

    if (!form.confirm) next.confirm = "Please confirm your password";
    else if (form.confirm !== form.password)
      next.confirm = "Passwords do not match";

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
      const { needsConfirmation } = await signUp(
        form.email.trim(),
        form.password
      );
      if (needsConfirmation) {
        setApiError("Check your email to confirm your account, then log in.");
        return;
      }
      navigate("/", { replace: true });
    } catch (err) {
      setApiError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" noValidate>
      <h1>Join Leafy</h1>

      {apiError && <p className="form-error">{apiError}</p>}

      <div className="form-field">
        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {errors.password && (
          <span className="field-error">{errors.password}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="reg-confirm">Confirm password</label>
        <input
          id="reg-confirm"
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {errors.confirm && <span className="field-error">{errors.confirm}</span>}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={submitting}
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <p className="form-foot">
        Already a member? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}