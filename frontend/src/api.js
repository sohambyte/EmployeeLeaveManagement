import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

let isSessionExpiredShowing = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !error.config?.url?.includes('/api/auth/')) {
      if (!isSessionExpiredShowing) {
        isSessionExpiredShowing = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        Swal.fire({
          title: 'Session Expired',
          text: 'Your session has expired. Please login again.',
          icon: 'warning',
          confirmButtonText: 'OK'
        }).then(() => {
          isSessionExpiredShowing = false;
          window.location.href = '/login';
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
