import React from 'react';
import doctor from '../../images/istockphoto-1437830105-612x612.jpg'; // Import your image file
import hospital from '../../images/hos2.jpg';
import { useNavigate } from 'react-router-dom';
import './Hospital.css';

const Hospital = () => {
  const navigate = useNavigate();
  const login = () => {
    navigate('/hospital_login');
  };

  return (
    <div>
      <div className="hospital-container">
        <img src={doctor} alt="Doctor" className="hospital-image" />
        <div className="hospital-content">
          <h1 className="hospital-title">HOSPITAL PORTAL</h1>
          <div className="hospital-images">
            <img src={hospital} alt="Hospital 1" className="hospital-image-small" />
            <img src={hospital} alt="Hospital 2" className="hospital-image-small" />
            <img src={hospital} alt="Hospital 3" className="hospital-image-small" />
          </div>
          <button className="login-btn" onClick={login}>Login as Hospital</button>
        </div>
      </div>
    </div>
  );
};

export default Hospital;
