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
        return (
          <span
            className="badge fw-semibold"
            style={{ background: '#E9F8EE', color: '#1E6B45', padding: '6px 12px', borderRadius: '999px' }}
          >
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span
            className="badge fw-semibold"
            style={{ background: '#FDECEA', color: '#C0392B', padding: '6px 12px', borderRadius: '999px' }}
          >
            Rejected
          </span>
        );
      default:
        return (
          <span
            className="badge fw-semibold"
            style={{ background: '#FBF3E7', color: '#B98237', padding: '6px 12px', borderRadius: '999px' }}
          >
            Pending
          </span>
        );
    }
  };

  const statCards = [
    { label: 'Total requests', value: total, color: '#16241C', bg: '#F5FBF7' },
    { label: 'Pending', value: pending, color: '#B98237', bg: '#FBF3E7' },
    { label: 'Approved', value: approved, color: '#1E6B45', bg: '#E9F8EE' },
    { label: 'Rejected', value: rejected, color: '#C0392B', bg: '#FDECEA' }
  ];

  return (
    <div
      className="container-fluid px-3 px-md-4 py-4"
      style={{ background: 'linear-gradient(160deg, #F5FBF7 0%, #EAF6EE 100%)', minHeight: '100vh' }}
    >

      {/* Welcome Banner */}
      <div
        className="rounded-4 p-4 mb-4 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2F9E68 0%, #1E6B45 100%)',
          boxShadow: '0 20px 50px -20px rgba(30,107,69,0.5)'
        }}
      >
        <span
          className="position-absolute rounded-circle"
          style={{ width: 140, height: 140, background: '#63C68C', opacity: 0.18, top: -50, right: -30 }}
        />
        <div className="row align-items-center g-3 position-relative">
          <div className="col-12 col-md">
            <h2 className="fw-bold mb-1 text-white">
              Welcome, {user ? user.name : 'Employee'}
            </h2>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Manage your leave requests easily from this dashboard.
            </p>
          </div>

          <div className="col-12 col-md-auto d-flex gap-2 flex-wrap">
            <Link
              to="/apply-leave"
              className="btn fw-semibold px-4 text-decoration-none border-0"
              style={{ background: '#FFFFFF', color: '#1E6B45', borderRadius: '12px' }}
            >
              + Apply Leave
            </Link>

            <Link
              to="/my-leaves"
              className="btn fw-semibold px-4 text-decoration-none"
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255,255,255,0.6)',
                borderRadius: '12px'
              }}
            >
              My Leaves
            </Link>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="alert d-flex align-items-center justify-content-between border-0 mb-4"
          role="alert"
          style={{ background: '#FDECEA', color: '#C0392B', borderRadius: '12px', padding: '14px 18px' }}
        >
          <span>⚠️ {error}</span>
          <button
            type="button"
            className="btn-close"
            style={{ filter: 'none' }}
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div
            className="spinner-border"
            role="status"
            style={{ width: '3rem', height: '3rem', color: '#2F9E68' }}
          ></div>

          <p className="mt-3 fs-6 fw-semibold" style={{ color: '#1E6B45' }}>
            Loading your leave summary...
          </p>
        </div>
      ) : (
        <>
          {/* Stat cards (from existing computed totals) */}
          <div className="row g-3 mb-4">
            {statCards.map((s) => (
              <div className="col-6 col-lg-3" key={s.label}>
                <div
                  className="h-100 p-3 p-md-4 rounded-4"
                  style={{ background: s.bg, border: '1px solid #DDEFE3' }}
                >
                  <div className="fw-bold" style={{ fontSize: '1.9rem', color: s.color }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#7F8C8D' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Leave Requests */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#16241C' }}>
              My recent leave requests
            </h5>
          </div>

          {leaves.length === 0 ? (
            <div
              className="text-center p-5"
              style={{
                borderRadius: '20px',
                background: '#FFFFFF',
                border: '1px solid #DDEFE3'
              }}
            >
              <div className="mb-3" style={{ fontSize: '2.6rem' }}>📋</div>

              <h5 className="fw-bold" style={{ color: '#16241C' }}>No leave requests yet</h5>

              <p className="mb-3" style={{ color: '#7F8C8D' }}>
                Apply for your first leave to get started.
              </p>

              <div>
                <Link
                  to="/apply-leave"
                  className="btn px-4 text-decoration-none fw-semibold border-0"
                  style={{
                    background: 'linear-gradient(180deg, #2F9E68, #1E6B45)',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '10px 20px'
                  }}
                >
                  + Apply for Leave
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="overflow-hidden"
              style={{
                borderRadius: '20px',
                background: '#FFFFFF',
                border: '1px solid #DDEFE3'
              }}
            >
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#F5FBF7' }}>
                    <tr>
                      <th className="ps-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Leave Type</th>
                      <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>From</th>
                      <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>To</th>
                      <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Reason</th>
                      <th className="pe-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.slice(0, 5).map((leave) => (
                      <tr key={leave.id} style={{ borderColor: '#EAF2EC' }}>
                        <td className="ps-4 fw-semibold" style={{ color: '#16241C' }}>{leave.leaveType}</td>

                        <td style={{ color: '#5B6D62' }}>{leave.fromDate}</td>

                        <td style={{ color: '#5B6D62' }}>{leave.toDate}</td>

                        <td style={{ maxWidth: '220px' }}>
                          <span className="text-truncate d-block" style={{ color: '#5B6D62' }}>
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
                <div className="text-center py-3" style={{ borderTop: '1px solid #EAF2EC' }}>
                  <Link
                    to="/my-leaves"
                    className="btn btn-link fw-semibold text-decoration-none"
                    style={{ color: '#1E6B45' }}
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
