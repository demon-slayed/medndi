import axios from "axios";
import useAppStore from "@/store/useAppStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// The auth cookie can expire while the persisted `auth` still says logged in.
// Clearing it on any 401 makes RequireAuth send the user back to /login.
export const installSessionInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error?.config?.url ?? "";
      if (error?.response?.status === 401 && !url.endsWith("/users/login")) {
        useAppStore.getState().setAuth(null);
      }
      return Promise.reject(error);
    }
  );
};

// Re-validates the persisted user against the server on app load.
export const refreshSession = async () => {
  const { auth, setAuth } = useAppStore.getState();
  if (!auth?._id) return;
  try {
    const res = await axios.get(`${BASE_URL}/users/profile`, { withCredentials: true });
    setAuth(res.data?.user ?? null);
  } catch {
    // 401 is handled by the interceptor; keep the session on network errors
  }
};
