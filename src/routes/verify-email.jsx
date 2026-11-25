import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './verify-email.css';

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || '').trim();

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') || '').trim();

  const [state, setState] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    let active = true;

    async function verify() {
      if (!token) {
        if (!active) return;
        setState('error');
        setMessage(
          'Verification token is missing. Please open the latest link from your email.'
        );
        return;
      }

      if (!API_BASE_URL) {
        if (!active) return;
        setState('error');
        setMessage(
          'API URL is not configured. Please set VITE_API_BASE_URL and redeploy.'
        );
        return;
      }

      setState('verifying');
      setMessage('Verifying your email address...');

      try {
        const endpoint = `${API_BASE_URL.replace(/\/+$/, '')}/auth/verify-email`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json().catch(() => ({}));
        if (!active) return;

        if (!response.ok || data?.success === false) {
          setState('error');
          setMessage(
            data?.message ||
              'This verification link is invalid or has expired. Request a new link in the app.'
          );
          return;
        }

        setState('success');
        setMessage(
          data?.message ||
            'Email verified successfully! You can now return to the Rovia app and log in.'
        );
      } catch {
        if (!active) return;
        setState('error');
        setMessage(
          'Network error while verifying your email. Please check your connection and try again.'
        );
      }
    }

    verify();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main className="ve-page">
      <section className="ve-card" aria-labelledby="ve-title">
        <div
          className={`ve-badge ve-badge--${state}`}
          aria-hidden="true"
        >
          {state === 'verifying' && <span className="ve-spinner" />}
          {state === 'success' && <span>✓</span>}
          {state === 'error' && <span>!</span>}
        </div>

        <h1 id="ve-title" className="ve-title">
          {state === 'verifying' && 'Verifying Email'}
          {state === 'success' && 'Email Verified'}
          {state === 'error' && 'Verification Failed'}
        </h1>

        <p className={`ve-message ve-message--${state}`}>{message}</p>

        {state === 'success' && (
          <div className="ve-box">
            <p className="ve-box-text">
              Your account is ready. Open the <strong>Rovia</strong> app on your
              device and sign in.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="ve-box">
            <p className="ve-box-text">
              Return to the <strong>Rovia</strong> app to request a fresh
              verification email.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}