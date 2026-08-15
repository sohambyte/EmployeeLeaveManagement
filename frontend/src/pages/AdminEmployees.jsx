import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import Swal from 'sweetalert2';

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    api
      .get('http://localhost:8080/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setEmployees(response.data || []);
      })
      .catch((err) => {
        if (err?.response?.status === 401) return;
        setError('Could not load employees list.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Employee?',
      text: 'Are you sure you want to delete this employee? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#16241C',
      confirmButtonColor: '#C0392B',
      cancelButtonColor: '#DDEFE3',
      customClass: {
        confirmButton: 'fw-bold',
        cancelButton: 'fw-semibold text-dark'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');

        api
          .delete(`http://localhost:8080/api/admin/employees/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(() => {
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
            Swal.fire({
              title: 'Deleted!',
              text: `Employee #${id} deleted successfully.`,
              icon: 'success',
              background: '#ffffff',
              color: '#16241C',
              confirmButtonColor: '#2F9E68',
              customClass: {
                confirmButton: 'fw-bold'
              }
            });
          })
          .catch((err) => {
            if (err?.response?.status === 401) return;
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete employee.',
              icon: 'error',
              background: '#ffffff',
              color: '#16241C',
              confirmButtonColor: '#2F9E68',
              customClass: {
                confirmButton: 'fw-bold'
              }
            });
          });
      }
    });
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const adminCount = employees.filter(
    (e) => e.role === 'ROLE_ADMIN' || e.role === 'ADMIN'
  ).length;

  return (
    <div
      className="container-fluid px-3 px-md-4 py-4"
      style={{ background: 'linear-gradient(160deg, #F5FBF7 0%, #EAF6EE 100%)', minHeight: '100vh' }}
    >

      {/* Hero Header */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2F9E68 0%, #1E6B45 100%)',
          boxShadow: '0 20px 50px -20px rgba(30,107,69,0.5)'
        }}
      >
        <span
          className="position-absolute rounded-circle"
          style={{ width: 160, height: 160, background: '#63C68C', opacity: 0.18, top: -60, right: -40 }}
        />
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4 position-relative">
          <div>
            <h2 className="fw-bold mb-2 text-white">Employee Management</h2>
            <p className="mb-0 fs-6" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Manage employees, monitor roles, and maintain system access.
            </p>
          </div>

          <button
            className="btn btn-lg px-4 fw-semibold border-0"
            onClick={fetchEmployees}
            style={{ backgroundColor: '#FFFFFF', color: '#1E6B45', borderRadius: '12px' }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div
          className="alert border-0 mb-3"
          style={{ backgroundColor: '#FDECEA', color: '#C0392B', borderRadius: '12px', padding: '14px 18px' }}
        >
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div
          className="alert border-0 mb-3"
          style={{ backgroundColor: '#E9F8EE', color: '#1E6B45', borderRadius: '12px', padding: '14px 18px' }}
        >
          ✅ {successMsg}
        </div>
      )}

      {/* Admin count chip */}
      <div className="mb-3">
        <span
          className="badge fw-semibold"
          style={{ background: '#EFF3FE', color: '#3457D5', padding: '7px 14px', borderRadius: '999px', fontSize: '0.85rem' }}
        >
          {adminCount} admin{adminCount === 1 ? '' : 's'} of {employees.length} total
        </span>
      </div>

      {/* Search + Table */}
      <div
        className="overflow-hidden"
        style={{ borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #DDEFE3' }}
      >

        {/* Top Bar */}
        <div className="p-4" style={{ borderBottom: '1px solid #EAF2EC' }}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h5 className="fw-bold mb-1" style={{ color: '#16241C' }}>All Employees</h5>
              <p className="mb-0" style={{ color: '#7F8C8D' }}>
                Search and manage registered users
              </p>
            </div>

            <div className="position-relative" style={{ minWidth: 280 }}>
              <input
                type="text"
                className="form-control form-control-lg shadow-none ps-5"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  backgroundColor: '#F5FBF7',
                  color: '#16241C',
                  border: '1.5px solid #DDEFE3',
                  borderRadius: '12px'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#27AE60'; e.target.style.boxShadow = '0 0 0 4px rgba(39,174,96,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#DDEFE3'; e.target.style.boxShadow = 'none'; }}
              />
              <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: '#A6B3AB' }}
              >
                🔍
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: '#2F9E68' }}></div>
            <p className="mt-3 mb-0 fw-semibold" style={{ color: '#1E6B45' }}>Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-4 mb-3">👥</div>
            <h5 className="fw-bold" style={{ color: '#16241C' }}>No employees found</h5>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ backgroundColor: '#F5FBF7' }}>
                <tr>
                  <th className="ps-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Employee</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Email</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Role</th>
                  <th className="py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Joined</th>
                  <th className="text-end pe-4 py-3 fw-semibold" style={{ color: '#16241C', border: 'none' }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: 44, height: 44, backgroundColor: '#EAF6EE', color: '#1E6B45' }}
                        >
                          {emp.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <div className="fw-semibold" style={{ color: '#16241C' }}>{emp.name}</div>
                          <small style={{ color: '#A6B3AB' }}>ID: #{emp.id}</small>
                        </div>
                      </div>
                    </td>

                    <td className="py-3" style={{ color: '#5B6D62' }}>{emp.email}</td>

                    <td className="py-3">
                      <span
                        className="badge px-3 py-2 fw-semibold"
                        style={
                          emp.role === 'ROLE_ADMIN' || emp.role === 'ADMIN'
                            ? { backgroundColor: '#EFF3FE', color: '#3457D5', borderRadius: '999px' }
                            : { backgroundColor: '#F5FBF7', color: '#5B6D62', border: '1px solid #DDEFE3', borderRadius: '999px' }
                        }
                      >
                        {emp.role?.replace('ROLE_', '')}
                      </span>
                    </td>

                    <td className="py-3" style={{ color: '#5B6D62' }}>
                      {emp.createdAt
                        ? new Date(emp.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    <td className="text-end pe-4 py-3">
                      <button
                        className="btn rounded-3 px-3 fw-semibold"
                        onClick={() => handleDelete(emp.id)}
                        style={{
                          background: 'transparent',
                          color: '#C0392B',
                          border: '1.5px solid #F3C7C0'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEmployees;
