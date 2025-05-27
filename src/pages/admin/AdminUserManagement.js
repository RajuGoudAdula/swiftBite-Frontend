import React, { useEffect, useState } from "react";
import { FaTrash, FaUser, FaEnvelope, FaPhone, FaUserShield, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styles from "../../styles/AdminUserManagement.module.css";
import adminApi from "../../api/adminApi";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsersForAdmin();
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminApi.deleteUserByAdmin(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className={styles.loading}>Loading users...</div>;

  return (
    <div className={styles.container}>
      <h2>User Management</h2>

      {/* Desktop Table */}
      <div className={styles.desktopTableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || "—"}</td>
                <td>{user.role}</td>
                <td>
                {user.isVerified ? (
                    <FaCheckCircle style={{ color: "#34C759", fontSize: "1.2rem" }} aria-label="Verified" title="Verified" />
                ) : (
                    <FaTimesCircle style={{ color: "#FF3B30", fontSize: "1.2rem" }} aria-label="Not Verified" title="Not Verified" />
                )}
                </td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteUser(user._id)}
                    title="Delete user"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCardWrapper}>
        {users.map((user) => (
          <div className={styles.userCard} key={user._id}>
            <div className={styles.cardRow}>
              <FaUser className={styles.icon} />
              <span className={styles.cardLabel}>:</span>
              <span>{user.name}</span>
            </div>
            <div className={styles.cardRow}>
              <FaEnvelope className={styles.icon} />
              <span className={styles.cardLabel}>:</span>
              <span>{user.email}</span>
            </div>
            <div className={styles.cardRow}>
              <FaPhone className={styles.icon} />
              <span className={styles.cardLabel}>:</span>
              <span>{user.phone || "—"}</span>
            </div>
            <div className={styles.cardRow}>
              <FaUserShield className={styles.icon} />
              <span className={styles.cardLabel}>:</span>
              <span>{user.role}</span>
            </div>
            <div className={styles.cardRow}>
              <FaCheckCircle className={styles.icon} />
              <span className={styles.cardLabel}>:</span>
              <span>{user.isVerified ? "Yes" : "No"}</span>
            </div>
            <div className={styles.cardActions}>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteUser(user._id)}
                title="Delete user"
              >
                <FaTrash />
                <span className={styles.deleteText}>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserManagement;
