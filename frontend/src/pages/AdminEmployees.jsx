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
      background: '#1a1a1a',
      color: '#ffffff',
      confirmButtonColor: '#FFD700',
      cancelButtonColor: '#2a2a2a',
      customClass: {
        confirmButton: 'text-dark fw-bold',
        cancelButton: 'text-white'
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
              background: '#1a1a1a',
              color: '#ffffff',
              confirmButtonColor: '#FFD700',
              customClass: {
                confirmButton: 'text-dark fw-bold'
              }
            });
          })
          .catch((err) => {
            if (err?.response?.status === 401) return;
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete employee.',
              icon: 'error',
              background: '#1a1a1a',
              color: '#ffffff',
              confirmButtonColor: '#FFD700',
              customClass: {
                confirmButton: 'text-dark fw-bold'
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
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#0f0f0f', color: '#ffffff', minHeight: '100vh' }}>

      {/* Hero Header */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a, #000000)',
          border: '1px solid #FFD700'
        }}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
          <div>
            <h2 className="fw-bold mb-2" style={{ color: '#FFD700' }}>👥 Employee Management</h2>
            <p className="mb-0 fs-5" style={{ color: '#cfcfcf' }}>
              Manage employees, monitor roles, and maintain system access.
            </p>
          </div>

          <button
            className="btn btn-lg px-4 fw-semibold"
            onClick={fetchEmployees}
            style={{ backgroundColor: '#FFD700', color: '#000000', border: 'none' }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger border-0 shadow-sm" style={{ backgroundColor: '#2c0b0e', color: '#ea868f', border: '1px solid #842029' }}>
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success border-0 shadow-sm" style={{ backgroundColor: '#0f291e', color: '#75b798', border: '1px solid #0f5132' }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Search + Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>

        {/* Top Bar */}
        <div className="card-header border-0 p-4" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h5 className="fw-bold mb-1" style={{ color: '#FFD700' }}>All Employees</h5>
              <p className="mb-0" style={{ color: '#cfcfcf' }}>
                Search and manage registered users
              </p>
            </div>

            <div className="position-relative" style={{ minWidth: 280 }}>
              <input
                type="text"
                className="form-control form-control-lg rounded-3 ps-5"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ backgroundColor: '#0f0f0f', color: '#ffffff', borderColor: '#2a2a2a' }}
              />
              <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: '#cfcfcf' }}
              >
                🔍
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: '#FFD700' }}></div>
            <p className="mt-3 mb-0" style={{ color: '#cfcfcf' }}>Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-4 mb-3">👥</div>
            <h5 style={{ color: '#cfcfcf' }}>No employees found</h5>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ color: '#000000' }}>
              <thead className="sticky-top" style={{ backgroundColor: '#FFD700', color: '#000000' }}>
                <tr>
                  <th className="ps-4 py-3" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Employee</th>
                  <th className="py-3" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Email</th>
                  <th className="py-3" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Role</th>
                  <th className="py-3" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Joined</th>
                  <th className="text-end pe-4 py-3" style={{ color: '#000000', borderBottom: '1px solid #2a2a2a' }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #2a2a2a', color: '#000000' }}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: 48, height: 48, backgroundColor: '#FFD700', color: '#000000' }}
                        >
                          {emp.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <div className="fw-semibold" style={{ color: '#000000' }}>{emp.name}</div>
                          <small style={{ color: '#000000' }}>ID: #{emp.id}</small>
                        </div>
                      </div>
                    </td>

                    <td className="py-3" style={{ color: '#000000' }}>{emp.email}</td>

                    <td className="py-3">
                      <span
                        className="badge px-3 py-2"
                        style={
                          emp.role === 'ROLE_ADMIN' || emp.role === 'ADMIN'
                            ? { backgroundColor: '#FFD700', color: '#000000' }
                            : { backgroundColor: '#2a2a2a', color: '#ffffff', border: '1px solid #2a2a2a' }
                        }
                      >
                        {emp.role?.replace('ROLE_', '')}
                      </span>
                    </td>

                    <td className="py-3" style={{ color: '#000000' }}>
                      {emp.createdAt
                        ? new Date(emp.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    <td className="text-end pe-4 py-3">
                      <button
                        className="btn btn-outline-danger rounded-3 px-3"
                        onClick={() => handleDelete(emp.id)}
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