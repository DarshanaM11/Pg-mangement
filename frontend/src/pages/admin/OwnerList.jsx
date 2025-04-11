import { useEffect, useState } from "react";
import { Typography, Paper, Button } from "@mui/material";
import { toast } from "react-toastify";
import ViewModal from "../../components/ViewModal";

const OwnerList = () => {
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/admin/owners", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch owners");

                const data = await res.json();
                setOwners(data);
            } catch (error) {
                console.error("Error fetching owners:", error);
                toast.error("Failed to load owners");
            }
        };

        fetchOwners();
    }, [token]);

    const handleDelete = async (ownerId) => {
        if (!window.confirm("Are you sure you want to delete this owner?")) return;

        try {
            const res = await fetch(`http://localhost:5001/api/admin/owners/${ownerId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to delete owner");
            }

            setOwners(prev => prev.filter(owner => owner._id !== ownerId));
            toast.success("Owner deleted successfully ✅");
        } catch (error) {
            console.error("Error deleting owner:", error);
            toast.error(error.message || "Failed to delete owner ❌");
        }
    };

    const handleView = (owner) => {
        setSelectedOwner(owner);
        setModalOpen(true);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Owner List</Typography>
            {owners.map(owner => (
                <Paper key={owner._id} style={{ padding: "1rem", margin: "1rem 0" }}>
                    <Typography>Name: {owner.username}</Typography>
                    <Typography>Email: {owner.email}</Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleView(owner)}
                        style={{ marginRight: 10 }}
                    >
                        View
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(owner._id)}
                    >
                        Delete
                    </Button>
                </Paper>
            ))}

            <ViewModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                data={selectedOwner}
                title="Owner Details"
            />
        </div>
    );
};

export default OwnerList;
