import { useNavigate } from "react-router-dom";

function NotFound() {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <>
            <h1>Page Not Found</h1>
            <button onClick={
                () => {
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    navigate("/")
                }}>Return to Login</button>
        </>
    );

}

export default NotFound;