import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000/api";
const baseURL = rawBaseUrl.replace(/\/$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("auth_user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    const isAuthCall =
      original?.url?.includes("/auth/refresh") ||
      original?.url?.includes("/auth/login");

    if (status !== 401 || !original || original._retry || isAuthCall) {
      if (
        status === 401 &&
        isAuthCall &&
        original?.url?.includes("/auth/refresh")
      ) {
        forceLogout();
      }
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      // One shared refresh call even if several requests 401 at once
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/auth/refresh`, null, { withCredentials: true })
          .then((res) => {
            const newToken = res.data.token;
            localStorage.setItem("token", newToken);
            return newToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      forceLogout();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
