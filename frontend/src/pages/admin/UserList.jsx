import { useEffect, useState } from "react";
import { Typography, Paper, Button, CircularProgress, Box } from "@mui/material";
import { toast } from "react-toastify";
import ViewModal from "../../components/ViewModal";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/admin/users", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to delete user");
            }

            setUsers(prev => prev.filter(user => user._id !== userId));
            toast.success("User deleted successfully ✅");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.message || "Failed to delete user ❌");
        }
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>User List</Typography>
            {users.length === 0 ? (
                <Typography>No users found.</Typography>
            ) : (
                users.map(user => (
                    <Paper key={user._id} style={{ padding: "1rem", margin: "1rem 0" }}>
                        <Typography>Name: {user.username}</Typography>
                        <Typography>Email: {user.email}</Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleView(user)}
                            style={{ marginRight: 10 }}
                        >
                            View
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(user._id)}
                        >
                            Delete
                        </Button>
                    </Paper>
                ))
            )}

            <ViewModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                data={selectedUser}
                title="User Details"
            />
        </div>
    );
};

export default UserList;
