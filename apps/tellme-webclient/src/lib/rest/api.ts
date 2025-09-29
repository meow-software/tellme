// axios instance
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Include cookies (access & refresh)
})

api.interceptors.request.use((config) => {
  const csrf = localStorage.getItem('csrfToken');
  if (csrf) {
    config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
});

// Intercepteur pour refresh
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config

    // Pas la peine de refresh 
    const excludedRoutes = ['/auth/login', '/auth/register', '/auth/refresh'];

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !excludedRoutes.some(route => originalRequest.url?.includes(route))
    ) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');
        // TODO: update csrf in localStorage
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error)
  }
)

export { api as API };
