import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();

    const links = [
        { label: "Dashboard Home", path: "/admin-dashboard" },
        { label: "Owner List", path: "/admin-dashboard/owners" },
        { label: "User List", path: "/admin-dashboard/users" },
        { label: "Pending PGs", path: "/admin-dashboard/pending-pgs" },
    ];

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <List>
                {links.map(({ label, path }) => (
                    <ListItem button key={label} onClick={() => { navigate(path); onClose(); }}>
                        <ListItemText primary={label} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
