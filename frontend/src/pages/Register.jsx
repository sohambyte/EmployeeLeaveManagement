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

    api.post('http://localhost:8080/api/auth/register', payload)
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

  return (
    <div
      className="d-flex align-items-center justify-content-center py-4"
      style={{ minHeight: '100vh', backgroundColor: '#0B0B0B' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">

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
                Create your account to get started
              </p>
            </div>

            {/* Register Card */}
            <div
              className="card border-0 shadow-lg"
              style={{
                backgroundColor: '#151515',
                borderRadius: '22px',
                border: '1px solid #2A2A2A'
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
                  Create Account
                </h2>

                <p className="text-secondary mb-5" style={{ fontSize: '1rem' }}>
                  Fill in your details below
                </p>

                {error && (
                  <div
                    className="alert border-0 d-flex align-items-center mb-4"
                    role="alert"
                    style={{
                      backgroundColor: '#2A1616',
                      color: '#FFB4B4',
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
                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                      htmlFor="reg-name"
                    >
                      Full Name
                    </label>

                    <input
                      id="reg-name"
                      type="text"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      placeholder="John Doe"
                      value={name}
                      onChange={handleNameChange}
                      required
                      style={{
                        borderRadius: '12px',
                        padding: '18px 18px',
                        backgroundColor: '#1C1C1C',
                        borderColor: '#2A2A2A',
                        fontSize: '1.05rem',
                        minHeight: '60px'
                      }}
                    />
                    {nameError && (
                      <div className="text-danger mt-2 small fw-semibold">
                        {nameError}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                      htmlFor="reg-email"
                    >
                      Email Address
                    </label>

                    <input
                      id="reg-email"
                      type="email"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      placeholder="name@company.com"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      style={{
                        borderRadius: '12px',
                        padding: '18px 18px',
                        backgroundColor: '#1C1C1C',
                        borderColor: '#2A2A2A',
                        fontSize: '1.05rem',
                        minHeight: '60px'
                      }}
                    />
                    {emailError && (
                      <div className="text-danger mt-2 small fw-semibold">
                        {emailError}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                      htmlFor="reg-password"
                    >
                      Password
                    </label>

                    <input
                      id="reg-password"
                      type="password"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        borderRadius: '12px',
                        padding: '18px 18px',
                        backgroundColor: '#1C1C1C',
                        borderColor: '#2A2A2A',
                        fontSize: '1.05rem',
                        minHeight: '60px'
                      }}
                    />
                  </div>

                  {/* Role */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                      htmlFor="reg-role"
                    >
                      Role
                    </label>

                    <select
                      id="reg-role"
                      className="form-select form-select-lg bg-dark text-white border-secondary"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setAdminCode('');
                      }}
                      style={{
                        borderRadius: '12px',
                        padding: '18px 18px',
                        backgroundColor: '#1C1C1C',
                        borderColor: '#2A2A2A',
                        fontSize: '1.05rem',
                        minHeight: '60px'
                      }}
                    >
                      <option value="ROLE_EMPLOYEE">Employee</option>
                      <option value="ROLE_ADMIN">Admin</option>
                    </select>
                  </div>

                  {/* Admin Code */}
                  {isAdminSelected && (
                    <div className="mb-4">
                      <label
                        className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                        htmlFor="reg-admin-code"
                      >
                        Admin Code
                      </label>

                      <input
                        id="reg-admin-code"
                        type="password"
                        className="form-control form-control-lg bg-dark text-white border-secondary"
                        placeholder="Enter admin registration code"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        required={isAdminSelected}
                        autoComplete="off"
                        style={{
                          borderRadius: '12px',
                          padding: '18px 18px',
                          backgroundColor: '#1C1C1C',
                          borderColor: '#2A2A2A',
                          fontSize: '1.05rem',
                          minHeight: '60px'
                        }}
                      />

                      <div className="mt-2" style={{ color: '#FFD400', fontSize: '0.85rem' }}>
                        Admin code is provided by the core team and verified securely on the server.
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-semibold mt-2"
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
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                </form>

                {/* Footer */}
                <div className="text-center mt-5 pt-4 border-top border-secondary">
                  <p className="mb-0 text-secondary" style={{ fontSize: '0.95rem' }}>
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="fw-semibold text-decoration-none"
                      style={{ color: '#FFD400' }}
                    >
                      Login here
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

export default Register;