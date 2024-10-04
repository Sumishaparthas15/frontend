import React, { useState } from 'react';
import axios from 'axios';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Home/Navbar/Navbar';
// import PatLoginOTP from '../Home/Home/PatLoginOTP ';
// import LoginOTP from '../Home/Home/LoginOTP';
// import toast, { Toaster } from 'react-hot-toast';

const theme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Login1 = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [customError, setCustomError] = useState('');

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setOtpSent(false); // Reset OTP state when role changes
  };

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setCustomError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      let response;
      
      if (role === 'patient') {
        response = await axios.post('http://localhost:8080/api/patient_login/', { email, password });
        const { access_token, refresh_token, user_id, email: userEmail, name } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('patientEmail', email);

        localStorage.setItem("patientEmail,", JSON.stringify(email));

        localStorage.setItem("access", JSON.stringify(access_token));
        localStorage.setItem("refresh", JSON.stringify(refresh_token));
        navigate('/bookop');
        
  
 
  
      } else if (role === 'hospital') {
        response = await axios.post('http://localhost:8080/api/hospital_login/', { email, password });
        const token = response.data.access;
        const hospitalId = response.data.hospital_id;
        localStorage.setItem('token', token);
        localStorage.setItem('hospitalEmail', email);
        localStorage.setItem('hospital_id', hospitalId); 
        navigate('/hospital_dashboard');
  
        console.log('Hospital Token:', token);
  
       
      } else if (role === 'admin') {
        const response = await axios.post('http://localhost:8080/api/admin_login/', {
            email: email,
            password: password
        });
        localStorage.setItem('token', response.data.token);
        navigate('/overview');
    }
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response && error.response.status === 403 && error.response.data.error === 'OTP verification is not completed') {
        setCustomError('OTP verification is not completed. Please verify your OTP.');
      } else if (error.response && error.response.status === 403 && role === 'hospital') {
        setCustomError('Account not approved by admin.');
      } else if (error.response && error.response.status === 401) {
        setCustomError('Invalid credentials.');
      } else {
        setCustomError('Server error. Please try again later.');
      }
    }
  };
  

  return (
    <div>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">Login</Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Select Role</FormLabel>
              <RadioGroup
                aria-label="role"
                name="role"
                value={role}
                onChange={handleRoleChange}
                row
              >
                <FormControlLabel value="patient" control={<Radio />} label="Patient" />
                <FormControlLabel value="hospital" control={<Radio />} label="Hospital" />
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </FormControl>

            {role && (
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                {customError && (
                  <Typography color="error" variant="body2">
                    {customError}
                  </Typography>
                )}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
                {/* {role === 'patient' && otpSent && <PatLoginOTP email={email} />} */}
                {/* {role === 'hospital' && otpSent && <LoginOTP email={email} />} */}
                <Grid container>
                  <Grid item>

                  {role === 'patient' && <Link href="/forpasspat" variant="body2">{"Forgot Password?"}</Link>}
                  {/* {role === 'hospital' && <Link href="/forpasshos" variant="body2">{"Forgot Password?"}</Link>} */}
                  <br></br><br></br>

                    {role === 'patient' && <Link href="/register/patient/" variant="body2">{"Don't have an account? Register"}</Link>}
                    {role === 'hospital' && <Link href="/hossignup" variant="body2">{"Don't have an account? Register"}</Link>}
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Login1;