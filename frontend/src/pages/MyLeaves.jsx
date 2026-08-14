import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function MyLeaves() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

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
        setError('Failed to fetch your leave requests.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending leave request?')) {
      return;
    }
    const token = localStorage.getItem('token');

    api.delete(`http://localhost:8080/api/leaves/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setSuccessMsg('Leave request cancelled successfully.');
        fetchMyLeaves();
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to cancel leave request.');
        }
      });
  };

  const handleEdit = (leave) => {
    navigate('/apply-leave', { state: { leave } });
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = statusFilter === 'ALL' || leave.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || leave.leaveType === typeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge bg-success fs-6">APPROVED</span>;
      case 'REJECTED':
        return <span className="badge bg-danger fs-6">REJECTED</span>;
      default:
        return <span className="badge fs-6" style={{ background: '#FFD700', color: '#000' }}>PENDING</span>;
    }
  };

  return (
    <div className="container-fluid px-4 py-4" style={{ background: '#0f0f0f', minHeight: '100vh' }}>

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#FFD700' }}>My Leave Requests</h3>
          <p className="mb-0" style={{ color: '#cfcfcf' }}>View and manage your submitted leave requests</p>
        </div>

        <Link
          to="/apply-leave"
          className="btn px-4 fw-semibold"
          style={{ background: '#FFD700', color: '#000', border: 'none' }}
        >
          ➕ Apply New Leave
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          ⚠️ {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          ✅ {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      

      {/* Table / Loading / Empty States */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#FFD700' }}></div>
          <p className="mt-3 fs-5" style={{ color: '#FFD700' }}>Loading your leave requests...</p>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div
          className="card border-0 shadow-sm text-center p-5"
          style={{ borderRadius: '12px', background: '#1a1a1a', color: '#fff' }}
        >
          <div className="mb-3" style={{ fontSize: '3rem', color: '#FFD700' }}>📋</div>

          <h5 style={{ color: '#FFD700' }}>No leave requests found.</h5>

          <p className="mb-3" style={{ color: '#cfcfcf' }}>
            {leaves.length === 0
              ? 'You have not submitted any leave requests yet.'
              : 'No requests match the selected filters.'}
          </p>

          <div>
            <Link
              to="/apply-leave"
              className="btn px-4 text-decoration-none"
              style={{ background: '#FFD700', color: '#000', border: 'none' }}
            >
              ➕ Apply for Leave
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: '12px', background: '#1a1a1a' }}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: '#FFD700' }}>
                <tr>
                  <th className="ps-4 text-dark">Leave Type</th>
                  <th className="text-dark">From Date</th>
                  <th className="text-dark">To Date</th>
                  <th className="text-dark">Reason</th>
                  <th className="text-dark">Status</th>
                  <th className="pe-4 text-dark">Actions</th>
                </tr>
              </thead>

              <tbody style={{ color: '#fff' }}>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="ps-4 fw-semibold">{leave.leaveType}</td>

                    <td>{leave.fromDate}</td>

                    <td>{leave.toDate}</td>

                    <td style={{ maxWidth: '250px' }}>
                      <span className="text-truncate d-block" title={leave.reason}>
                        {leave.reason}
                      </span>
                    </td>

                    <td>{getStatusBadge(leave.status)}</td>

                    <td className="pe-4">
                      {leave.status === 'PENDING' ? (
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn fw-semibold"
                            style={{ background: '#FFD700', color: '#000', border: 'none' }}
                            onClick={() => handleEdit(leave)}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(leave.id)}
                          >
                            🗑️ Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="small" style={{ color: '#cfcfcf' }}>No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyLeaves;