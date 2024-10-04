import React, { useState, useEffect } from 'react';
import PatPanel from './PatPanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Bookup() {
  const [form, setForm] = useState({
    district: '',
    hospital: '',
    department: '',
    doctor: '',
    date: '',
  });
  const [districts, setDistricts] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const navigate = useNavigate();

  // Utility function to retrieve access token from localStorage
  const getAccessToken = () => JSON.parse(localStorage.getItem('access'));
  const getRefreshToken = () => JSON.parse(localStorage.getItem('refresh'));

  // Utility to refresh token
  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token found');
      return null;
    }

    try {
      const response = await fetch('http://localhost:8080/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', JSON.stringify(data.access));
        return data.access;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  // Fetch helper that automatically handles token expiration
  const fetchWithToken = async (url, options = {}) => {
    let accessToken = getAccessToken();
    if (!accessToken) {
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        return null;
      }
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        return fetch(url, { ...options, headers: { 'Authorization': `Bearer ${newAccessToken}`, ...options.headers } });
      }
    }
    return response;
  };

  // Fetch districts on mount
  useEffect(() => {
    fetchWithToken('http://localhost:8080/api/districts/')
      .then(response => response.json())
      .then(data => setDistricts(data.districts || []))
      .catch(error => console.error('Error fetching districts:', error));
  }, []);

  // Fetch hospitals when district changes
  useEffect(() => {
    if (form.district) {
      fetchWithToken(`http://localhost:8080/api/hospitals/${form.district}/`)
        .then(response => response.json())
        .then(data => setHospitals(data.hospitals || []))
        .catch(error => console.error('Error fetching hospitals:', error));
    } else {
      setHospitals([]);
    }
  }, [form.district]);

  // Fetch departments when hospital changes
  useEffect(() => {
    if (form.hospital) {
      fetchWithToken(`http://localhost:8080/api/hospitaldepartments1/${form.hospital}/`)
        .then(response => response.json())
        .then(data => setDepartments(data || []))
        .catch(error => console.error('Error fetching departments:', error));
    } else {
      setDepartments([]);
    }
  }, [form.hospital]);

  // Fetch doctors when department changes
  useEffect(() => {
    if (form.department) {
      fetchWithToken(`http://localhost:8080/api/hospitaldoctors/${form.department}/`)
        .then(response => response.json())
        .then(data => setDoctors(data || []))
        .catch(error => console.error('Error fetching doctors:', error));
    } else {
      setDoctors([]);
    }
  }, [form.department]);

  // Fetch available days when doctor changes
  useEffect(() => {
    if (form.doctor) {
      fetchWithToken(`http://localhost:8080/api/doctoravailable/${form.doctor}/`)
        .then(response => response.json())
        .then(data => {
          const days = Object.keys(data).filter(day => data[day]);
          setAvailableDays(days.map(day => day.toLowerCase()));
        })
        .catch(error => console.error('Error fetching available days:', error));
    } else {
      setAvailableDays([]);
    }
  }, [form.doctor]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setForm({ ...form, date: value });

    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        setError('You cannot select a past date.');
        return;
      }

      const selectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (!availableDays.includes(selectedDay)) {
        setError('The selected date does not match the available days.');
      } else {
        setError('');
      }
    }
  };

  // Form submit handler
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!error) {
  //     setShowModal(true);
  //   }
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) {
      // Fetch the access token before making the request
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token found. User may not be authenticated.');
        return;
      }

      setShowModal(true);
    }
  };
  // Payment handler
  const handlePayment = async () => {
    const token = getAccessToken();
    if (!token) {
      console.error('No access token found. User may not be authenticated.');
      return;
    }
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      if (paymentMethod === 'razorpay') {
        const { data } = await axios.post('http://localhost:8080/api/create-razorpay-order/', {
          hospital_id: form.hospital,
          department_id: form.department,
          doctor_id: form.doctor,
          date: form.date,
          payment_method: 'razorpay',
        }, { headers });

        const options = {
          key: 'rzp_test_d5VCv4MOwkIpcU',
          amount: data.amount,
          currency: data.currency,
          name: "Hospital Booking",
          description: "Appointment Booking Fee",
          order_id: data.order_id,
          handler: async function (response) {
            await axios.post('http://localhost:8080/api/razorpay-payment-success/', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }, { headers });

            navigate('/booking_success', { state: { token_number: data.token_number } });
          },
          prefill: {
            name: "SUMISHA PS",
            email: "sumishasudha392@gmail.com",
            contact: "9037235334",
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (paymentMethod === 'wallet') {
        const response = await axios.post('http://localhost:8080/api/wallet_payment/', {
          hospital_id: form.hospital,
          department_id: form.department,
          doctor_id: form.doctor,
          date: form.date,
          payment_method: 'wallet',
        }, { headers });

        if (response.data.success) {
          navigate('/booking_success', { state: { token_number: response.data.booking_id } });
        } else {
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error during payment", error);
    } finally {
      setShowModal(false);
    }
  };


  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const styles = {
    container: {
      marginLeft: '350px',
      marginTop: '10px',
      padding: '20px',
      display: 'flex',
    },
    formContainer: {
      width: '70%',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    select: {
      width: '100%',
      padding: '8px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    button: {
      display: 'block',
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: 'rgb(40, 155, 145)',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
    },
    dateInput: {
      width: '100%',
      padding: '8px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    error: {
      color: 'red',
      marginBottom: '15px',
    },
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
      backgroundColor: 'white',
      zIndex: 1000,
    },
    modalBackground: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 999,
    },
    modalButton: {
      display: 'block',
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#3399cc',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '10px',
    },
  };

  return (
    <div>
      <PatPanel />
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2>Book an Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                District:
                <select name="district" value={form.district} onChange={handleChange} style={styles.select}>
                  <option value="">Select District</option>
                  {districts.length > 0 ? (
                    districts.map((district, index) => (
                      <option key={index} value={district}>{district}</option>
                    ))
                  ) : (
                    <option value="">No districts available</option>
                  )}
                </select>
              </label>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Hospital:
                <select name="hospital" value={form.hospital} onChange={handleChange} style={styles.select}>
                  <option value="">Select Hospital</option>
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital, index) => (
                      <option key={index} value={hospital.id}>{hospital.hospital_name}</option>
                    ))
                  ) : (
                    <option value="">No hospitals available</option>
                  )}
                </select>
              </label>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Department:
                <select name="department" value={form.department} onChange={handleChange} style={styles.select}>
                  <option value="">Select Department</option>
                  {departments.length > 0 ? (
                    departments.map((department, index) => (
                      <option key={index} value={department.id}>{department.name}</option>
                    ))
                  ) : (
                    <option value="">No departments available</option>
                  )}
                </select>
              </label>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Doctor:
                <select name="doctor" value={form.doctor} onChange={handleChange} style={styles.select}>
                  <option value="">Select Doctor</option>
                  {doctors.length > 0 ? (
                    doctors.map((doctor, index) => (
                      <option key={index} value={doctor.id}>{doctor.name}</option>
                    ))
                  ) : (
                    <option value="">No doctors available</option>
                  )}
                </select>
              </label>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Date:
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleDateChange}
                  style={styles.dateInput}
                />
              </label>
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.button}>OK</button>
          </form>
        </div>
      </div>

      {showModal && (
        <>
          <div style={styles.modalBackground} onClick={handleCloseModal}></div>
          <div style={styles.modal}>
            <h3>Select Payment Method</h3>
            <label>
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={handlePaymentMethodChange}
              />
              Razorpay
            </label>
            <label>
              <input
                type="radio"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={handlePaymentMethodChange}
              />
              Wallet
            </label>
            <button style={styles.modalButton} onClick={handlePayment}>Proceed</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Bookup;
