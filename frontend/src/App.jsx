    import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyLeave from './pages/ApplyLeave';
import MyLeaves from './pages/MyLeaves';
import AdminLeaves from './pages/AdminLeaves';
import AdminEmployees from './pages/AdminEmployees';
import { useEffect } from 'react';
// Helper component to redirect to the correct dashboard based on role
function DefaultRedirect() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  useEffect(() => { const token = localStorage.getItem('token'); if (!token) return; try { const payload = JSON.parse(atob(token.split('.')[1])); const expiryTime = payload.exp * 1000; // convert to milliseconds 
  const currentTime = Date.now(); const remainingTime = expiryTime - currentTime; console.log('Token expires at:', new Date(expiryTime)); console.log('Remaining ms:', remainingTime); if (remainingTime <= 0) { localStorage.removeItem('token'); localStorage.removeItem('user'); Swal.fire({ icon: 'warning', title: 'Session Expired', text: 'Please login again.', confirmButtonColor: '#FFD700' }).then(() => { window.location.href = '/login'; }); return; } const timer = setTimeout(() => { localStorage.removeItem('token'); localStorage.removeItem('user'); Swal.fire({ icon: 'warning', title: 'Session Expired', text: 'Please login again.', confirmButtonColor: '#FFD700' }).then(() => { window.location.href = '/login'; }); }, remainingTime); return () => clearTimeout(timer); } catch (error) { console.error('Invalid token', error); localStorage.removeItem('token'); localStorage.removeItem('user'); } }, []);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === 'ROLE_ADMIN' || user.role === 'ADMIN';
  return <Navigate to={isAdmin ? '/admin-dashboard' : '/dashboard'} replace />;
}

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee-only Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute employeeOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-leave"
            element={
              <ProtectedRoute employeeOnly={true}>
                <ApplyLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-leaves"
            element={
              <ProtectedRoute employeeOnly={true}>
                <MyLeaves />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-leaves"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-employees"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminEmployees />
              </ProtectedRoute>
            }
          />

          {/* Default: redirect based on role */}
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
