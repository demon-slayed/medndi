import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useAppStore from "@/store/useAppStore";

// Sends logged-out visitors to /login (and back afterwards); optionally restricts by role.
const RequireAuth = ({ role, children }) => {
  const { auth, setRedirectPath } = useAppStore();
  const location = useLocation();
  const isLoggedIn = Boolean(auth?._id);
  const hasRole = !role || auth?.role === role;

  useEffect(() => {
    if (!isLoggedIn) {
      setRedirectPath(location.pathname + location.search);
      toast("Please sign in to continue", { id: "require-auth" });
    } else if (!hasRole) {
      toast.error("You don't have access to that page", { id: "require-role" });
    }
  }, [isLoggedIn, hasRole, location.pathname, location.search, setRedirectPath]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!hasRole) return <Navigate to="/" replace />;
  return children;
};

export default RequireAuth;
