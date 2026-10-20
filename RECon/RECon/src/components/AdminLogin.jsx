import { useState } from 'react';
import './AdminLogin.css';
import logo from '../assets/RECon-Logo.png';

const EyeIcon = ({ closed }) => (
  <svg viewBox="0 0 22 15" width="22" height="15" fill="none" aria-hidden="true">
    <path d="M1 7.5S4.8 1.5 11 1.5 21 7.5 21 7.5 17.2 13.5 11 13.5 1 7.5 1 7.5Z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="11" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    {closed && <line x1="2" y1="13" x2="20" y2="2" stroke="currentColor" strokeWidth="1.3" />}
  </svg>
);

const UserIcon = () => (
  <svg className="field__icon" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const LockIcon = () => (
  <svg className="field__icon" viewBox="0 0 16 21" width="16" height="21" fill="none" aria-hidden="true">
    <rect x="2" y="9" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Swap this out for your real auth call.
async function loginRequest(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password.length < 4) {
        reject(new Error('Incorrect username or password.'));
      } else {
        resolve({ username });
      }
    }, 700);
  });
}

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Enter both a username and password to continue.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginRequest(username.trim(), password);
      onLoginSuccess?.(result, remember);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="bg-blob bg-blob--top" aria-hidden="true" />
      <div className="bg-blob bg-blob--bottom" aria-hidden="true" />
      <div className="bg-ring bg-ring--a" aria-hidden="true" />
      <div className="bg-ring bg-ring--b" aria-hidden="true" />

      <main className="page">
        <header className="brand">
          <div className="brand__logo" aria-hidden="true">
  <img src={logo} alt="" className="brand__logo-img" />
        </div>
          <p className="brand__eyebrow">Administrative Access</p>
        </header>

        <section className="card" aria-labelledby="login-heading">
          <div className="card__intro">
            <h1 id="login-heading" className="card__title">Welcome Back</h1>
            <p className="card__subtitle">Secure login for the Smart Bin Network</p>
          </div>

          <form className="form" noValidate onSubmit={handleSubmit}>
            <div className="field">
              <label className="field__label" htmlFor="username">Username</label>
              <div className="field__control">
                <UserIcon />
                <input
                  className="field__input"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Admin Identifier"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="password">Password</label>
              <div className="field__control">
                <LockIcon />
                <input
                  className="field__input field__input--toggle"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="field__toggle"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <EyeIcon closed={showPassword} />
                </button>
              </div>
            </div>

            <div className="form__row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="checkbox__box" aria-hidden="true" />
                <span className="checkbox__label">Remember device</span>
              </label>
              <a className="link" href="#forgot">Forgot?</a>
            </div>

            {error && (
              <p className="form__error" role="alert">{error}</p>
            )}

            <button className="submit" type="submit" disabled={loading}>
              <span className="submit__label">{loading ? 'Signing in…' : 'Login'}</span>
              {!loading && <ArrowIcon />}
            </button>
          </form>
        </section>

        <footer className="footer">
          <div className="status">
            <span className="status__dot" aria-hidden="true" />
            <span>Server Online</span>
          </div>
          <p className="footer__note">
            Authorized personnel only. All access and<br />
            modifications are logged via the secure audit trail.
          </p>
        </footer>
      </main>
    </div>
  );
}