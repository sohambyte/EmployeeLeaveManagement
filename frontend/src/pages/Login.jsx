import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

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
      className="d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b0b0b'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5">

            {/* Brand Header */}
            <div className="text-center mb-5">
              <div
                className="mx-auto mb-4"
                style={{
                  width: '36px',
                  height: '64px',
                  border: '4px solid #FFD400',
                  borderRadius: '2px'
                }}
              />

              <h3 className="text-white fw-bold mb-2">
                Employee Leave Management
              </h3>

              <p className="text-secondary mb-0" style={{ fontSize: '1rem' }}>
                Sign in to your account
              </p>
            </div>

            {/* Login Card */}
            <div
              className="card border-0 shadow-lg"
              style={{
                backgroundColor: '#151515',
                borderRadius: '22px',
                border: '1px solid #2a2a2a'
              }}
            >
              <div className="card-body p-5">

                <div
                  className="mb-4"
                  style={{
                    width: '72px',
                    height: '5px',
                    backgroundColor: '#FFD400',
                    borderRadius: '3px'
                  }}
                />

                <h2 className="fw-bold mb-2 text-white">
                  Welcome back
                </h2>

                <p className="text-secondary mb-5" style={{ fontSize: '1rem' }}>
                  Enter your credentials to continue
                </p>

                {error && (
                  <div
                    className="alert border-0 d-flex align-items-center mb-4"
                    role="alert"
                    style={{
                      backgroundColor: '#2a1616',
                      color: '#ffb4b4',
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
                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                      htmlFor="login-email"
                    >
                      Email Address
                    </label>

                    <input
                      id="login-email"
                      type="email"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        borderRadius: '12px',
                        padding: '18px 18px',
                        backgroundColor: '#1c1c1c',
                        borderColor: '#2a2a2a',
                        fontSize: '1.05rem',
                        minHeight: '60px'
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-5">
                    <label
                      className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                      htmlFor="login-password"
                    >
                      Password
                    </label>

                    <input
                      id="login-password"
                      type="password"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        borderRadius: '12px',
                        padding: '18px 18px',
                        backgroundColor: '#1c1c1c',
                        borderColor: '#2a2a2a',
                        fontSize: '1.05rem',
                        minHeight: '60px'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-semibold"
                    disabled={loading}
                    style={{
                      borderRadius: '12px',
                      padding: '18px 18px',
                      backgroundColor: '#FFD400',
                      borderColor: '#FFD400',
                      color: '#111111',
                      fontSize: '1.05rem',
                      minHeight: '60px'
                    }}
                  >
                    {loading ? (
                      <span className="d-inline-flex align-items-center justify-content-center">
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                          style={{ color: '#111111' }}
                        />
                        Signing in...
                      </span>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-5 pt-4 border-top border-secondary">
                  <p className="mb-0 text-secondary" style={{ fontSize: '0.95rem' }}>
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="fw-semibold text-decoration-none"
                      style={{ color: '#FFD400' }}
                    >
                      Register here
                    </Link>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;