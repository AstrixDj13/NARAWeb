import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RedirectWhenLoggedIn(){
    const isAuthenticated = useSelector(state=>state.user.isAuthenticated);

    if(isAuthenticated) return <Navigate to={"/"} />;
    return <Outlet />
}