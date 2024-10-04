import React, { useState, useEffect } from 'react';
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
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dr from '../../images/hos6.jpg';

const theme = createTheme();

const HospiAdditional = () => {
  const navigate = useNavigate();

  const [hospitalData, setHospitalData] = useState({
    address: '',
    district: '',
    phone_number: '',
    ownership_details: '',
    license_number: '',
    license_expiry_date: '',
    admin_contact_person: '',
    admin_contact_phone: '',
    accCertification: null,
   
    accreditations: '',
  });

  const [hospitalEmail, setHospitalEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('hospitalEmail');
    if (email) {
      setHospitalEmail(email);
      console.log('Retrieved email from localStorage:', email); // Debugging line
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalData({ ...hospitalData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setHospitalData({ ...hospitalData, [name]: files[0] });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(hospitalData).forEach(key => {
      if (hospitalData[key] !== null && hospitalData[key] !== '') {
        formData.append(key, hospitalData[key]);
      }
    });
  
    try {
      const url = `http://localhost:8080/api/HospitalAdditional/${encodeURIComponent(hospitalEmail)}/`;
      await axios.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Form submitted successfully!');
      navigate('/LOGIN');
    } catch (error) {
      console.error('Failed to submit the form', error);
      toast.error('Failed to submit the form');
    }
  };
  
  

  return (
    <div
      style={{
        backgroundImage: `url(${dr})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs" sx={{ borderRadius: '10px', padding: '20px' }}>
          <CssBaseline />
          <Toaster position="top-right" reverseOrder={false} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" style={{ color: 'black' }}>
              Add Additional Information
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ color: 'black' }}>Hospital Information:</Typography>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    value={hospitalData.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="district"
                    label="District"
                    name="district"
                    value={hospitalData.district}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phone_number"
                    label="Hospital Phone Number"
                    name="phone_number"
                    value={hospitalData.phone_number}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="ownership_details"
                    label="Ownership Details"
                    name="ownership_details"
                    multiline
                    rows={3}
                    value={hospitalData.ownership_details}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ color: 'black' }}>Legal and Licensing Information:</Typography>
                  <TextField
                    required
                    fullWidth
                    id="license_number"
                    label="License Number"
                    name="license_number"
                    value={hospitalData.license_number}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="license_expiry_date"
                    label="License Expiry Date"
                    name="license_expiry_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={hospitalData.license_expiry_date}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" style={{ color: 'black' }}>Accreditations and Certifications:</Typography>
                  <TextField
                    required
                    fullWidth
                    id="accreditations"
                    label="Accreditations"
                    name="accreditations"
                    value={hospitalData.accreditations}
                    onChange={handleInputChange}
                  />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    name="accCertification"
                  />
                  {hospitalData.accCertification && (
                    <Typography variant="body2" style={{ color: 'black', marginTop: '8px' }}>
                      {hospitalData.accCertification.name}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ color: 'black' }}>Administrative Contacts:</Typography>
                  <TextField
                    required
                    fullWidth
                    id="admin_contact_person"
                    label="Admin Contact Person"
                    name="admin_contact_person"
                    value={hospitalData.admin_contact_person}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="admin_contact_phone"
                    label="Admin Contact Phone"
                    name="admin_contact_phone"
                    value={hospitalData.admin_contact_phone}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Submit
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/hospital_login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default HospiAdditional;
