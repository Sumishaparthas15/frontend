import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';


const AdminPanel = () => {
    const navigate = useNavigate();
    const styles={
        // department_items:{
        //     marginLeft: '20px',
        // },
        admin_container:{
            width: '250px',
            backgroundColor: 'rgb(40, 155, 145)',
            padding: '20px',
            position: 'fixed', // Fix position
            height: '100vh', // Set height to full viewport height
            overflowY: 'auto', // Enable vertical scrolling if needed
            zIndex: 999,
            
        },
        logo:{
            marginLeft: '30px',
        }


    }
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
   
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/LOGIN');
      };

  return (
    <div>
        <div className='admin_container' style={styles.admin_container}>
            <div class="admin-sidebar">
                 <div class="sidebar-header">
                    <h5 >Admin Dashboard</h5>
                            <h3 className='logo'style={styles.logo}>MediLink</h3>
                 </div>
                 <br></br>
                    <ul class="sidebar-menu">
                        <Link to='/overview' className="navbar-brand">OverView</Link>
                    </ul>
                    <ul class="sidebar-menu">
                        <Link to='/patients' className="navbar-brand">Patients</Link>
                    </ul>
                    <ul class="sidebar-menu">
                        <Link to='/Hospitals' className="navbar-brand">Hospitals</Link>
                    </ul>
                    <ul class="sidebar-menu">
                        <Link to='/HospitalRequests' className="navbar-brand">Hospital Requests </Link>
                    </ul>
                    
                    <ul class="sidebar-menu">
                        <Link to='/status' className="navbar-brand">Block & Unblock</Link>
                    </ul>
                    {/* <ul class="sidebar-menu">
                        <Link to='/Complaints' className="navbar-brand">Complaints</Link>
                    </ul>
                    <ul class="sidebar-menu">
                        <Link to='/Feedback' className="navbar-brand">Feedback</Link>
                    </ul> */}
                    <ul class="sidebar-menu">
                        <Link to='/Premium' className="navbar-brand">Premium</Link>
                    </ul>
                    <br></br><ul>
                    <button onClick={handleLogout}>Logout</button>

                    </ul>
                   
                    
                    
            </div>

        </div>
        
   </div>
  )
}

export default AdminPanel