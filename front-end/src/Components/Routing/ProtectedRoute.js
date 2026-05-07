import { Navigate, useLocation } from "react-router-dom";

const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp * 1000;
        return Date.now() > expiry;
    } catch {
        return true;
    }
};

function ProtectedRoute({ children, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
    const token = localStorage.getItem("token");

    if(isTokenExpired(token)){
        localStorage.clear();
        return <Navigate to="/" replace />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (location.pathname.startsWith("/employee") && !user.isEmployee) {
        return <Navigate to="/" replace />;
    }

    if (location.pathname.startsWith("/citizen") && user.isEmployee) {
        return <Navigate to="/" replace />;
    }

    if(allowedRoles && !allowedRoles.includes(user?.role)){
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;