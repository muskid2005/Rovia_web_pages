import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './reset-password.css';

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || '').trim();

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') || '').trim();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!token) {
      setStatus({
        type: 'error',
        message: 'Reset token is missing. Please open the latest link from your email.',
      });
      return;
    }

    if (!API_BASE_URL) {
      setStatus({
        type: 'error',
        message: 'API URL is not configured. Add VITE_API_BASE_URL to your .env file and restart the dev server.',
      });
      return;
    }

    if (!password || password.length < 8) {
      setStatus({
        type: 'error',
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match.',
      });
      return;
    }

    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL.replace(/\/+$/, '')}/auth/reset-password`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        setStatus({
          type: 'error',
          message:
            data?.message ||
            'Could not reset password. The link may have expired or already been used.',
        });
        return;
      }

      setCompleted(true);
      setStatus({
        type: 'success',
        message:
          data?.message ||
          'Your password has been reset. You can now return to the Rovia app and log in.',
      });
      setPassword('');
      setConfirmPassword('');
    } catch {
      setStatus({
        type: 'error',
        message:
          'Network error. Check that your backend is running and allows requests from this origin (CORS).',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="rp-page">
      <section className="rp-card" aria-labelledby="rp-title">
        <div className="rp-header">
          <h1 id="rp-title" className="rp-title">
            Reset Password
          </h1>
          <p className="rp-subtitle">
            Enter your new password below. Once updated, all active sessions will
            be signed out and you can log in back in the Rovia app.
          </p>
        </div>

        {!token && !completed && (
          <div className="rp-alert rp-alert--error" role="alert">
            No reset token found in this link. Please request a new password
            reset link from the app.
          </div>
        )}

        {status.message && (
          <div
            className={`rp-alert ${
              status.type === 'success' ? 'rp-alert--success' : 'rp-alert--error'
            }`}
            role="alert"
          >
            {status.message}
          </div>
        )}

        {!completed ? (
          <form className="rp-form" onSubmit={handleSubmit} noValidate>
            <div className="rp-field">
              <label htmlFor="new-password" className="rp-label">
                New Password
              </label>
              <div className="rp-input-wrap">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  className="rp-input"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || !token}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="rp-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="rp-field">
              <label htmlFor="confirm-password" className="rp-label">
                Confirm New Password
              </label>
              <div className="rp-input-wrap">
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="rp-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || !token}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rp-submit"
              disabled={loading || !token}
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div className="rp-done-box">
            <p className="rp-done-text">
              Open the <strong>Rovia</strong> app on your device and sign in with
              your new password.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}