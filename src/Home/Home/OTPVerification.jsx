import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OTPVerification = ({ email }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const verifyOtp = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/verify-otp1/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        navigate('/hospiAdditional');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Enter OTP</Typography>
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
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={verifyOtp}
        >
          Verify OTP
        </Button>
      </Box>
      <Toaster position='top-right' reverseOrder={false} />
    </Container>
  );
};

export default OTPVerification;
