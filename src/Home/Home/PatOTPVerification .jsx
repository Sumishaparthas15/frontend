import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PatOTPVerification  = ({ email, userType }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8080/api/verify-otp1/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('OTP verification error:', error.message);
      toast.error('OTP verification failed, please try again later!');
    }
  };

  return (
    <Box component="form" onSubmit={verifyOtp} sx={{ mt: 3 }}>
      <Typography component="h1" variant="h5">
        Verify OTP
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="otp"
        label="OTP"
        name="otp"
        autoComplete="otp"
        autoFocus
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Verify OTP
      </Button>
    </Box>
  );
};

export default PatOTPVerification ;
