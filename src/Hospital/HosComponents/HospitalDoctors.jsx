import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HospitalPanel from './HospitalPanel';
import '@fortawesome/fontawesome-free/css/all.min.css';
import toast, { Toaster } from 'react-hot-toast';
import { Avatar, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Box, RadioGroup, Radio, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon
import Cookies from 'js-cookie'; // Import Cookies

const getCsrfToken = () => Cookies.get('csrftoken'); // Adjust according to your CSRF token setup

const HospitalDoctors = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [department, setDepartment] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [image, setImage] = useState(null);
  const [experience, setExperience] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [opTime, setOpTime] = useState('');
  const [availableDays, setAvailableDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const hospitalEmail = localStorage.getItem('hospitalEmail');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        if (hospitalEmail) {
          const response = await axios.get(`http://localhost:8080/api/hospitaldepartments/${encodeURIComponent(hospitalEmail)}`);
          setDepartments(response.data);
        } else {
          console.error('Hospital email is not found in local storage');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to fetch departments');
      }
    };

    fetchDepartments();
  }, [hospitalEmail]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/doctors/${encodeURIComponent(hospitalEmail)}/`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDayChange = (e) => {
    setAvailableDays({
      ...availableDays,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('department', department); // Make sure department exists and is a valid ID
    formData.append('name', name); // Ensure name is not empty
    formData.append('age', age); // Ensure age is a valid number
    formData.append('sex', sex); // Ensure sex is a valid option
    if (image) formData.append('image', image); // Only append if the image is selected
    formData.append('experience', experience);
    formData.append('op_time', opTime);
    formData.append('available_days', JSON.stringify(availableDays));  // Ensure this is a valid JSON string
  
    try {
      let url;
      if (editMode) {
        url = `http://localhost:8080/api/doctors/${selectedDoctor.id}/update/`;
        await axios.put(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',  // Required for file uploads
            'X-CSRFToken': getCsrfToken(),
          },
        });
        toast.success('Doctor updated successfully!');
      } else {
        url = `http://localhost:8080/api/doctors/${encodeURIComponent(hospitalEmail)}/add/`;
        await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': getCsrfToken(),
          },
        });
        toast.success('Doctor added successfully!');
      }
      setOpen(false);
      fetchDoctors();  // Refresh doctor list
    } catch (error) {
      console.error('Error adding/updating doctor:', error.response ? error.response.data : error.message);
      toast.error('Error adding/updating doctor');
    }
  };
  
  

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = (doctor) => {
    setDepartment(doctor.department);
    setName(doctor.name);
    setAge(doctor.age);
    setSex(doctor.sex);
    setImage(null); // Reset image upload
    setExperience(doctor.experience);
    setOpTime(doctor.op_time);
    setImagePreview(`http://localhost:8080${doctor.image}`);
  
    // Check if available_days is a string. If it's already an object, you don't need to parse it.
    const availableDaysData = typeof doctor.available_days === 'string'
      ? JSON.parse(doctor.available_days)
      : doctor.available_days;
  
    setAvailableDays(availableDaysData); // Set the available days state
    setSelectedDoctor(doctor);
    setEditMode(true);
    setOpen(true);
  };
  
  const handleDelete = async (doctorId) => {
    try {
      const url = `http://localhost:8080/api/doctors/${doctorId}/delete/`;  // Use doctor ID in the URL
      await axios.delete(url, {
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
      });
      toast.success('Doctor deleted successfully!');
      fetchDoctors();  // Refresh the doctor list after deletion
    } catch (error) {
      console.error('Failed to delete doctor', error);
      toast.error('Failed to delete doctor');
    }
  };
  

  return (
    <div>
      <HospitalPanel />
      <Toaster />
      <Container component="main" maxWidth="md">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">Hospital Doctors</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen} sx={{ mt: 3 }}>Add Doctor</Button>
          <div style={styles.doctorCards}>
            {doctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id} style={styles.doctorCard}>
                <img src={`http://localhost:8080${doctor.image}`} alt={doctor.name} style={styles.image} />
                <h5 className="doctor-name" style={styles.doctorName}>{doctor.name}</h5>
                <button className="button2" style={styles.button2} onClick={() => handleEdit(doctor)}>Edit</button>
                <button className="button2" style={styles.button2} onClick={() => handleDelete(doctor.id)}>Delete</button>
              </div>
            ))}
          </div>

          {/* Modal Form */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editMode ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select labelId="department-label" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} label="Department">
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField margin="normal" required fullWidth id="name" label="Doctor's Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField margin="normal" required fullWidth id="age" label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="sex-label">Sex</InputLabel>
                  <Select labelId="sex-label" id="sex" value={sex} onChange={(e) => setSex(e.target.value)} label="Sex">
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {imagePreview && <Avatar src={imagePreview} sx={{ width: 100, height: 100, mb: 2 }} />}
                <TextField margin="normal" required fullWidth id="experience" label="Experience (years)" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <Typography component="legend">OP Time</Typography>
                  <RadioGroup row value={opTime} onChange={(e) => setOpTime(e.target.value)}>
                    <FormControlLabel value="morning" control={<Radio />} label="Morning" />
                    <FormControlLabel value="afternoon" control={<Radio />} label="Afternoon" />
                    <FormControlLabel value="evening" control={<Radio />} label="Evening" />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <Typography component="legend">Available Days</Typography>
                  <FormGroup row>
                    {Object.keys(availableDays).map((day) => (
                      <FormControlLabel
                        key={day}
                        control={<Checkbox checked={availableDays[day]} onChange={handleDayChange} name={day} />}
                        label={day.charAt(0).toUpperCase() + day.slice(1)}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit" variant="contained" color="primary">{editMode ? 'Update' : 'Add'}</Button>
                </DialogActions>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </Container>
    </div>
  );
};

const styles = {
  doctorCards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '20px',
  },
  doctorCard: {
    margin: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '200px',
    textAlign: 'center',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  doctorName: {
    fontSize: '16px',
    margin: '10px 0',
  },
  button2: {
    backgroundColor: '#FF5C5C',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    margin: '5px',
  },
};

export default HospitalDoctors;
