import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { Home as HomeIcon, AccountCircle } from '@mui/icons-material';

const PatPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('patientEmail');
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
    localStorage.removeItem('patientEmail');
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
    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
  
};
  return (
    <div style={styles.appContainer}>
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
                    {/* <br></br> */}
                    <p className="navbar-brand">{email}</p>
                    <ul className="sidebar-menu">
                        
                        <p className="navbar-brand">(Patient)</p>
                    </ul>
                    <br></br>
                    <ul className="sidebar-menu">
                        <Link to='/bookop'  style={styles.link} >Book OP</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/op_history' className="navbar-brand">OP History</Link>
                    </ul>
                    {/* <ul className="sidebar-menu">
                        <Link to='/revisit-status' className="navbar-brand">Revisit Status</Link>
                    </ul> */}
                    <ul className="sidebar-menu">
                        <Link to='/notifications' className="navbar-brand">Notification</Link>
                    </ul>
                     <ul className="sidebar-menu">
                        <Link to='/wallet' className="navbar-brand">Wallet</Link>
                    </ul>
                    <ul className="sidebar-menu">
                        <Link to='/changeprofile' className="navbar-brand"> Profile</Link>
                    </ul>
                     {/* <ul className="sidebar-menu">
                        <Link to='/' className="navbar-brand">Logout</Link>
                    </ul>  */}
                   
                </div>
            </div>
            <div style={styles.main_content}>
                {/* Main content goes here */}
            </div>
       
      {/* <aside style={styles.sidebar}>
        <div style={styles.sidebarUserInfo}>
          <h2 style={styles.sidebarUserInfoName}>{email}</h2>
          <p style={styles.sidebarUserInfoRole}>Patient</p>
        </div>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="/bookop" style={styles.link}>Book OP</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/op-history" style={styles.link}>OP History</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/revisit-status" style={styles.link}>Revisit Status</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/change-profile" style={styles.link}>Change Profile</Link>
            </li>
            <li style={styles.navItem} onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </nav>
      </aside> */}

    </div>
  );
};

export default PatPanel;
