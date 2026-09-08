import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../api';

function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modal / Review state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvedFromDate, setApprovedFromDate] = useState('');
  const [approvedToDate, setApprovedToDate] = useState('');
  const [editLeaveType, setEditLeaveType] = useState('');
  const [editReason, setEditReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const fetchAllLeaves = () => {
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
        setError('Failed to fetch leave requests.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openReviewModal = (leave) => {
    setSelectedLeave(leave);
    setApprovedFromDate(leave.fromDate || '');
    setApprovedToDate(leave.toDate || '');
    setEditLeaveType(leave.leaveType || 'Casual Leave');
    setEditReason(leave.reason || '');
  };

  const closeReviewModal = () => {
    setSelectedLeave(null);
    setActionLoading(false);
  };

  const handleApproveLeave = async (e) => {
    if (e) e.preventDefault();
    if (!selectedLeave) return;

    if (!approvedFromDate || !approvedToDate) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Both Approved From Date and Approved To Date are required.',
        background: '#ffffff',
        color: '#16241C',
        confirmButtonColor: '#2F9E68'
      });
      return;
    }

    if (approvedFromDate > approvedToDate) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'From date cannot be after To date.',
        background: '#ffffff',
        color: '#16241C',
        confirmButtonColor: '#2F9E68'
      });
      return;
    }

    setActionLoading(true);
    const token = localStorage.getItem('token');

    const payload = {
      status: 'APPROVED',
      fromDate: approvedFromDate,
      toDate: approvedToDate,
      leaveType: editLeaveType,
      reason: editReason
    };

    try {
      await api.put(`/api/admin/leaves/${selectedLeave.id}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      closeReviewModal();
      await Swal.fire({
        icon: 'success',
        title: 'Leave Approved',
        text: `Leave request #${selectedLeave.id} approved for ${approvedFromDate} to ${approvedToDate}.`,
        confirmButtonColor: '#2F9E68',
        background: '#ffffff',
        color: '#16241C'
      });
      fetchAllLeaves();
    } catch (err) {
      setActionLoading(false);
      if (err?.response?.status === 401) return;
      const errMsg = err.response?.data?.error || 'Failed to approve leave request.';
      Swal.fire({
        icon: 'error',
        title: 'Approval Rejected',
        text: errMsg,
        confirmButtonColor: '#2F9E68',
        background: '#ffffff',
        color: '#16241C'
      });
    }
  };

  const handleRejectLeave = async (leaveToReject) => {
    const targetLeave = leaveToReject || selectedLeave;
    if (!targetLeave) return;

    const result = await Swal.fire({
      title: 'Reject Leave Request?',
      text: `Are you sure you want to reject request #${targetLeave.id} for ${targetLeave.userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#C0392B',
      cancelButtonColor: '#DDEFE3',
      background: '#ffffff',
      color: '#16241C',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    const token = localStorage.getItem('token');

    try {
      await api.put(`/api/admin/leaves/${targetLeave.id}/status`, { status: 'REJECTED' }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (selectedLeave) closeReviewModal();

      await Swal.fire({
        icon: 'success',
        title: 'Leave Rejected',
        text: `Leave request #${targetLeave.id} has been rejected.`,
        confirmButtonColor: '#2F9E68',
        background: '#ffffff',
        color: '#16241C'
      });
      fetchAllLeaves();
    } catch (err) {
      setActionLoading(false);
      if (err?.response?.status === 401) return;
      const errMsg = err.response?.data?.error || 'Failed to reject leave request.';
      Swal.fire({
        icon: 'error',
        title: 'Rejection Failed',
        text: errMsg,
        confirmButtonColor: '#2F9E68',
        background: '#ffffff',
        color: '#16241C'
      });
    }
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

  const modalInputStyle = {
    borderRadius: '10px',
    padding: '10px 14px',
    backgroundColor: '#F5FBF7',
    border: '1.5px solid #DDEFE3',
    color: '#16241C',
    fontSize: '0.95rem'
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
          <p className="mb-0" style={{ color: '#7F8C8D' }}>Review, edit dates, approve or reject employee leave requests</p>
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
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Requested Dates</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Approved Dates</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Reason</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Status</th>
                  <th className="pe-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => {
                  const reqFrom = leave.requestedFromDate || leave.fromDate;
                  const reqTo = leave.requestedToDate || leave.toDate;
                  const isModified = leave.status === 'APPROVED' && (reqFrom !== leave.fromDate || reqTo !== leave.toDate);

                  return (
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
                      <td style={{ color: '#5B6D62' }}>
                        <div>{reqFrom} → {reqTo}</div>
                      </td>
                      <td style={{ color: '#5B6D62' }}>
                        {leave.status === 'APPROVED' ? (
                          <div>
                            <span className="fw-semibold" style={{ color: '#1E6B45' }}>{leave.fromDate} → {leave.toDate}</span>
                            {isModified && (
                              <div style={{ fontSize: '0.75rem', color: '#B98237' }}>(Partial Approval)</div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#A6B3AB' }}>—</span>
                        )}
                      </td>
                      <td style={{ maxWidth: '180px' }}>
                        <span className="text-truncate d-block" title={leave.reason} style={{ color: '#5B6D62' }}>{leave.reason}</span>
                      </td>
                      <td>{getStatusBadge(leave.status)}</td>
                      <td className="pe-4">
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm fw-semibold border-0"
                            style={{ background: '#E9F8EE', color: '#1E6B45', borderRadius: '8px', padding: '6px 12px' }}
                            onClick={() => openReviewModal(leave)}
                          >
                            {leave.status === 'PENDING' ? 'Approve / Edit' : 'Edit Dates'}
                          </button>
                          {leave.status === 'PENDING' && (
                            <button
                              className="btn btn-sm fw-semibold"
                              style={{ background: 'transparent', color: '#C0392B', border: '1.5px solid #F3C7C0', borderRadius: '8px', padding: '6px 12px' }}
                              onClick={() => handleRejectLeave(leave)}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review / Approval Modal */}
      {selectedLeave && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: '20px', backgroundColor: '#FFFFFF' }}
            >
              <div className="modal-header border-0 pb-0 pt-4 px-4">
                <div>
                  <h5 className="modal-title fw-bold" style={{ color: '#16241C' }}>
                    Review & Edit Leave Request #{selectedLeave.id}
                  </h5>
                  <p className="small mb-0" style={{ color: '#7F8C8D' }}>
                    Employee: <strong>{selectedLeave.userName}</strong> ({selectedLeave.userEmail})
                  </p>
                </div>
                <button type="button" className="btn-close" onClick={closeReviewModal}></button>
              </div>

              <div className="modal-body p-4">
                {/* Requested Info Callout */}
                <div
                  className="p-3 mb-4 rounded-3"
                  style={{ backgroundColor: '#F5FBF7', border: '1px solid #DDEFE3' }}
                >
                  <div className="small fw-bold text-uppercase mb-1" style={{ color: '#27AE60', letterSpacing: '0.05em' }}>
                    Original Requested Period
                  </div>
                  <div className="fs-6 fw-semibold" style={{ color: '#16241C' }}>
                    📅 {selectedLeave.requestedFromDate || selectedLeave.fromDate} &nbsp;→&nbsp; {selectedLeave.requestedToDate || selectedLeave.toDate}
                  </div>
                  <div className="small mt-1" style={{ color: '#5B6D62' }}>
                    Reason: <em>"{selectedLeave.reason}"</em>
                  </div>
                </div>

                <form onSubmit={handleApproveLeave}>
                  {/* Leave Type */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small mb-1" style={{ color: '#16241C' }}>
                      Leave Type
                    </label>
                    <select
                      className="form-select shadow-none"
                      value={editLeaveType}
                      onChange={(e) => setEditLeaveType(e.target.value)}
                      style={modalInputStyle}
                    >
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                  </div>

                  {/* Approved Date Inputs */}
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small mb-1" style={{ color: '#16241C' }}>
                        Approved From Date
                      </label>
                      <input
                        type="date"
                        className="form-control shadow-none"
                        value={approvedFromDate}
                        onChange={(e) => setApprovedFromDate(e.target.value)}
                        required
                        style={modalInputStyle}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small mb-1" style={{ color: '#16241C' }}>
                        Approved To Date
                      </label>
                      <input
                        type="date"
                        className="form-control shadow-none"
                        value={approvedToDate}
                        onChange={(e) => setApprovedToDate(e.target.value)}
                        required
                        style={modalInputStyle}
                      />
                    </div>
                  </div>

                  {/* Reason Edit */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold small mb-1" style={{ color: '#16241C' }}>
                      Reason / Admin Notes
                    </label>
                    <textarea
                      className="form-control shadow-none"
                      rows="3"
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      style={modalInputStyle}
                    />
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn fw-semibold"
                      onClick={closeReviewModal}
                      disabled={actionLoading}
                      style={{ borderRadius: '10px', background: '#F5FBF7', border: '1.5px solid #DDEFE3', color: '#5B6D62' }}
                    >
                      Cancel
                    </button>
                    {selectedLeave.status === 'PENDING' && (
                      <button
                        type="button"
                        className="btn fw-semibold"
                        onClick={() => handleRejectLeave(selectedLeave)}
                        disabled={actionLoading}
                        style={{ borderRadius: '10px', background: '#FDECEA', color: '#C0392B', border: '1.5px solid #F3C7C0' }}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn fw-semibold border-0"
                      disabled={actionLoading}
                      style={{
                        borderRadius: '10px',
                        background: 'linear-gradient(180deg, #2F9E68, #1E6B45)',
                        color: '#FFFFFF',
                        padding: '8px 20px'
                      }}
                    >
                      {actionLoading ? 'Saving...' : 'Approve Leave'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLeaves;
