import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
      setError('Both From Date and To Date are required.');
      return;
    }

    if (fromDate > toDate) {
      setError('From Date cannot be after To Date.');
      return;
    }

    setError('');

    if (new Date(fromDate) > new Date(toDate)) {
      setError('From Date cannot be after To Date.');
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
        setSuccessMsg(
          isEditMode
            ? 'Leave request updated successfully!'
            : 'Leave request submitted successfully!'
        );

        setTimeout(() => {
          navigate('/my-leaves');
        }, 1200);
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to save leave request. Please check your inputs.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="container-fluid px-3 px-md-4 py-4"
      style={{ backgroundColor: '#0B0B0B', minHeight: '100vh' }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">

          {/* Header */}
          <div className="mb-4">

            <div
              className="mb-3"
              style={{
                width: '64px',
                height: '5px',
                backgroundColor: '#FFD400',
                borderRadius: '3px'
              }}
            />

            <h2 className="fw-bold text-white mb-2">
              {isEditMode ? 'Edit Leave Request' : 'Apply for Leave'}
            </h2>

            <p className="text-secondary mb-0">
              {isEditMode
                ? 'Update the details of your pending leave request.'
                : 'Fill in the form below to submit a new leave request.'}
            </p>
          </div>

          {/* Card */}
          <div
            className="card border-0 shadow-lg"
            style={{
              backgroundColor: '#151515',
              borderRadius: '22px',
              border: '1px solid #2A2A2A'
            }}
          >

            <div className="card-body p-4 p-md-5">

              {error && (
                <div
                  className="alert border-0 d-flex align-items-center mb-4"
                  role="alert"
                  style={{
                    backgroundColor: '#2A1616',
                    color: '#FFB4B4',
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
                    backgroundColor: '#162A16',
                    color: '#B7F7B7',
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
                <div className="mb-4">
                  <label
                    className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                    htmlFor="leave-type"
                  >
                    Leave Type
                  </label>

                  <select
                    id="leave-type"
                    className="form-select form-select-lg bg-dark text-white border-secondary"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                    style={{
                      borderRadius: '12px',
                      padding: '18px 18px',
                      backgroundColor: '#1C1C1C',
                      borderColor: '#2A2A2A',
                      fontSize: '1.05rem',
                      minHeight: '60px'
                    }}
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="row g-4 mb-4">

                  <div className="col-md-6">
                    <label
                      className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                      htmlFor="from-date"
                    >
                      From Date
                    </label>

                    <input
                      id="from-date"
                      type="date"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      min={firstDayOfMonth}
                      max={lastDayOfMonth}
                      required
                      style={{
                        borderRadius: '12px',
                        padding: '18px 18px',
                        backgroundColor: '#1C1C1C',
                        borderColor: '#2A2A2A',
                        fontSize: '1.05rem',
                        minHeight: '60px'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                      htmlFor="to-date"
                    >
                      To Date
                    </label>

                    <input
                      id="to-date"
                      type="date"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      min={fromDate || firstDayOfMonth}
                      max={lastDayOfMonth}
                      required
                      style={{
                        borderRadius: '12px',
                        padding: '18px 18px',
                        backgroundColor: '#1C1C1C',
                        borderColor: '#2A2A2A',
                        fontSize: '1.05rem',
                        minHeight: '60px'
                      }}
                    />
                  </div>

                </div>

                {/* Reason */}
                <div className="mb-5">
                  <label
                    className="form-label fw-semibold text-white-50 small text-uppercase mb-2"
                    htmlFor="reason"
                  >
                    Reason for Leave
                  </label>

                  <textarea
                    id="reason"
                    className="form-control bg-dark text-white border-secondary"
                    rows="5"
                    placeholder="Please provide a clear reason for your leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    style={{
                      borderRadius: '12px',
                      padding: '18px',
                      backgroundColor: '#1C1C1C',
                      borderColor: '#2A2A2A',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-3">

                  <button
                    type="submit"
                    className="btn btn-lg fw-semibold flex-fill"
                    disabled={loading}
                    style={{
                      borderRadius: '12px',
                      padding: '16px 20px',
                      backgroundColor: '#FFD400',
                      borderColor: '#FFD400',
                      color: '#111111',
                      minHeight: '58px'
                    }}
                  >
                    {loading ? (
                      <span className="d-inline-flex align-items-center justify-content-center">
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                          style={{ color: '#111111' }}
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
                      padding: '16px 20px',
                      backgroundColor: '#1C1C1C',
                      border: '1px solid #2A2A2A',
                      color: '#F5F5F5',
                      minHeight: '58px'
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