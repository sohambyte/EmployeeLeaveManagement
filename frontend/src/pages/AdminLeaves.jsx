import React, { useEffect, useState } from 'react';
import api from '../api';

function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const fetchAllLeaves = () => {
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
        setError('Failed to fetch leave requests.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleStatusUpdate = (id, newStatus) => {
    const token = localStorage.getItem('token');

    api.put(`http://localhost:8080/api/admin/leaves/${id}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setSuccessMsg(`Leave request #${id} has been ${newStatus.toLowerCase()}.`);
        fetchAllLeaves();
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to update leave request status.');
        }
      });
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = statusFilter === 'ALL' || leave.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || leave.leaveType === typeFilter;
    return matchesStatus && matchesType;
  });

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
          <h3 className="fw-bold mb-1" style={{ color: '#16241C' }}>All Leave Requests</h3>
          <p className="mb-0" style={{ color: '#7F8C8D' }}>Review, approve or reject employee leave requests</p>
        </div>
        <button
          className="btn btn-sm px-4 fw-semibold border-0"
          onClick={fetchAllLeaves}
          style={{ background: 'linear-gradient(180deg, #2F9E68, #1E6B45)', color: '#FFFFFF', borderRadius: '10px' }}
        >
          ↻ Refresh
        </button>
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

      {/* Filter Bar */}
      <div
        className="mb-4"
        style={{ borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #DDEFE3' }}
      >
        <div className="p-3">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-auto">
              <span className="fw-semibold small" style={{ color: '#27AE60', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filters</span>
            </div>
            <div className="col-12 col-md-auto">
              <label className="form-label mb-1 fw-semibold small" style={{ color: '#16241C' }}>Status</label>
              <select
                className="form-select shadow-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                id="filter-status"
                style={filterFieldStyle}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="col-12 col-md-auto">
              <label className="form-label mb-1 fw-semibold small" style={{ color: '#16241C' }}>Leave Type</label>
              <select
                className="form-select shadow-none"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                id="filter-type"
                style={filterFieldStyle}
              >
                <option value="ALL">All Leave Types</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>
            <div className="col-12 col-md-auto ms-md-auto d-flex align-items-center">
              <span className="small" style={{ color: '#7F8C8D' }}>
                Showing <strong style={{ color: '#1E6B45' }}>{filteredLeaves.length}</strong> of <strong style={{ color: '#1E6B45' }}>{leaves.length}</strong> requests
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table / Loading / Empty States */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#2F9E68' }}></div>
          <p className="mt-3 fs-6 fw-semibold" style={{ color: '#1E6B45' }}>Loading leave requests...</p>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div className="text-center p-5" style={{ borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #DDEFE3' }}>
          <div className="mb-3" style={{ fontSize: '2.6rem' }}>📋</div>
          <h5 className="fw-bold" style={{ color: '#16241C' }}>No leave requests match the selected filters</h5>
          <p style={{ color: '#7F8C8D' }}>Try adjusting your filters above.</p>
        </div>
      ) : (
        <div className="overflow-hidden" style={{ borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #DDEFE3' }}>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ background: '#F5FBF7' }}>
                <tr>
                  <th className="ps-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>#</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Employee</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Leave Type</th>
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
                    <td className="ps-4" style={{ color: '#5B6D62' }}>#{leave.id}</td>
                    <td>
                      <div className="fw-semibold" style={{ color: '#16241C' }}>{leave.userName}</div>
                      <small style={{ color: '#7F8C8D' }}>{leave.userEmail}</small>
                    </td>
                    <td>
                      <span
                        className="badge fw-semibold"
                        style={{ backgroundColor: '#F5FBF7', color: '#16241C', border: '1px solid #DDEFE3', padding: '5px 10px', borderRadius: '8px' }}
                      >
                        {leave.leaveType}
                      </span>
                    </td>
                    <td style={{ color: '#5B6D62' }}>{leave.fromDate}</td>
                    <td style={{ color: '#5B6D62' }}>{leave.toDate}</td>
                    <td style={{ maxWidth: '200px' }}>
                      <span className="text-truncate d-block" title={leave.reason} style={{ color: '#5B6D62' }}>{leave.reason}</span>
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
        </div>
      )}
    </div>
  );
}

export default AdminLeaves;
