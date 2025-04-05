// components/ViewModal.jsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

const ViewModal = ({ open, onClose, data, title }) => {
    if (!data) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontSize: "1.6rem", fontWeight: "bold", pb: 2 }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
                    <strong>Name:</strong> {data.username}
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
                    <strong>Email:</strong> {data.email}
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
                    <strong>Phone:</strong> {data.phone || "N/A"}
                </Typography>
                {/* <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
                    <strong>Role:</strong> {data.role}
                </Typography> */}
                {/* Add more fields with same style if needed */}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="primary" variant="outlined" size="large">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewModal;
