import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
} from "@mui/material";
import { toast } from "react-toastify";

const ApprovedPGList = () => {
    const [pgs, setPgs] = useState([]);
    const [selectedPG, setSelectedPG] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchApprovedPGs = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:5001/api/pg/owner/approved", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch approved PGs");

                const data = await res.json();
                setPgs(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load approved PGs.");
            }
        };

        fetchApprovedPGs();
    }, []);

    const handleView = (pg) => {
        setSelectedPG(pg);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedPG(null);
        setIsModalOpen(false);
    };

    return (
        <div style={{ padding: '2%' }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>Approved PGs</Typography>

            {pgs.map(pg => (
                <Paper elevation={5} key={pg._id} sx={{ p: 1.5, mb: 2, backgroundColor: "#3946a958", display: 'flex', justifyContent: "space-between" }}>
                    <div>
                        <Typography sx={{ fontSize: "1vw" }}><strong>Name:</strong> {pg.name}</Typography>
                        <Typography sx={{ fontSize: "1vw" }}><strong>Location:</strong> {pg.location}</Typography>
                        <Typography sx={{ fontSize: "1vw" }}><strong>Price:</strong> ₹{pg.price}</Typography>
                    </div>
                    <div>
                        <Button variant="contained" sx={{ mt: 1, fontSize: "0.9vw", mr: 3 }} onClick={() => handleView(pg)}>
                            View Details
                        </Button>
                    </div>


                </Paper>
            ))}

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontSize: "1.5vw" }}><strong> PG Details</strong></DialogTitle>
                <DialogContent dividers sx={{
                    maxHeight: "70vh",  // adjust height as needed
                    overflowY: "auto",   // vertical scroll
                }}>
                    {selectedPG && (
                        <>
                            <Typography sx={{ fontSize: "1vw", mb: 1 }}><strong>Name:</strong> {selectedPG.name}</Typography>
                            <Typography sx={{ fontSize: "1vw", mb: 1 }}><strong>Location:</strong> {selectedPG.location}</Typography>
                            <Typography sx={{ fontSize: "1vw", mb: 1 }}><strong>Price:</strong> ₹{selectedPG.price}</Typography>
                            <Typography sx={{ fontSize: "1vw", mb: 1 }}><strong>Description:</strong> {selectedPG.description}</Typography>
                            <Typography sx={{ fontSize: "1vw", mb: 1 }}><strong>Contact:</strong> {selectedPG.contact}</Typography>

                            <Typography sx={{ fontSize: "1vw", mb: 1 }}><strong>Amenities:</strong></Typography>
                            <ul>
                                {selectedPG.amenities?.map((item, idx) => (
                                    <li key={idx} style={{ fontSize: "16px", marginLeft: '2px' }}>{item}</li>
                                ))}
                            </ul>


                            {selectedPG.images?.length > 0 && (
                                <>
                                    {/* <Typography sx={{ mt: 2 }}><strong>Images:</strong></Typography> */}
                                    <Grid container spacing={2}>
                                        {Array.isArray(selectedPG?.images) && selectedPG?.images.filter(Boolean).length > 0 ? (
                                            <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                                                <Typography sx={{ fontSize: "1vw", mb: 1, mt: 3 }}><strong>Images:</strong></Typography>
                                                <Grid container spacing={2}>
                                                    {selectedPG.images.filter(Boolean).map((img, index) => (
                                                        <Grid item xs={6} key={index}>
                                                            <img
                                                                src={
                                                                    img?.startsWith("http")
                                                                        ? img
                                                                        : `http://localhost:5001/uploads/${img}`
                                                                }
                                                                alt={`PG-${index}`}
                                                                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                                                                onError={(e) => { e.target.src = "/fallback-image.jpg"; }}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </div>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                                No images uploaded.
                                            </Typography>
                                        )}

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

export default ApprovedPGList;
