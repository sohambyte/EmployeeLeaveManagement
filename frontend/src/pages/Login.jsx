import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    api.post('http://localhost:8080/api/auth/login', { email, password })
      .then((response) => {
        const { token, id, name, email: userEmail, role } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ id, name, email: userEmail, role }));

        const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';
        navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #F5FBF7 0%, #EAF6EE 100%)'
      }}
    >
      <div
        className="d-flex w-100 overflow-hidden position-relative"
        style={{
          maxWidth: '1040px',
          minHeight: '620px',
          background: '#FFFFFF',
          borderRadius: '28px',
          boxShadow: '0 30px 80px -30px rgba(18,59,39,0.25)'
        }}
      >
        {/* decorative corner dots */}
        <span
          className="d-none d-lg-block position-absolute"
          style={{ width: 20, height: 20, borderRadius: '50%', background: '#F1C9AA', top: 26, left: 26, zIndex: 2 }}
        />
        <span
          className="d-none d-lg-block position-absolute"
          style={{ width: 10, height: 10, borderRadius: '50%', background: '#63C68C', top: 56, left: 56, zIndex: 2 }}
        />

        {/* Form Column (Left) */}
        <div
          className="d-flex flex-column justify-content-center px-4 px-md-5 py-5"
          style={{ flex: '1 1 0', minWidth: 0 }}
        >
          <p
            className="fw-bold text-uppercase mb-2"
            style={{ color: '#27AE60', fontSize: '0.78rem', letterSpacing: '0.14em' }}
          >
            Welcome back
          </p>
          <h2 className="fw-bold mb-2" style={{ color: '#16241C', fontSize: '2rem' }}>
            Log in to your account
          </h2>
          <p className="mb-4" style={{ fontSize: '0.95rem', color: '#7F8C8D' }}>
            Enter your credentials to view leave balances and requests.
          </p>

          {error && (
            <div
              className="alert border-0 d-flex align-items-center mb-4"
              role="alert"
              style={{
                backgroundColor: '#FDECEA',
                color: '#C0392B',
                borderRadius: '12px',
                padding: '14px 16px'
              }}
            >
              <span className="me-2">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold small mb-2"
                htmlFor="login-email"
                style={{ color: '#16241C' }}
              >
                Email Address
              </label>

              <input
                id="login-email"
                type="email"
                className="form-control form-control-lg shadow-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderRadius: '12px',
                  padding: '13px 16px',
                  backgroundColor: '#F5FBF7',
                  border: '1.5px solid #DDEFE3',
                  color: '#16241C',
                  fontSize: '0.95rem'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#27AE60'; e.target.style.boxShadow = '0 0 0 4px rgba(39,174,96,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#DDEFE3'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold small mb-2"
                htmlFor="login-password"
                style={{ color: '#16241C' }}
              >
                Password
              </label>

              <input
                id="login-password"
                type="password"
                className="form-control form-control-lg shadow-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  borderRadius: '12px',
                  padding: '13px 16px',
                  backgroundColor: '#F5FBF7',
                  border: '1.5px solid #DDEFE3',
                  color: '#16241C',
                  fontSize: '0.95rem'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#27AE60'; e.target.style.boxShadow = '0 0 0 4px rgba(39,174,96,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#DDEFE3'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="d-flex justify-content-end mb-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  Swal.fire({
                    title: 'Forgot Password?',
                    text: 'Please contact the administrator to change or reset your password.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                  });
                }}
                style={{ color: '#1E6B45', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-lg w-100 fw-semibold border-0"
              disabled={loading}
              style={{
                borderRadius: '12px',
                padding: '13px 16px',
                background: 'linear-gradient(180deg, #2F9E68, #1E6B45)',
                color: '#FFFFFF',
                fontSize: '0.98rem',
                boxShadow: '0 12px 24px -10px rgba(30,107,69,0.55)'
              }}
            >
              {loading ? (
                <span className="d-inline-flex align-items-center justify-content-center">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                    style={{ color: '#FFFFFF' }}
                  />
                  Signing in...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #DDEFE3' }}>
            <p className="mb-0" style={{ fontSize: '0.9rem', color: '#7F8C8D' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="fw-semibold text-decoration-none"
                style={{ color: '#1E6B45' }}
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Illustration Column (Right) */}
        <div
          className="d-none d-lg-flex flex-column align-items-center justify-content-center position-relative px-4 py-5"
          style={{
            flex: '1 1 0',
            minWidth: 0,
            background: 'radial-gradient(120% 100% at 15% 0%, #EAF6EE 0%, #EAF6EE 45%, #FFFFFF 100%)'
          }}
        >
          <span
            className="position-absolute rounded-circle"
            style={{ width: 120, height: 120, background: '#63C68C', top: -40, right: -30, opacity: 0.18 }}
          />
          <span
            className="position-absolute rounded-circle"
            style={{ width: 60, height: 60, background: '#F1C9AA', bottom: 40, right: 30, opacity: 0.4 }}
          />

          <div className="position-absolute d-flex align-items-center gap-2" style={{ top: 30, right: 36 }}>
            <span
              className="d-flex align-items-center justify-content-center rounded-2"
              style={{ width: 26, height: 26, background: '#2F9E68' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 6 8 6 14a6 6 0 0012 0c0-6-6-12-6-12z" fill="#fff" />
              </svg>
            </span>
            <span className="fw-bold" style={{ fontSize: '0.9rem', color: '#16241C' }}>LeaveWise</span>
          </div>

          <svg width="100%" height="auto" viewBox="0 0 340 320" style={{ maxWidth: 320, marginTop: 30 }}>
            <ellipse cx="170" cy="290" rx="120" ry="14" fill="#1E6B45" opacity="0.08" />
            <rect x="70" y="70" width="200" height="180" rx="18" fill="#fff" stroke="#DCEBE1" strokeWidth="2" />
            <rect x="70" y="70" width="200" height="46" rx="18" fill="#2F9E68" />
            <rect x="70" y="98" width="200" height="18" fill="#2F9E68" />
            <rect x="98" y="58" width="10" height="30" rx="5" fill="#1E6B45" />
            <rect x="232" y="58" width="10" height="30" rx="5" fill="#1E6B45" />
            <g fill="#CFE9DA">
              <circle cx="100" cy="140" r="5" /><circle cx="128" cy="140" r="5" /><circle cx="156" cy="140" r="5" /><circle cx="184" cy="140" r="5" /><circle cx="212" cy="140" r="5" /><circle cx="240" cy="140" r="5" />
              <circle cx="100" cy="168" r="5" /><circle cx="128" cy="168" r="5" /><circle cx="184" cy="168" r="5" /><circle cx="212" cy="168" r="5" /><circle cx="240" cy="168" r="5" />
              <circle cx="100" cy="196" r="5" /><circle cx="128" cy="196" r="5" /><circle cx="156" cy="196" r="5" /><circle cx="212" cy="196" r="5" /><circle cx="240" cy="196" r="5" />
            </g>
            <circle cx="156" cy="168" r="12" fill="#E7A579" />
            <circle cx="184" cy="196" r="12" fill="#63C68C" />
            <circle cx="248" cy="222" r="20" fill="#1E6B45" />
            <path d="M240 222l6 6 12-13" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M90 250 C90 250 88 216 108 200" stroke="#1E6B45" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M108 200c-4-14 6-26 22-26-2 14-10 24-22 26z" fill="#63C68C" />
            <path d="M96 222c-12-6-14-22-4-32 6 12 6 24 4 32z" fill="#2F9E68" />
            <g>
              <ellipse cx="205" cy="278" rx="46" ry="8" fill="#1E6B45" opacity="0.08" />
              <path d="M182 250c0-14 10-24 24-24s24 10 24 24" fill="#F1C9AA" />
              <circle cx="206" cy="216" r="16" fill="#3A2A20" />
              <circle cx="206" cy="220" r="13" fill="#F1C9AA" />
              <rect x="186" y="248" width="40" height="30" rx="10" fill="#2F9E68" />
              <rect x="192" y="272" width="12" height="16" rx="4" fill="#1E6B45" />
              <rect x="212" y="272" width="12" height="16" rx="4" fill="#1E6B45" />
              <rect x="194" y="252" width="26" height="18" rx="2" fill="#fff" />
              <line x1="207" y1="252" x2="207" y2="270" stroke="#DCEBE1" strokeWidth="2" />
            </g>
            <path d="M60 110c8-4 16 2 16 10-8 3-16-2-16-10z" fill="#63C68C" opacity="0.8" />
            <path d="M285 150c8-4 16 2 16 10-8 3-16-2-16-10z" fill="#E7A579" opacity="0.7" />
            <circle cx="55" cy="200" r="5" fill="#63C68C" opacity="0.6" />
            <circle cx="290" cy="90" r="6" fill="#F1C9AA" opacity="0.7" />
          </svg>

          <p className="text-center mt-4 mb-0" style={{ fontSize: '0.9rem', color: '#7F8C8D', maxWidth: 260, lineHeight: 1.6 }}>
            <strong style={{ display: 'block', color: '#16241C', fontSize: '1rem', marginBottom: 6 }}>
              Time off, tracked simply.
            </strong>
            Manage team requests, track balances, and keep operations running smoothly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
