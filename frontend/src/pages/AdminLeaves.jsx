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
        return <span className="badge bg-success fs-6">APPROVED</span>;
      case 'REJECTED':
        return <span className="badge bg-danger fs-6">REJECTED</span>;
      default:
        return <span className="badge fs-6" style={{ backgroundColor: '#FFD700', color: '#000000' }}>PENDING</span>;
    }
  };

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#0f0f0f', color: '#ffffff', minHeight: '100vh' }}>

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#FFD700' }}>All Leave Requests</h3>
          <p className="mb-0" style={{ color: '#cfcfcf' }}>Review, approve or reject employee leave requests</p>
        </div>
        <button className="btn btn-sm px-4" onClick={fetchAllLeaves} style={{ backgroundColor: '#FFD700', color: '#000000', border: '1px solid #2a2a2a', fontWeight: '600' }}>
          🔄 Refresh
        </button>
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

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-auto">
              <span className="fw-semibold" style={{ color: '#FFD700' }}>Filters:</span>
            </div>
            <div className="col-12 col-md-auto">
              <label className="form-label mb-1 fw-semibold small" style={{ color: '#cfcfcf' }}>STATUS</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                id="filter-status"
                style={{ backgroundColor: '#0f0f0f', color: '#ffffff', borderColor: '#2a2a2a' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="col-12 col-md-auto">
              <label className="form-label mb-1 fw-semibold small" style={{ color: '#cfcfcf' }}>LEAVE TYPE</label>
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                id="filter-type"
                style={{ backgroundColor: '#0f0f0f', color: '#ffffff', borderColor: '#2a2a2a' }}
              >
                <option value="ALL">All Leave Types</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>
            <div className="col-12 col-md-auto ms-md-auto d-flex align-items-end">
              <span className="small" style={{ color: '#cfcfcf' }}>
                Showing <strong style={{ color: '#FFD700' }}>{filteredLeaves.length}</strong> of <strong style={{ color: '#FFD700' }}>{leaves.length}</strong> requests
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table / Loading / Empty States */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#FFD700' }}></div>
          <p className="mt-3 fs-5" style={{ color: '#cfcfcf' }}>Loading leave requests...</p>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div className="card border-0 shadow-sm text-center p-5" style={{ borderRadius: '12px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <div className="mb-3" style={{ fontSize: '3rem' }}>📋</div>
          <h5 style={{ color: '#FFD700' }}>No leave requests match the selected filters.</h5>
          <p style={{ color: '#cfcfcf' }}>Try adjusting your filters above.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ color: '#000000' }}>
              <thead style={{ background: '#FFD700', color: '#000000' }}>
                <tr>
                  <th className="ps-4" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>#</th>
                  <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Employee</th>
                  <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Leave Type</th>
                  <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>From Date</th>
                  <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>To Date</th>
                  <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Reason</th>
                  <th style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Status</th>
                  <th className="pe-4" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} style={{ borderBottom: '1px solid #2a2a2a', color: '#000000' }}>
                    <td className="ps-4" style={{ color: '#000000' }}>#{leave.id}</td>
                    <td style={{ color: '#000000' }}>
                      <div className="fw-semibold" style={{ color: '#000000' }}>{leave.userName}</div>
                      <small style={{ color: '#000000' }}>{leave.userEmail}</small>
                    </td>
                    <td style={{ color: '#000000' }}>
                      <span className="badge" style={{ backgroundColor: '#2a2a2a', color: '#ffffff', border: '1px solid #2a2a2a' }}>{leave.leaveType}</span>
                    </td>
                    <td style={{ color: '#000000' }}>{leave.fromDate}</td>
                    <td style={{ color: '#000000' }}>{leave.toDate}</td>
                    <td style={{ maxWidth: '200px', color: '#000000' }}>
                      <span className="text-truncate d-block" title={leave.reason} style={{ color: '#000000' }}>{leave.reason}</span>
                    </td>
                    <td>{getStatusBadge(leave.status)}</td>
                    <td className="pe-4">
                      {/* Show Approve/Reject ONLY for PENDING leaves */}
                      {leave.status === 'PENDING' ? (
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-success"
                            onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                          >
                            ❌ Reject
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
        </div>
      )}
    </div>
  );
}

export default AdminLeaves;