import styles from "../../Pages/Login.module.css"; 

function RegisterForm() {
    return (
        <form className={styles.loginForm}>
            <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input type="text" placeholder="Enter your Full Name" />
            </div>

            <div className={styles.inputGroup}>
                <label>ID Number</label>
                <input type="text" placeholder="Enter your ID number" />
            </div>

            <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input type="text" placeholder="Enter your Phone number" />
            </div>

            <div className={styles.inputGroup}>
                <label>Email</label>
                <input type="email" placeholder="Enter your Email" />
            </div>

            <button type="submit" className={styles.loginButton}>
                Send Request
            </button>
        </form>
    );
}

export default RegisterForm;