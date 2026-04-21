import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

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