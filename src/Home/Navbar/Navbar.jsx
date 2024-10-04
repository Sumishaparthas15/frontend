import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    // const navigate=useNavigate()

    // const login =() =>{
    //     navigate('/login')
    // }
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">Med Link</Link>
            </div>
            <div className="navbar-center">
                <Link to="/" className="navbar-item">Home</Link>
                <Link to="/about" className="navbar-item">About Us</Link>
                <Link to="/department" className="navbar-item">Department</Link>
                <Link to="/review" className="navbar-item">Review</Link>
                <Link to="/hospital" className="navbar-item">Hospital</Link>
            </div>
            {/* <div className="navbar-right">
                <button className="navbar-signup" onClick={login}>Login</button>
            </div> */}
        </nav>
    );
};

export default Navbar;
