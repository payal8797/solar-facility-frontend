import { Box, Tab, Tabs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const SideMenu = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    return (
        <>
            {user &&
            <Box sx={{ width: '240px', paddingTop: '20px', height: '100%', backgroundColor: '#f0f0f0', boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={location.pathname}
                sx={{ paddingLeft: '8px' }}
            >
                <Tab
                    label="Manage Facility"
                    value="/facility-management"
                    component={Link}
                    to="/facility-management"
                    sx={{
                        borderRadius: '0px',
                        backgroundColor: location.pathname === '/facility-management' ? 'grey.300' : 'inherit'
                      }}
                />
                <Tab
                    label="Performance"
                    value="/facility-upload"
                    component={Link}
                    to="/facility-upload"
                    sx={{
                        borderRadius: '0px',
                        backgroundColor: location.pathname === '/facility-upload' ? 'grey.300' : 'inherit'
                      }}
                />
            </Tabs>
        </Box>}
        </>
    );
}

export default SideMenu;
