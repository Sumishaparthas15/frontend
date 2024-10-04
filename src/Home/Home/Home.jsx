import React from 'react';
import doctor from '../../images/dr3.jpg'; // Import your image file
import './Home.css'; // Import your external CSS file
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const login = () => {
    navigate('/LOGIN');
  };

  return (
    <div className="homepage-container">
      <img src={doctor} alt="Doctor" className="homepage-image" />
      <div className="content">
        <h1 className="homepage-title">LET US BRIGHTEN <br></br>YOUR SMILE</h1>
        <button className="login-btn" onClick={login}>Login</button>
      </div>
    </div>
  );
};

export default Home;
