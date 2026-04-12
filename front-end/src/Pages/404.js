import { useNavigate } from "react-router-dom";

function NotFound() {

    const navigate = useNavigate();
    return (
        <>
            <h1>Page Not Found</h1>
            <button onClick={() => navigate("/")}>Return to Login</button>
        </>
    );

}

export default NotFound;