import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create();

// Request interceptor to add the JWT token to headers
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
