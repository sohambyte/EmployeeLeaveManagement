import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    api.get('http://localhost:8080/api/leaves', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setLeaves(response.data || []);
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        setError('Could not load your leave data.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Compute stats from the employee's own leaves
  const total = leaves.length;
  const pending = leaves.filter((l) => l.status === 'PENDING').length;
  const approved = leaves.filter((l) => l.status === 'APPROVED').length;
  const rejected = leaves.filter((l) => l.status === 'REJECTED').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge bg-success">APPROVED</span>;
      case 'REJECTED':
        return <span className="badge bg-danger">REJECTED</span>;
      default:
        return (
          <span className="badge" style={{ background: '#FFD700', color: '#000' }}>
            PENDING
          </span>
        );
    }
  };

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{ background: '#0f0f0f', minHeight: '100vh' }}
    >

      {/* Welcome Banner */}
      <div
        className="rounded-3 p-4 mb-4 text-white"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          border: '1px solid #2a2a2a'
        }}
      >
        <div className="row align-items-center">
          <div className="col">
            <h2 className="fw-bold mb-1">
              👋 Welcome, {user ? user.name : 'Employee'}!
            </h2>

            <p className="mb-0" style={{ color: '#cfcfcf' }}>
              Manage your leave requests easily from this dashboard.
            </p>
          </div>

          <div className="col-auto d-flex gap-2">
            <Link
              to="/apply-leave"
              className="btn fw-semibold px-4 text-decoration-none"
              style={{
                background: '#FFD700',
                color: '#000',
                border: 'none'
              }}
            >
              ➕ Apply Leave
            </Link>

            <Link
              to="/my-leaves"
              className="btn fw-semibold px-4 text-decoration-none"
              style={{
                background: 'transparent',
                color: '#FFD700',
                border: '2px solid #FFD700'
              }}
            >
              📄 My Leaves
            </Link>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          ⚠️ {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Stats Cards */}
      {loading ? (
        <div className="text-center my-5">
          <div
            className="spinner-border"
            role="status"
            style={{ width: '3rem', height: '3rem', color: '#FFD700' }}
          ></div>

          <p className="mt-3 fs-5" style={{ color: '#FFD700' }}>
            Loading your leave summary...
          </p>
        </div>
      ) : (
        <>

          {/* Recent Leave Requests */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#FFD700' }}>
              My Recent Leave Requests
            </h5>
          </div>

          {leaves.length === 0 ? (
            <div
              className="card border-0 shadow-sm text-center p-5"
              style={{
                borderRadius: '12px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #2a2a2a'
              }}
            >
              <div className="mb-3" style={{ fontSize: '3rem', color: '#FFD700' }}>📋</div>

              <h5 style={{ color: '#FFD700' }}>No leave requests yet</h5>

              <p className="mb-3" style={{ color: '#131212' }}>
                Apply for your first leave to get started.
              </p>

              <div>
                <Link
                  to="/apply-leave"
                  className="btn px-4 text-decoration-none"
                  style={{
                    background: '#FFD700',
                    color: '#000',
                    border: 'none'
                  }}
                >
                  ➕ Apply for Leave
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: '12px',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a'
              }}
            >
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#FFD700' }}>
                    <tr>
                      <th className="ps-4 text-dark fw-bold">Leave Type</th>
                      <th className="text-dark fw-bold">From</th>
                      <th className="text-dark fw-bold">To</th>
                      <th className="text-dark fw-bold">Reason</th>
                      <th className="pe-4 text-dark fw-bold">Status</th>
                    </tr>
                  </thead>

                  <tbody style={{ color: '#0b0a0a' }}>
                    {leaves.slice(0, 5).map((leave) => (
                      <tr key={leave.id}>
                        <td className="ps-4 fw-semibold text-black">{leave.leaveType}</td>

                        <td className="text-black">{leave.fromDate}</td>

                        <td className="text-black">{leave.toDate}</td>

                        <td style={{ maxWidth: '220px' }}>
                          <span className="text-truncate d-block" style={{ color: '#0d0c0c' }}>
                            {leave.reason}
                          </span>
                        </td>

                        <td className="pe-4">{getStatusBadge(leave.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leaves.length > 5 && (
                <div className="card-footer text-center bg-transparent border-0 py-3">
                  <Link
                    to="/my-leaves"
                    className="btn btn-link fw-semibold text-decoration-none"
                    style={{ color: '#FFD700' }}
                  >
                    View all {leaves.length} requests →
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;