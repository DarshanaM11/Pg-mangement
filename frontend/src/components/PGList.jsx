import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from "@mui/material";
import { toast } from "react-toastify";

const PGList = ({ status, title }) => {
    const [pgs, setPgs] = useState([]);
    const [selectedPG, setSelectedPG] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/admin/pgs/${status}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch PGs");

                const data = await res.json();
                setPgs(data);
            } catch (error) {
                console.error("Error fetching PGs:", error);
                toast.error("Failed to load PGs");
            }
        };

        fetchPGs();
    }, [status, token]);

    const handleView = (pg) => {
        setSelectedPG(pg);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedPG(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Typography variant="h4" sx={{ mb: 2 }}>{title}</Typography>

            {pgs.map(pg => (
                <Paper key={pg._id} sx={{ p: 2, mb: 2 }}>
                    <Typography><strong>Name:</strong> {pg.name}</Typography>
                    <Typography><strong>Owner:</strong> {pg.owner.username}</Typography>
                    <Typography><strong>Contact:</strong> {pg.contact}</Typography>
                    <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleView(pg)}>View</Button>
                </Paper>
            ))}

            {/* Modal starts here */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>PG Details</DialogTitle>
                <DialogContent dividers>
                    {selectedPG && (
                        <>
                            <Typography><strong>Name:</strong> {selectedPG.name}</Typography>
                            <Typography><strong>Location:</strong> {selectedPG.location}</Typography>
                            <Typography><strong>Price:</strong> ₹{selectedPG.price}</Typography>
                            <Typography><strong>Description:</strong> {selectedPG.description}</Typography>
                            <Typography><strong>Contact:</strong> {selectedPG.contact}</Typography>
                            <Typography><strong>Status:</strong> {selectedPG.status}</Typography>

                            <Typography sx={{ mt: 2 }}><strong>Amenities:</strong></Typography>
                            <ul>
                                {selectedPG.amenities?.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>

                            {selectedPG.images?.length > 0 && (
                                <>
                                    <Typography sx={{ mt: 2 }}><strong>Images:</strong></Typography>
                                    <Grid container spacing={2}>
                                        {selectedPG.images.map((img, index) => (
                                            <Grid item xs={6} key={index}>
                                                <img
                                                    src={img}
                                                    alt={`PG-${index}`}
                                                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PGList;
