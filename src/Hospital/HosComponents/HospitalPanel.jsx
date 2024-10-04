import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { Home as HomeIcon, AccountCircle } from '@mui/icons-material';

const HospitalPanel = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Check if email exists in localStorage and navigate to login page if not
    useEffect(() => {
        const storedEmail = localStorage.getItem('hospitalEmail');
        if (!storedEmail) {
            navigate('/LOGIN'); // Redirect to login if no email is found
        } else {
            setEmail(storedEmail);
        }
    }, [navigate]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Remove email and other session data from localStorage
        localStorage.removeItem('hospitalEmail');
        localStorage.removeItem('hospital_id');
        localStorage.removeItem('token');
        // Optionally remove other session-related data here
        // Navigate to login page
        navigate('/LOGIN');
    };

    const styles = {
        department_items: {
            marginLeft: '20px',
        },
        admin_container: {
            width: '250px',
            backgroundColor: 'rgb(40, 155, 145)',
            padding: '20px',
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            zIndex: 999,
        },
        main_content: {
            marginLeft: '250px', // Adjust based on the width of the sidebar
            marginTop: '64px', // Adjust based on the height of the AppBar
            padding: '20px',
        },
        flexContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
        },
        flexItem: {
            marginLeft: '10px',
            marginRight: '10px',
        },
    };

    return (
        <div>
            <AppBar position="fixed" style={{ zIndex: 1201, backgroundColor: 'rgb(40, 155, 145)' }}>
                <Toolbar style={styles.flexContainer}>
                    <Typography variant="h4" style={{ flexGrow: 1 }}>
                        MedLink
                    </Typography>
                    <IconButton edge="start" color="inherit" aria-label="home" onClick={() => navigate('/hospitalView')} style={styles.flexItem}>
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" style={styles.flexItem}>
                        Home
                    </Typography>
                    <div style={styles.flexItem}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem>{email}</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <div className='admin_container' style={styles.admin_container}>
                <div className="admin-sidebar">
                    <div className="sidebar-header">
                        {/* <h3>MedLink</h3> */}
                    </div>
                    <br></br>
                    <ul className="sidebar-menu">
                        <Link to='/hospital_dashboard' className="navbar-brand">Dashboard</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/hospital_departments' className="navbar-brand">Departments</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/hospital_doctors' className="navbar-brand">Doctors</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/hospital_bookings' className="navbar-brand">Bookings</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/hospital_patients' className="navbar-brand">Patients</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/hospital_notifications' className="navbar-brand">Notifications</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/hospital_feedback' className="navbar-brand">Feedback</Link>
                    </ul>
                    
                    <ul className="sidebar-menu">
                        <Link to='/hospital_profile' className="navbar-brand">Profile</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/hospital_premium' className="navbar-brand">Premium</Link>
                    </ul>
                   
                </div>
            </div>
            <div style={styles.main_content}>
                {/* Main content goes here */}
            </div>
        </div>
    );
};

export default HospitalPanel;
