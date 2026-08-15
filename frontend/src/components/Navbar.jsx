import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to sign out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#16241C',
      confirmButtonColor: '#2F9E68',
      cancelButtonColor: '#DDEFE3',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-4',
        confirmButton: 'fw-semibold px-4 py-2',
        cancelButton: 'fw-semibold px-4 py-2 text-dark'
      }
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Logged out successfully',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        background: '#ffffff',
        color: '#16241C'
      });

      navigate('/login');
    }
  };

  // Don't render navbar on public pages
  if (!token) {
    return null;
  }

  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN');

  const getNavClass = (path) =>
    `nav-link fs-6 px-3 py-2 rounded-3 transition fw-semibold ${
      location.pathname === path
        ? 'active-nav-link'
        : 'inactive-nav-link'
    }`;

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        minHeight: '80px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #DDEFE3'
      }}
    >
      <style>{`
        .active-nav-link { color: #1E6B45 !important; background-color: #EAF6EE; }
        .inactive-nav-link { color: #5B6D62 !important; }
        .inactive-nav-link:hover { color: #1E6B45 !important; background-color: #F5FBF7; }
      `}</style>
      <div className="container-fluid px-3 px-lg-5 py-2">

        {/* Brand */}
        <Link
          className="navbar-brand fw-bold me-lg-5 d-flex align-items-center gap-2"
          to={isAdmin ? '/admin-dashboard' : '/dashboard'}
          style={{ fontSize: '1.35rem' }}
        >
          <span
            className="d-flex align-items-center justify-content-center rounded-2"
            style={{ width: 32, height: 32, background: '#2F9E68' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 6 8 6 14a6 6 0 0012 0c0-6-6-12-6-12z" fill="#fff" />
            </svg>
          </span>
          <span style={{ color: '#16241C' }}>Leave Management</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ boxShadow: 'none' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">

          {/* Employee Navigation */}
          {!isAdmin && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 gap-lg-2">
              <li className="nav-item">
                <Link className={getNavClass('/dashboard')} to="/dashboard">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link className={getNavClass('/apply-leave')} to="/apply-leave">
                  Apply Leave
                </Link>
              </li>

              <li className="nav-item">
                <Link className={getNavClass('/my-leaves')} to="/my-leaves">
                  My Leaves
                </Link>
              </li>
            </ul>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 gap-lg-2">
              <li className="nav-item">
                <Link className={getNavClass('/admin-dashboard')} to="/admin-dashboard">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link className={getNavClass('/admin-leaves')} to="/admin-leaves">
                  All Leave Requests
                </Link>
              </li>

              <li className="nav-item">
                <Link className={getNavClass('/admin-employees')} to="/admin-employees">
                  All Employees
                </Link>
              </li>
            </ul>
          )}

          {/* User Info + Logout */}
          <div className="d-flex align-items-center gap-3 ms-auto mt-3 mt-lg-0 py-1 flex-wrap justify-content-end">

            {user && (
              <div className="text-end d-none d-md-block me-1">
                <div className="fw-semibold" style={{ color: '#16241C', fontSize: '0.95rem' }}>
                  {user.name}
                </div>

                <span
                  className="badge mt-1 fw-semibold"
                  style={{
                    backgroundColor: isAdmin ? '#EFF3FE' : '#F5FBF7',
                    color: isAdmin ? '#3457D5' : '#5B6D62',
                    border: isAdmin ? 'none' : '1px solid #DDEFE3',
                    fontSize: '0.7rem',
                    padding: '5px 10px',
                    borderRadius: '999px'
                  }}
                >
                  {isAdmin ? 'Admin' : 'Employee'}
                </span>
              </div>
            )}

            <button
              className="btn fw-semibold px-4 py-2 border-0"
              onClick={handleLogout}
              id="logout-btn"
              style={{
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #2F9E68, #1E6B45)',
                color: '#FFFFFF',
                minWidth: '100px'
              }}
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
