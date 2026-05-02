import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Admin.module.css";

function AssignRoles() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);

    const loadData = async () => {
        try {
            const [employeesRes, rolesRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/employees`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                axios.get(`${API_URL}/api/admin/roles`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            setEmployees(employeesRes.data.data);
            setRoles(rolesRes.data.data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const changeRole = (empId, roleId) => {
        setEmployees(
            employees.map(emp =>
                emp.Emp_ID === empId
                    ? { ...emp, Role_ID: Number(roleId) }
                    : emp
            )
        );
    };

    const saveRole = async (empId, roleId) => {
        try {
            await axios.put(
                `${API_URL}/api/admin/assign-role`,
                {
                    empId,
                    roleId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Role updated successfully");
            loadData();

        } catch (err) {
            console.error(err);
            alert("Failed to update role");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Assign Roles</h1>
                <p>Manage employee access and permissions</p>
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
                            {employees.map(emp => (
                                <tr key={emp.Emp_ID}>
                                    <td>#{emp.Emp_ID}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.Role_Type}</td>

                                    <td>
                                        <select
                                            className={styles.select}
                                            value={emp.Role_ID}
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
                                                >
                                                    {role.Role_Type}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td>
                                        <button
                                            className={styles.blueBtn}
                                            onClick={() =>
                                                saveRole(
                                                    emp.Emp_ID,
                                                    emp.Role_ID
                                                )
                                            }
                                        >
                                            Save Role
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default AssignRoles;