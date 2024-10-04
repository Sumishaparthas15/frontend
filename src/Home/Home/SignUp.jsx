// import React, { useState } from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Navbar from '../Navbar/Navbar';
// import backgroundImg from '../../images/pat.jpg'; // Ensure this path is correct
// import { useNavigate } from 'react-router-dom';
// import PatOTPVerification from './PatOTPVerification ';

// const theme = createTheme();

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {/* Copyright text */}
//     </Typography>
//   );
// }

// const SignUp = () => {
//   const navigate = useNavigate();

//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [otpSent, setOtpSent] = useState(false); // Track OTP sent state

//   const [errors, setErrors] = useState({
//     username: '',
//     email: '',
//     phoneNumber: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const validate = () => {
//     let isValid = true;
//     const newErrors = {
//       username: '',
//       email: '',
//       phoneNumber: '',
//       password: '',
//       confirmPassword: '',
//     };

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (username.trim() === '') {
//       newErrors.username = 'Please enter your name';
//       isValid = false;
//     }
//     if (!emailRegex.test(email)) {
//       newErrors.email = 'Enter a valid Email Id';
//       isValid = false;
//     }
//     if (password !== confirmPassword) {
//       newErrors.confirmPassword = "Password didn't match!";
//       isValid = false;
//     }
//     if (phoneNumber.length !== 10) {
//       newErrors.phoneNumber = 'Phone number should contain exactly 10 digits!';
//       isValid = false;
//     }
//     if (password.length < 6) {
//       newErrors.password = 'Password should contain at least six characters!';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const signupSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     try {
//       // Register user
//       const response = await fetch('http://localhost:8080/api/register/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username,
//           email,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Store JWT tokens
//         localStorage.setItem('access_token', data.access);
//         localStorage.setItem('refresh_token', data.refresh);
        
//         // Generate OTP after successful registration
//         await fetch('http://localhost:8080/api/generate-otp1/', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email }),
//         });

//         setOtpSent(true);  // Set OTP sent to true to show OTP verification form
//       } else {
//         console.error('Registration failed:', data);
//       }
//     } catch (err) {
//       console.error('Error during registration:', err);
//     }
//   };

//   return (
//     <div>
//       <div
//         style={{
//           backgroundImage: `url(${backgroundImg})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           height: '100vh',
//           width: '100vw',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <Navbar />
//         <ThemeProvider theme={theme}>
//           <Container
//             component="main"
//             maxWidth="xs"
//             sx={{
//               height: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//               padding: 2,
//             }}
//           >
//             <CssBaseline />
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly transparent background for readability
//                 borderRadius: '8px',
//                 padding: 3,
//                 width: '100%',
//                 maxWidth: '400px', // Set a max-width for the container
//                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optional: Adds a shadow for better visibility
//               }}
//             >
//               <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//                 <LockOutlinedIcon />
//               </Avatar>
//               <Typography component="h1" variant="h5">
//                 Sign up
//               </Typography>
//               {!otpSent ? (
//                 <Box component="form" noValidate onSubmit={signupSubmit} sx={{ mt: 3 }}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <TextField
//                         name="username"
//                         required
//                         fullWidth
//                         id="username"
//                         label="Username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         error={!!errors.username}
//                         helperText={errors.username}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         required
//                         fullWidth
//                         id="email"
//                         label="Email Address"
//                         name="email"
//                         autoComplete="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         error={!!errors.email}
//                         helperText={errors.email}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         required
//                         fullWidth
//                         id="phoneNumber"
//                         label="Phone Number"
//                         name="phoneNumber"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         error={!!errors.phoneNumber}
//                         helperText={errors.phoneNumber}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         required
//                         fullWidth
//                         name="password"
//                         label="Password"
//                         type="password"
//                         id="password"
//                         autoComplete="new-password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         error={!!errors.password}
//                         helperText={errors.password}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         required
//                         fullWidth
//                         name="confirmPassword"
//                         label="Confirm Password"
//                         type="password"
//                         id="confirmPassword"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         error={!!errors.confirmPassword}
//                         helperText={errors.confirmPassword}
//                       />
//                     </Grid>
//                   </Grid>
//                   <Button
//                     type="submit"
//                     fullWidth
//                     variant="contained"
//                     sx={{ mt: 3, mb: 2 }}
//                   >
//                     Submit
//                   </Button>
//                   <Grid container justifyContent="flex-end">
//                     <Grid item>
//                       <Link href="/login" variant="body2">
//                         Already have an account? Sign in
//                       </Link>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               ) : (
//                 // Render OTP Verification Component
//                 <PatOTPVerification email={email} />
//               )}
//             </Box>
//             <Copyright sx={{ mt: 5 }} />
//           </Container>
//         </ThemeProvider>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../Navbar/Navbar';
import backgroundImg from '../../images/pat.jpg'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import PatOTPVerification from './PatOTPVerification ';

const theme = createTheme();

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Track OTP sent state
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.trim() === '') {
      newErrors.username = 'Please enter your name';
      isValid = false;
    }
    if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid Email Id';
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password didn't match!";
      isValid = false;
    }
    if (phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Phone number should contain exactly 10 digits!';
      isValid = false;
    }
    if (password.length < 6) {
      newErrors.password = 'Password should contain at least six characters!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const signupSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Register user
      const response = await fetch('http://localhost:8080/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Indicate OTP was sent successfully
        setOtpSent(true);
      } else {
        console.error('Registration failed:', data);
        setErrors(prev => ({ ...prev, email: data.error || 'Registration failed' }));
      }
    } catch (err) {
      console.error('Error during registration:', err);
    }
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <ThemeProvider theme={theme}>
          <Container
            component="main"
            maxWidth="xs"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '8px',
                padding: 3,
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              {!otpSent ? (
                <Box component="form" noValidate onSubmit={signupSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        name="username"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={!!errors.username}
                        helperText={errors.username}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="phoneNumber"
                        label="Phone Number"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link href="/login" variant="body2">
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                // Render OTP Verification Component
                <PatOTPVerification email={email} />
              )}
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default SignUp;
