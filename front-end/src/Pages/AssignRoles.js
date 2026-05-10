import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Admin.module.css";
import EmployeeRegisterForm from "../Components/Login/EmployeeRegisterForm";

function AssignRoles() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);

            const [employeesRes, rolesRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/employees`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/admin/roles`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const realRoles = rolesRes.data.data;

            const disabledRole = {
                Role_ID: -1,
                Role_Type: "Disabled"
            };

            setEmployees(employeesRes.data.data);
            setRoles([...realRoles, disabledRole]);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const changeRole = (empId, roleId) => {
        setEmployees(prev =>
            prev.map(emp =>
                emp.Emp_ID === empId
                    ? { ...emp, Role_ID: Number(roleId) }
                    : emp                    
            )
        );
    };

    const saveRole = async (empId, roleId) => {
        try {
            await axios.put(
                `${API_URL}/api/admin/employees/assign-role`,
                { empId, roleId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            await loadData();

        } catch (err) {
            console.error(err);
            alert("Failed to update role");
        }
    };

    const adminRole = roles.find(
        role => role.Role_Type.toLowerCase() === "admin"
    );

    const adminCount = employees.filter(
        emp =>
            emp.Active_Flg !== 0 &&
            emp.Role_ID === adminRole?.Role_ID
    ).length;

    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1>Assign Roles</h1>
                        <p>Manage employee access and permissions</p>
                    </div>

                    <button
                        className={styles.blueBtn}
                        onClick={() => setShowModal(true)}
                    >
                        + Add Employee
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Role Management</h2>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Current Role</th>
                                <th>Change Role</th>
                                <th>Save</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : employees.length > 0 ? (

                                employees.map(emp => {

                                    const isLastAdmin =
                                        emp.Active_Flg !== 0 &&
                                        emp.Role_ID === adminRole?.Role_ID &&
                                        adminCount === 1;

                                    return (
                                        <tr key={emp.Emp_ID}>
                                            <td>#{emp.Emp_ID}</td>

                                            <td>{emp.name}</td>

                                            <td>
                                                {emp.Active_Flg === 0
                                                    ? "Disabled"
                                                    : emp.Role_Type}
                                            </td>

                                            <td>
                                                <select
                                                    className={styles.select}

                                                    value={emp.Role_ID}

                                                    disabled={isLastAdmin}

                                                    onChange={(e) =>
                                                        changeRole(
                                                            emp.Emp_ID,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {roles.map(role => (
                                                        <option
                                                            key={role.Role_ID}
                                                            value={role.Role_ID}

                                                            disabled={
                                                                isLastAdmin &&
                                                                role.Role_Type !== "Admin"
                                                            }
                                                        >
                                                            {role.Role_Type}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td>
                                                <button
                                                    className={styles.blueBtn}
                                                    disabled={isLastAdmin}

                                                    onClick={() =>
                                                        saveRole(
                                                            emp.Emp_ID,
                                                            emp.Role_ID
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })

                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                                        No employees found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <EmployeeRegisterForm
                    onClose={() => setShowModal(false)}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
}

export default AssignRoles;