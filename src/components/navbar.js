import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {user ? `Welcome, ${user.email}` : 'Welcome'}
                    </Typography>
                    <Box>
                        {user ? (
                            <Button
                                onClick={handleLogout}
                                variant="text"
                                sx={{ color: 'white' }}
                            >
                                Logout
                            </Button>
                        ) : null}
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Navbar;
