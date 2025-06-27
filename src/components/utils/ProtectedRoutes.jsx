import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

export default function ProtectedRoutes() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}
