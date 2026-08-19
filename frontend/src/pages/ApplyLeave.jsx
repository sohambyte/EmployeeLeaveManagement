import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api';

function ApplyLeave() {
  const navigate = useNavigate();
  const location = useLocation();
  const editItem = location.state ? location.state.leave : null;

  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const [leaveType, setLeaveType] = useState(
    editItem ? editItem.leaveType : 'Casual Leave'
  );
  const [fromDate, setFromDate] = useState(editItem ? editItem.fromDate : '');
  const [toDate, setToDate] = useState(editItem ? editItem.toDate : '');
  const [reason, setReason] = useState(editItem ? editItem.reason : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isEditMode = !!editItem;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fromDate || !toDate) {
      const msg = 'Both From Date and To Date are required.';
      setError(msg);
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: msg,
        confirmButtonColor: '#2F9E68',
        background: '#ffffff',
        color: '#16241C'
      });
      return;
    }

    if (fromDate > toDate) {
      const msg = 'From Date cannot be after To Date.';
      setError(msg);
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: msg,
        confirmButtonColor: '#2F9E68',
        background: '#ffffff',
        color: '#16241C'
      });
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');

    const payload = {
      leaveType,
      fromDate,
      toDate,
      reason
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const request = isEditMode
      ? api.put(
          `http://localhost:8080/api/leaves/${editItem.id}`,
          payload,
          config
        )
      : api.post(
          'http://localhost:8080/api/leaves',
          payload,
          config
        );

    request
      .then(() => {
        const msg = isEditMode
          ? 'Leave request updated successfully!'
          : 'Leave request submitted successfully!';
        setSuccessMsg(msg);

        Swal.fire({
          icon: 'success',
          title: isEditMode ? 'Leave Request Updated' : 'Leave Request Submitted',
          text: msg,
          timer: 1800,
          showConfirmButton: false,
          background: '#ffffff',
          color: '#16241C'
        }).then(() => {
          navigate('/my-leaves');
        });
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        const errMsg = (err.response && err.response.data && err.response.data.error)
          ? err.response.data.error
          : 'Failed to save leave request. Please check your inputs.';

        setError(errMsg);

        Swal.fire({
          icon: 'error',
          title: 'Application Rejected',
          text: errMsg,
          confirmButtonColor: '#2F9E68',
          background: '#ffffff',
          color: '#16241C'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fieldStyle = {
    borderRadius: '12px',
    padding: '13px 16px',
    backgroundColor: '#F5FBF7',
    border: '1.5px solid #DDEFE3',
    color: '#16241C',
    fontSize: '0.95rem'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#27AE60';
    e.target.style.boxShadow = '0 0 0 4px rgba(39,174,96,0.12)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#DDEFE3';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="container-fluid px-3 px-md-4 py-4"
      style={{ background: 'linear-gradient(160deg, #F5FBF7 0%, #EAF6EE 100%)', minHeight: '100vh' }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">

          {/* Header */}
          <div className="mb-4">
            <p
              className="fw-bold text-uppercase mb-2"
              style={{ color: '#27AE60', fontSize: '0.78rem', letterSpacing: '0.14em' }}
            >
              {isEditMode ? 'Editing request' : 'New request'}
            </p>

            <h2 className="fw-bold mb-2" style={{ color: '#16241C' }}>
              {isEditMode ? 'Edit leave request' : 'Apply for leave'}
            </h2>

            <p className="mb-0" style={{ color: '#7F8C8D' }}>
              {isEditMode
                ? 'Update the details of your pending leave request.'
                : 'Fill in the form below to submit a new leave request.'}
            </p>
          </div>

          {/* Card */}
          <div
            className="position-relative"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #DDEFE3',
              boxShadow: '0 30px 80px -30px rgba(18,59,39,0.2)'
            }}
          >
            <span
              className="position-absolute rounded-circle"
              style={{ width: 16, height: 16, background: '#F1C9AA', top: 22, right: 26 }}
            />

            <div className="p-4 p-md-5">

              {error && (
                <div
                  className="alert border-0 d-flex align-items-center mb-4"
                  role="alert"
                  style={{
                    backgroundColor: '#FDECEA',
                    color: '#C0392B',
                    borderRadius: '12px',
                    padding: '14px 16px'
                  }}
                >
                  <span className="me-2">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div
                  className="alert border-0 d-flex align-items-center mb-4"
                  role="alert"
                  style={{
                    backgroundColor: '#E9F8EE',
                    color: '#1E6B45',
                    borderRadius: '12px',
                    padding: '14px 16px'
                  }}
                >
                  <span className="me-2">✅</span>
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Leave Type */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold small mb-2"
                    htmlFor="leave-type"
                    style={{ color: '#16241C' }}
                  >
                    Leave Type
                  </label>

                  <select
                    id="leave-type"
                    className="form-select form-select-lg shadow-none"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                    style={fieldStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="row g-3 mb-3">

                  <div className="col-md-6">
                    <label
                      className="form-label fw-semibold small mb-2"
                      htmlFor="from-date"
                      style={{ color: '#16241C' }}
                    >
                      From Date
                    </label>

                    <input
                      id="from-date"
                      type="date"
                      className="form-control form-control-lg shadow-none"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      min={firstDayOfMonth}
                      max={lastDayOfMonth}
                      required
                      style={fieldStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      className="form-label fw-semibold small mb-2"
                      htmlFor="to-date"
                      style={{ color: '#16241C' }}
                    >
                      To Date
                    </label>

                    <input
                      id="to-date"
                      type="date"
                      className="form-control form-control-lg shadow-none"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      min={fromDate || firstDayOfMonth}
                      max={lastDayOfMonth}
                      required
                      style={fieldStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

                </div>

                {/* Reason */}
                <div className="mb-4">
                  <label
                    className="form-label fw-semibold small mb-2"
                    htmlFor="reason"
                    style={{ color: '#16241C' }}
                  >
                    Reason for Leave
                  </label>

                  <textarea
                    id="reason"
                    className="form-control shadow-none"
                    rows="5"
                    placeholder="Please provide a clear reason for your leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    style={{ ...fieldStyle, resize: 'vertical' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-3">

                  <button
                    type="submit"
                    className="btn btn-lg fw-semibold flex-fill border-0"
                    disabled={loading}
                    style={{
                      borderRadius: '12px',
                      padding: '13px 16px',
                      background: 'linear-gradient(180deg, #2F9E68, #1E6B45)',
                      color: '#FFFFFF',
                      boxShadow: '0 12px 24px -10px rgba(30,107,69,0.55)'
                    }}
                  >
                    {loading ? (
                      <span className="d-inline-flex align-items-center justify-content-center">
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                          style={{ color: '#FFFFFF' }}
                        />
                        Saving...
                      </span>
                    ) : (
                      isEditMode ? 'Update Request' : 'Submit Leave Request'
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-lg fw-semibold flex-fill"
                    onClick={() => navigate('/my-leaves')}
                    style={{
                      borderRadius: '12px',
                      padding: '13px 16px',
                      backgroundColor: '#F5FBF7',
                      border: '1.5px solid #DDEFE3',
                      color: '#16241C'
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ApplyLeave;
