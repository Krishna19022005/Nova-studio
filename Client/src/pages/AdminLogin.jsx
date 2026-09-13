import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminBg from "../assets/adminBg.png";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!loginId.trim() || !password.trim()) {
      setError("Please enter Login ID and Password.");
      return;
    }

    try {
      setLoading(true);

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${API_URL}/api/admin/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loginId: loginId.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid Login ID or Password."
        );
      }

      // Save authentication token
      localStorage.setItem(
        "nova_admin_token",
        data.token
      );

      // Save admin information
      if (data.admin) {
        localStorage.setItem(
          "nova_admin",
          JSON.stringify(data.admin)
        );
      }

      // Navigate to dashboard
      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="admin-login"
      style={{
        "--admin-bg": `url(${adminBg})`,
      }}
    >
      {/* ================= HERO ================= */}
      <section className="admin-login__hero">
        <div className="admin-login__hero-overlay" />

        <div className="admin-login__hero-content">
          {/* Brand */}
          <div className="admin-login__brand">
            <h1>NOVA</h1>
            <span>FLOORING STUDIO</span>
          </div>

          {/* Top Line */}
          <div className="admin-login__hero-topline">
            <span>FLOORS</span>
            <span>SPACES</span>
            <span>BETTER LIVING</span>
            <i />
          </div>

          {/* Hero Content */}
          <div className="admin-login__hero-copy">
            <p className="admin-login__eyebrow">
              ADMIN PORTAL
            </p>

            <h2>
              Built on
              <br />
              Solid Foundations
            </h2>

            <p>
              Manage your world of designs, projects and
              <br className="desktop-only" />
              possibilities.
            </p>
          </div>

          {/* Hero Footer */}
          <div className="admin-login__hero-footer">
            <i />

            <span>
              PREMIUM FLOORING
              <br />
              FOR A BRIGHTER TOMORROW
            </span>
          </div>
        </div>
      </section>

      {/* ================= LOGIN PANEL ================= */}
      <section className="admin-login__panel">
        <div className="admin-login__panel-inner">
          {/* Mobile Brand */}
          <div className="admin-login__mobile-brand">
            <div className="admin-login__brand">
              <h1>NOVA</h1>
              <span>FLOORING STUDIO</span>
            </div>

            <i />

            <p>
              FLOORS &nbsp;|&nbsp; SPACES &nbsp;|&nbsp; BETTER LIVING
            </p>
          </div>

          {/* Form Header */}
          <div className="admin-login__form-header">
            <div className="admin-login__desktop-brand">
              <div className="admin-login__brand">
                <h1>NOVA</h1>
                <span>FLOORING STUDIO</span>
              </div>
            </div>

            <p className="admin-login__form-eyebrow">
              ADMIN LOGIN
            </p>

            <h2>Welcome Back</h2>

            <p>Access your NOVA admin portal</p>
          </div>

          {/* Login Form */}
          <form
            className="admin-login__form"
            onSubmit={handleSubmit}
          >
            {/* Login ID */}
            <div className="admin-login__field">
              <span className="admin-login__field-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                  />
                  <path d="M4 20c0-4 3.2-6 8-6s8 2 8 6" />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div className="admin-login__field">
              <span className="admin-login__field-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="admin-login__password-toggle"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.5 5 8.5 5a14.2 14.2 0 0 1-3.1 3.4" />
                    <path d="M6.2 6.2C3.9 7.8 2.5 10 2.5 10s3.3 5 9.5 5c1 0 2-.2 2.8-.4" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z" />
                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="admin-login__error">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="admin-login__submit"
              disabled={loading}
            >
              <span>
                {loading ? "Logging in..." : "Login"}
              </span>

              <span className="admin-login__submit-arrow">
                →
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="admin-login__footer">
            <i />

            <p>
              DESIGNS TODAY
              <br />
              FOR BRIGHTER TOMORROWS
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;