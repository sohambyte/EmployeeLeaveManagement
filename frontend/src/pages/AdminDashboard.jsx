import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function AdminDashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState('');

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  const fetchLeaves = () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    api.get('/api/admin/leaves', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setLeaves(response.data || []);
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        setError('Could not load leave requests. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchEmployees = () => {
    setEmployeesLoading(true);
    setEmployeesError('');
    const token = localStorage.getItem('token');

    api.get('/api/admin/employees', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setEmployees(response.data || []);
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        setEmployeesError('Could not load employees list.');
      })
      .finally(() => {
        setEmployeesLoading(false);
      });
  };

  const handleStatusUpdate = (id, newStatus) => {
    const token = localStorage.getItem('token');

    api.put(`/api/admin/leaves/${id}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setSuccessMsg(`Leave request #${id} has been ${newStatus.toLowerCase()}.`);
        fetchLeaves();
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to update leave status.');
        }
      });
  };

  const handleDeleteEmployee = (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    setError('');
    setSuccessMsg('');
    const token = localStorage.getItem('token');

    api.delete(`/api/admin/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setSuccessMsg(`Employee #${id} has been deleted successfully.`);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to delete employee.');
        }
      });
  };

  // Compute summary stats
  const total = leaves.length;
  const pending = leaves.filter((l) => l.status === 'PENDING').length;
  const approved = leaves.filter((l) => l.status === 'APPROVED').length;
  const rejected = leaves.filter((l) => l.status === 'REJECTED').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="badge fw-semibold" style={{ background: '#E9F8EE', color: '#1E6B45', padding: '6px 12px', borderRadius: '999px' }}>
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge fw-semibold" style={{ background: '#FDECEA', color: '#C0392B', padding: '6px 12px', borderRadius: '999px' }}>
            Rejected
          </span>
        );
      default:
        return (
          <span className="badge fw-semibold" style={{ background: '#FBF3E7', color: '#B98237', padding: '6px 12px', borderRadius: '999px' }}>
            Pending
          </span>
        );
    }
  };

  const getRoleBadge = (role) => {
    const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';
    return (
      <span
        className="badge fw-semibold"
        style={{
          background: isAdmin ? '#EFF3FE' : '#F5FBF7',
          color: isAdmin ? '#3457D5' : '#5B6D62',
          padding: '5px 10px',
          borderRadius: '999px',
          fontSize: '0.75rem'
        }}
      >
        {isAdmin ? 'Admin' : 'Employee'}
      </span>
    );
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
          <div className="col">
            <h2 className="fw-bold mb-1 text-white">
              Welcome, {user ? user.name : 'Admin'}
            </h2>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Manage all employee leave requests and view team members.
            </p>
          </div>
          <div className="col-auto">
            <span
              className="badge fs-6 px-3 py-2 fw-semibold"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', borderRadius: '999px' }}
            >
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div
          className="alert d-flex align-items-center justify-content-between border-0 mb-3"
          role="alert"
          style={{ background: '#FDECEA', color: '#C0392B', borderRadius: '12px', padding: '14px 18px' }}
        >
          <span>⚠️ {error}</span>
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {successMsg && (
        <div
          className="alert d-flex align-items-center justify-content-between border-0 mb-3"
          role="alert"
          style={{ background: '#E9F8EE', color: '#1E6B45', borderRadius: '12px', padding: '14px 18px' }}
        >
          <span>✅ {successMsg}</span>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#2F9E68' }}></div>
          <p className="mt-3 fs-6 fw-semibold" style={{ color: '#1E6B45' }}>Loading leave requests...</p>
        </div>
      ) : (
        <>


          {/* Quick Links Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#16241C' }}>Recent Leave Requests</h5>
            <div className="d-flex gap-2 flex-wrap">
              <Link
                to="/admin-leaves"
                className="btn btn-sm px-3 fw-semibold text-decoration-none"
                style={{ background: '#F5FBF7', color: '#1E6B45', border: '1.5px solid #DDEFE3', borderRadius: '10px' }}
              >
                View all &amp; filter →
              </Link>
              <Link
                to="/admin-employees"
                className="btn btn-sm px-3 fw-semibold text-decoration-none border-0"
                style={{ background: 'linear-gradient(180deg, #2F9E68, #1E6B45)', color: '#FFFFFF', borderRadius: '10px' }}
              >
                View all employees →
              </Link>
            </div>
          </div>

          {/* Recent leaves table (latest 10) */}
          {leaves.length === 0 ? (
            <div className="text-center p-5 mb-5" style={{ borderRadius: '20px', background: '#FFFFFF', border: '1px solid #DDEFE3' }}>
              <h5 className="mb-0 fw-bold" style={{ color: '#16241C' }}>No leave requests found</h5>
            </div>
          ) : (
            <div className="overflow-hidden mb-5" style={{ borderRadius: '20px', background: '#FFFFFF', border: '1px solid #DDEFE3' }}>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead style={{ background: '#F5FBF7' }}>
                    <tr>
                      <th className="ps-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Employee</th>
                      <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Leave Type</th>
                      <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>From</th>
                      <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>To</th>
                      <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Reason</th>
                      <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Status</th>
                      <th className="pe-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.slice(0, 10).map((leave) => (
                      <tr key={leave.id}>
                        <td className="ps-4">
                          <div className="fw-semibold" style={{ color: '#16241C' }}>{leave.userName}</div>
                          <small style={{ color: '#7F8C8D' }}>{leave.userEmail}</small>
                        </td>
                        <td>
                          <span
                            className="badge fw-semibold"
                            style={{ background: '#F5FBF7', color: '#16241C', border: '1px solid #DDEFE3', padding: '5px 10px', borderRadius: '8px' }}
                          >
                            {leave.leaveType}
                          </span>
                        </td>
                        <td style={{ color: '#5B6D62' }}>{leave.fromDate}</td>
                        <td style={{ color: '#5B6D62' }}>{leave.toDate}</td>
                        <td style={{ maxWidth: '180px' }}>
                          <span className="text-truncate d-block" style={{ color: '#5B6D62' }}>{leave.reason}</span>
                        </td>
                        <td>{getStatusBadge(leave.status)}</td>
                        <td className="pe-4">
                          {leave.status === 'PENDING' ? (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm fw-semibold border-0"
                                style={{ background: '#E9F8EE', color: '#1E6B45', borderRadius: '8px', padding: '6px 12px' }}
                                onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm fw-semibold"
                                style={{ background: 'transparent', color: '#C0392B', border: '1.5px solid #F3C7C0', borderRadius: '8px', padding: '6px 12px' }}
                                onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="small" style={{ color: '#A6B3AB' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {leaves.length > 10 && (
                <div className="text-center py-3" style={{ borderTop: '1px solid #EAF2EC' }}>
                  <Link to="/admin-leaves" className="btn btn-link fw-semibold text-decoration-none" style={{ color: '#1E6B45' }}>
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

export default AdminDashboard;
