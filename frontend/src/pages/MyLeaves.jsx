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

  // Distinct leave types present in the data, for the type filter options
  const leaveTypes = Array.from(new Set(leaves.map((l) => l.leaveType))).filter(Boolean);

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

  const filterFieldStyle = {
    borderRadius: '10px',
    padding: '9px 14px',
    backgroundColor: '#F5FBF7',
    border: '1.5px solid #DDEFE3',
    color: '#16241C',
    fontSize: '0.9rem'
  };

  return (
    <div
      className="container-fluid px-3 px-md-4 py-4"
      style={{ background: 'linear-gradient(160deg, #F5FBF7 0%, #EAF6EE 100%)', minHeight: '100vh' }}
    >

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#16241C' }}>My Leave Requests</h3>
          <p className="mb-0" style={{ color: '#7F8C8D' }}>View and manage your submitted leave requests</p>
        </div>

        <Link
          to="/apply-leave"
          className="btn px-4 fw-semibold text-decoration-none border-0"
          style={{
            background: 'linear-gradient(180deg, #2F9E68, #1E6B45)',
            color: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 12px 24px -10px rgba(30,107,69,0.55)'
          }}
        >
          + Apply New Leave
        </Link>
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

      {/* Filters */}
      <div
        className="d-flex flex-wrap gap-3 align-items-end p-3 mb-4"
        style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #DDEFE3' }}
      >
        <div>
          <label className="form-label fw-semibold small mb-1" style={{ color: '#16241C' }}>
            Status
          </label>
          <select
            className="form-select shadow-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={filterFieldStyle}
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label className="form-label fw-semibold small mb-1" style={{ color: '#16241C' }}>
            Leave type
          </label>
          <select
            className="form-select shadow-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={filterFieldStyle}
          >
            <option value="ALL">All types</option>
            {leaveTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {(statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
          <button
            type="button"
            className="btn fw-semibold"
            onClick={() => { setStatusFilter('ALL'); setTypeFilter('ALL'); }}
            style={{
              borderRadius: '10px',
              padding: '9px 16px',
              background: 'transparent',
              border: '1.5px solid #DDEFE3',
              color: '#5B6D62',
              fontSize: '0.9rem'
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table / Loading / Empty States */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#2F9E68' }}></div>
          <p className="mt-3 fs-6 fw-semibold" style={{ color: '#1E6B45' }}>Loading your leave requests...</p>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div
          className="text-center p-5"
          style={{ borderRadius: '20px', background: '#FFFFFF', border: '1px solid #DDEFE3' }}
        >
          <div className="mb-3" style={{ fontSize: '2.6rem' }}>📋</div>

          <h5 className="fw-bold" style={{ color: '#16241C' }}>No leave requests found</h5>

          <p className="mb-3" style={{ color: '#7F8C8D' }}>
            {leaves.length === 0
              ? 'You have not submitted any leave requests yet.'
              : 'No requests match the selected filters.'}
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
          style={{ borderRadius: '20px', background: '#FFFFFF', border: '1px solid #DDEFE3' }}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: '#F5FBF7' }}>
                <tr>
                  <th className="ps-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Leave Type</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>From Date</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>To Date</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Reason</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Status</th>
                  <th className="pe-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="ps-4 fw-semibold" style={{ color: '#16241C' }}>{leave.leaveType}</td>

                    <td style={{ color: '#5B6D62' }}>{leave.fromDate}</td>

                    <td style={{ color: '#5B6D62' }}>{leave.toDate}</td>

                    <td style={{ maxWidth: '250px' }}>
                      <span className="text-truncate d-block" title={leave.reason} style={{ color: '#5B6D62' }}>
                        {leave.reason}
                      </span>
                    </td>

                    <td>{getStatusBadge(leave.status)}</td>

                    <td className="pe-4">
                      {leave.status === 'PENDING' ? (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm fw-semibold border-0"
                            style={{ background: '#EAF6EE', color: '#1E6B45', borderRadius: '8px', padding: '6px 12px' }}
                            onClick={() => handleEdit(leave)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm fw-semibold"
                            style={{ background: 'transparent', color: '#C0392B', border: '1.5px solid #F3C7C0', borderRadius: '8px', padding: '6px 12px' }}
                            onClick={() => handleDelete(leave.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="small" style={{ color: '#A6B3AB' }}>No actions</span>
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
