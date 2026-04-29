import { useState } from "react";
import styles from "./Admin.module.css";

function AssignRoles() {
    const [users, setUsers] = useState([
        { id: 1, name: "Ali Hassan", role: "Citizen" },
        { id: 2, name: "Maya Elias", role: "Employee" },
        { id: 3, name: "Karim Raad", role: "Engineer" },
        { id: 4, name: "Sarah Nader", role: "Secretary" },
        { id: 5, name: "Omar Khalil", role: "Staff" }
    ]);

    const changeRole = (id, newRole) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, role: newRole }
                : user
        ));
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
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.role}</td>

                                    <td>
                                        <select
                                            className={styles.select}
                                            value={user.role}
                                            onChange={(e) =>
                                                changeRole(user.id, e.target.value)
                                            }
                                        >
                                            <option>Citizen</option>
                                            <option>Employee</option>
                                            <option>Admin</option>
                                            <option>Mayor</option>
                                            <option>Secretary</option>
                                            <option>Engineer</option>
                                            <option>Lawyer</option>
                                            <option>Financial Staff</option>
                                            <option>Staff</option>
                                        </select>
                                    </td>

                                    <td>
                                        <button className={styles.blueBtn}>
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