import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_EMPLOYEE');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const nameRegex = /^[A-Za-z\s]+$/;
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const isAdminSelected = role === 'ROLE_ADMIN';

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) setNameError('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNameError('');
    setEmailError('');

    let hasValidationError = false;

    if (name.trim().length < 3) {
      setNameError('Full Name must be at least 3 characters.');
      hasValidationError = true;
    } else if (!nameRegex.test(name)) {
      setNameError('Full Name can only contain letters and spaces.');
      hasValidationError = true;
    }

    if (!email.includes('@')) {
      setEmailError('Email address must contain @.');
      hasValidationError = true;
    } else if (!gmailRegex.test(email)) {
      setEmailError('Email must end with @gmail.com.');
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (isAdminSelected && adminCode.trim() === '') {
      setError('Admin code is required to register as Admin');
      return;
    }

    setLoading(true);

    const payload = { name, email, password, role, adminCode: adminCode.trim() };

    api.post('/api/auth/register', payload)
      .then((response) => {
        const { token, id, name: userName, email: userEmail, role: userRole } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ id, name: userName, email: userEmail, role: userRole }));

        const registeredAsAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';
        navigate(registeredAsAdmin ? '/admin-dashboard' : '/dashboard');
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          if (typeof err.response.data === 'object' && err.response.data.error) {
            setError(err.response.data.error);
          } else if (typeof err.response.data === 'object') {
            const firstErrKey = Object.keys(err.response.data)[0];
            setError(err.response.data[firstErrKey]);
          } else {
            setError('Registration failed. Please check your inputs.');
          }
        } else {
          setError('Registration failed. Server unreachable.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fieldStyle = {
    borderRadius: '12px',
    padding: '13px 16px',
    backgroundColor: '#F5FBF7',
    border: '1.5px solid #DDEFE3',
    color: '#16241C',
    fontSize: '0.95rem'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#27AE60';
    e.target.style.boxShadow = '0 0 0 4px rgba(39,174,96,0.12)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#DDEFE3';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #F5FBF7 0%, #EAF6EE 100%)'
      }}
    >
      <div className="w-100" style={{ maxWidth: '520px' }}>

        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
            style={{ width: 44, height: 44, background: '#2F9E68' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 6 8 6 14a6 6 0 0012 0c0-6-6-12-6-12z" fill="#fff" />
            </svg>
          </div>
          <h3 className="fw-bold mb-1" style={{ color: '#16241C' }}>
            Employee Leave Management
          </h3>
          <p className="mb-0" style={{ fontSize: '0.95rem', color: '#7F8C8D' }}>
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <div
          className="position-relative"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #DDEFE3',
            boxShadow: '0 30px 80px -30px rgba(18,59,39,0.2)'
          }}
        >
          <span
            className="position-absolute rounded-circle"
            style={{ width: 16, height: 16, background: '#F1C9AA', top: 22, right: 26 }}
          />

          <div className="p-4 p-sm-5">
            <p
              className="fw-bold text-uppercase mb-2"
              style={{ color: '#27AE60', fontSize: '0.78rem', letterSpacing: '0.14em' }}
            >
              New account
            </p>
            <h2 className="fw-bold mb-2" style={{ color: '#16241C', fontSize: '1.75rem' }}>
              Create account
            </h2>
            <p className="mb-4" style={{ fontSize: '0.95rem', color: '#7F8C8D' }}>
              Fill in your details below
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

              {/* Full Name */}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold small mb-2"
                  htmlFor="reg-name"
                  style={{ color: '#16241C' }}
                >
                  Full Name
                </label>

                <input
                  id="reg-name"
                  type="text"
                  className="form-control form-control-lg shadow-none"
                  placeholder="John Doe"
                  value={name}
                  onChange={handleNameChange}
                  required
                  style={fieldStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {nameError && (
                  <div className="mt-2 small fw-semibold" style={{ color: '#C0392B' }}>
                    {nameError}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold small mb-2"
                  htmlFor="reg-email"
                  style={{ color: '#16241C' }}
                >
                  Email Address
                </label>

                <input
                  id="reg-email"
                  type="email"
                  className="form-control form-control-lg shadow-none"
                  placeholder="name@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  style={fieldStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {emailError && (
                  <div className="mt-2 small fw-semibold" style={{ color: '#C0392B' }}>
                    {emailError}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold small mb-2"
                  htmlFor="reg-password"
                  style={{ color: '#16241C' }}
                >
                  Password
                </label>

                <input
                  id="reg-password"
                  type="password"
                  className="form-control form-control-lg shadow-none"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={fieldStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Role */}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold small mb-2"
                  htmlFor="reg-role"
                  style={{ color: '#16241C' }}
                >
                  Role
                </label>

                <select
                  id="reg-role"
                  className="form-select form-select-lg shadow-none"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setAdminCode('');
                  }}
                  style={fieldStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="ROLE_EMPLOYEE">Employee</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>

              {/* Admin Code */}
              {isAdminSelected && (
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold small mb-2"
                    htmlFor="reg-admin-code"
                    style={{ color: '#16241C' }}
                  >
                    Admin Code
                  </label>

                  <input
                    id="reg-admin-code"
                    type="password"
                    className="form-control form-control-lg shadow-none"
                    placeholder="Enter admin registration code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required={isAdminSelected}
                    autoComplete="off"
                    style={fieldStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />

                  <div
                    className="mt-2 d-flex align-items-start gap-2"
                    style={{ color: '#B98237', fontSize: '0.82rem', background: '#FBF3E7', borderRadius: '10px', padding: '10px 12px' }}
                  >
                    <span>ℹ️</span>
                    <span>Admin code is provided by the core team and verified securely on the server.</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-lg w-100 fw-semibold border-0 mt-2"
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

            </form>

            {/* Footer */}
            <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #DDEFE3' }}>
              <p className="mb-0" style={{ fontSize: '0.9rem', color: '#7F8C8D' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="fw-semibold text-decoration-none"
                  style={{ color: '#1E6B45' }}
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
