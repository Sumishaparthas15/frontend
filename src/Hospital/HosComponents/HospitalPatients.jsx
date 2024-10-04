import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import HospitalPanel from './HospitalPanel';

const HospitalPatients = () => {
  const [patients, setPatients] = useState([]);
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('hospitalEmail');
    if (email) {
      setHospitalEmail(email);
      fetchPatients(email);
    } else {
      setError('No hospital email found in localStorage.');
      setLoading(false);
    }
  }, []);

  const fetchPatients = async (email) => {
    try {
      const url = `http://localhost:8080/api/completed_bookings/${encodeURIComponent(email)}/`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setPatients(response.data);
      } else {
        setError('No completed patients found for this hospital.');
      }
    } catch (error) {
      setError('Error fetching patient data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
    },
    tableContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    title: {
      marginBottom: '20px',
    },
    table: {
      width: '70%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#20a8a6',
      fontWeight: 'bold',
      padding: '12px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    tableData: {
      padding: '12px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    evenRow: {
      backgroundColor: '#f9f9f9',
    },
  };

  return (
    <div style={styles.container}>
      <HospitalPanel />
      <div style={styles.tableContainer}>
        <h1 style={styles.title}>Completed Patients</h1>
        <Toaster />
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Patient Email</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Department</th>
              <th style={styles.tableHeader}>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.evenRow : {}}>
                <td style={styles.tableData}>{patient.patient_email}</td>
                <td style={styles.tableData}>{new Date(patient.date).toLocaleDateString()}</td>
                <td style={styles.tableData}>{patient.department}</td>
                <td style={styles.tableData}>{patient.doctor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HospitalPatients;
