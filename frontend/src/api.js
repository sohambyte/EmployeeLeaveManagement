import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

let isSessionExpiredShowing = false;
let navigateFunction = null;

export const setNavigate = (nav) => {
  navigateFunction = nav;
};

export const triggerSessionExpired = () => {
  if (isSessionExpiredShowing) return;
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
    if (navigateFunction) {
      navigateFunction('/login');
    } else {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  });
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !error.config?.url?.includes('/api/auth/')) {
      triggerSessionExpired();
    }
    return Promise.reject(error);
  }
);

export default api;
