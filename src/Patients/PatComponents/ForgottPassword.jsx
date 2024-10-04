import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Home/Navbar/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8080/api/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send email as JSON
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('OTP has been sent to your email!');
        // Navigate to reset password page with email as state
        navigate('/resetpasswordPat', { state: { email: email } }); 
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
    }
  };

  // Styles for centering
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align items to the start (top)
    
    height: '100vh',
    marginLeft: '500px', // Adjust margin-left to push content from left
    marginTop: '50px',   // Optional: Add some space from the top
    textAlign: 'center',
    
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '300px',
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{ padding: '10px', borderRadius: '5px',backgroundColor: 'rgb(40, 155, 145)',  color: '#fff', border: 'none' }}
          >
            Send OTP
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
