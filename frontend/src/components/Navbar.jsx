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
      background: '#151515',
      color: '#F5F5F5',
      confirmButtonColor: '#FFD400',
      cancelButtonColor: '#2A2A2A',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-4',
        confirmButton: 'fw-semibold px-4 py-2',
        cancelButton: 'fw-semibold px-4 py-2'
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
        background: '#151515',
        color: '#F5F5F5'
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
    `nav-link fs-5 px-3 py-3 rounded-3 transition ${
      location.pathname === path
        ? 'fw-bold text-warning bg-dark'
        : 'text-white-50'
    }`;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-lg"
      style={{
        minHeight: '92px',
        backgroundColor: '#151515',
        borderBottom: '1px solid #2A2A2A'
      }}
    >
      <div className="container-fluid px-4 px-lg-5 py-3">

        {/* Brand */}
        <Link
          className="navbar-brand fw-bold me-lg-5 d-flex align-items-center gap-3"
          to={isAdmin ? '/admin-dashboard' : '/dashboard'}
          style={{ fontSize: '1.75rem' }}
        >
          <span
            style={{
              width: '18px',
              height: '28px',
              border: '3px solid #FFD400',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span className="text-white">Leave Management</span>
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 gap-lg-3">
              <li className="nav-item">
                <Link className={getNavClass('/dashboard')} to="/dashboard">
                  📋 Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link className={getNavClass('/apply-leave')} to="/apply-leave">
                  ➕ Apply Leave
                </Link>
              </li>

              <li className="nav-item">
                <Link className={getNavClass('/my-leaves')} to="/my-leaves">
                  📄 My Leaves
                </Link>
              </li>
            </ul>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 gap-lg-3">
              <li className="nav-item">
                <Link className={getNavClass('/admin-dashboard')} to="/admin-dashboard">
                  📊 Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link className={getNavClass('/admin-leaves')} to="/admin-leaves">
                  📋 All Leave Requests
                </Link>
              </li>

              <li className="nav-item">
                <Link className={getNavClass('/admin-employees')} to="/admin-employees">
                  👥 All Employees
                </Link>
              </li>
            </ul>
          )}

          {/* User Info + Logout */}
          <div className="d-flex align-items-center gap-4 ms-auto mt-3 mt-lg-0 py-1 flex-wrap justify-content-end">

            {user && (
              <div className="text-end d-none d-md-block me-2">
                <div className="fw-semibold text-white fs-5">
                  {user.name}
                </div>

                <span
                  className="badge mt-1"
                  style={{
                    backgroundColor: isAdmin ? '#FFD400' : '#2A2A2A',
                    color: isAdmin ? '#111111' : '#F5F5F5',
                    fontSize: '0.75rem',
                    padding: '6px 10px',
                    borderRadius: '8px'
                  }}
                >
                  {isAdmin ? 'ADMIN' : 'EMPLOYEE'}
                </span>
              </div>
            )}

            <button
              className="btn fw-semibold fs-6 px-4 py-3"
              onClick={handleLogout}
              id="logout-btn"
              style={{
                borderRadius: '12px',
                backgroundColor: '#FFD400',
                border: '1px solid #FFD400',
                color: '#111111',
                minWidth: '110px'
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