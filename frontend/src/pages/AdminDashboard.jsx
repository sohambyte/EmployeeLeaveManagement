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

    api.get('http://localhost:8080/api/admin/leaves', {
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

    api.get('http://localhost:8080/api/admin/employees', {
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

    api.put(`http://localhost:8080/api/admin/leaves/${id}/status`, { status: newStatus }, {
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

    api.delete(`http://localhost:8080/api/admin/employees/${id}`, {
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
        return <span className="badge bg-success fs-6">APPROVED</span>;
      case 'REJECTED':
        return <span className="badge bg-danger fs-6">REJECTED</span>;
      default:
        return <span className="badge fs-6" style={{ backgroundColor: '#FFD700', color: '#000000' }}>PENDING</span>;
    }
  };

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#0f0f0f', color: '#ffffff', minHeight: '100vh' }}>

      {/* Welcome Banner */}
      <div
        className="rounded-3 p-4 mb-4 text-white"
        style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
      >
        <div className="row align-items-center">
          <div className="col">
            <h2 className="fw-bold mb-1" style={{ color: '#FFD700' }}>
              👋 Welcome, {user ? user.name : 'Admin'}!
            </h2>
            <p className="mb-0" style={{ color: '#cfcfcf' }}>
              Manage all employee leave requests and view team members.
            </p>
          </div>
          <div className="col-auto">
            <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: '#FFD700', color: '#000000' }}>ADMIN</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ border: '1px solid #2a2a2a' }}>
          ⚠️ {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert" style={{ border: '1px solid #2a2a2a' }}>
          ✅ {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Stats Cards */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#FFD700' }}></div>
          <p className="mt-3 fs-5" style={{ color: '#cfcfcf' }}>Loading leave requests...</p>
        </div>
      ) : (
        <>
      

          {/* Quick Links Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#FFD700' }}>Recent Leave Requests</h5>
            <div className="d-flex gap-2">
              <Link to="/admin-leaves" className="btn btn-sm px-4" style={{ backgroundColor: '#FFD700', color: '#000000', border: '1px solid #2a2a2a', fontWeight: '600' }}>
                View All &amp; Filter →
              </Link>
              <Link to="/admin-employees" className="btn btn-sm px-4" style={{ backgroundColor: '#FFD700', color: '#000000', border: '1px solid #2a2a2a', fontWeight: '600' }}>
                View All Employees →
              </Link>
            </div>
          </div>

          {/* Recent leaves table (latest 10) */}
          {leaves.length === 0 ? (
            <div className="card border-0 shadow-sm text-center p-5 mb-5" style={{ borderRadius: '12px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <h5 className="mb-0" style={{ color: '#cfcfcf' }}>No leave requests found.</h5>
            </div>
          ) : (
            <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '12px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table align-middle mb-0" style={{ color: '#000000' }}>
                  <thead style={{ background: '#FFD700', color: '#000000' }}>
                    <tr>
                      <th className="ps-4" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Employee</th>
                      <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Leave Type</th>
                      <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>From</th>
                      <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>To</th>
                      <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Reason</th>
                      <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Status</th>
                      <th className="pe-4" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.slice(0, 10).map((leave) => (
                      <tr key={leave.id} style={{ borderBottom: '1px solid #2a2a2a', color: '#000000' }}>
                        <td className="ps-4" style={{ color: '#000000' }}>
                          <div className="fw-semibold" style={{ color: '#000000' }}>{leave.userName}</div>
                          <small style={{ color: '#000000' }}>{leave.userEmail}</small>
                        </td>
                        <td style={{ color: '#000000' }}>
                          <span className="badge" style={{ backgroundColor: '#2a2a2a', color: '#ffffff', border: '1px solid #2a2a2a' }}>{leave.leaveType}</span>
                        </td>
                        <td style={{ color: '#000000' }}>{leave.fromDate}</td>
                        <td style={{ color: '#000000' }}>{leave.toDate}</td>
                        <td style={{ maxWidth: '180px', color: '#000000' }}>
                          <span className="text-truncate d-block" style={{ color: '#000000' }}>{leave.reason}</span>
                        </td>
                        <td>{getStatusBadge(leave.status)}</td>
                        <td className="pe-4">
                          {/* Show Approve/Reject ONLY for PENDING requests */}
                          {leave.status === 'PENDING' ? (
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-success"
                                onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="small" style={{ color: '#000000' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {leaves.length > 10 && (
                <div className="card-footer text-center bg-transparent border-0 py-3" style={{ borderTop: '1px solid #2a2a2a' }}>
                  <Link to="/admin-leaves" className="btn btn-link fw-semibold" style={{ color: '#FFD700', textDecoration: 'none' }}>
                    View all {leaves.length} requests →
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* All Employees Section */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0" style={{ color: '#FFD700' }}>All Employees</h4>
          <div className="d-flex align-items-center gap-3">
            <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: '#FFD700', color: '#000000' }}>
              Total Employees: {employees.length}
            </span>
          
          </div>
        </div>

        {employeesError && (
          <div className="alert alert-danger" role="alert" style={{ border: '1px solid #2a2a2a' }}>
            ⚠️ {employeesError}
          </div>
        )}

        {employeesLoading ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status" style={{ color: '#FFD700' }}></div>
            <p className="mt-2" style={{ color: '#cfcfcf' }}>Loading employees list...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '12px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <h6 className="mb-0" style={{ color: '#cfcfcf' }}>No employees found.</h6>
          </div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <div className="table-responsive">
              
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;