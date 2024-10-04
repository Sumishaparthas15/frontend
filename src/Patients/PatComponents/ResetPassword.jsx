import React, { useState, useEffect } from 'react';
import Navbar from '../../Home/Navbar/Navbar';

const ResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000); // hide message after 5 seconds

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password complexity validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
        if (!passwordRegex.test(newPassword)) {
            alert('New password must contain at least one alphabet, one number, and one special character');
            return false;
        }

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return false;
        }

        // Post the data to the backend
        fetch('http://127.0.0.1:8080/api/reset-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                setMessage(data.message);
                setOtp('');  // Clear form fields on success
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert(data.error || 'An error occurred');
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</h2>
                
                {message && (
                    <div style={{ backgroundColor: '#d4edda', padding: '10px', color: '#155724', textAlign: 'center', borderRadius: '5px', marginBottom: '20px' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'rgb(40, 155, 145)',  color: '#fff', border: 'none', borderRadius: '5px' }}>Submit</button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default ResetPassword;
