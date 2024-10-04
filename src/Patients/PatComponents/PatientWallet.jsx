import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatPanel from './PatPanel';
import toast, { Toaster } from 'react-hot-toast';

const PatientWallet = () => {
  const [wallets, setWallets] = useState([]);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('patientEmail');
    if (email) {
      fetchPatientId(email);
    }
  }, []);

  const fetchPatientId = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/get_patient_id/?email=${email}`);
      if (response.data.patient_id) {
        setPatientId(response.data.patient_id);
      } else {
        console.error('Patient ID not found');
        toast.error('Patient ID not found');
      }
    } catch (error) {
      console.error('Error fetching patient ID:', error);
      toast.error('Error fetching patient ID');
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchWallets(patientId);
    }
  }, [patientId]);

  const fetchWallets = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/patient_wallets/${patientId}/`);
      setWallets(response.data);
    } catch (error) {
      console.error('Failed to fetch wallets', error);
      toast.error('Failed to fetch wallets');
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
    },
    table: {
      width: '70%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    tableHeader: {
      backgroundColor: '#20a8a6',
      color: 'white',
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    tableData: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    evenRow: {
      backgroundColor: '#f9f9f9',
    },
  };

  return (
    <div >
      <PatPanel />
      
      <h1>My Wallets</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Hospital</th>
            <th style={styles.tableHeader}>Doctor</th>
            <th style={styles.tableHeader}>Appointment Fee</th>
            <th style={styles.tableHeader}>Transaction Date</th>
            <th style={styles.tableHeader}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet, index) => (
            <tr key={index} style={index % 2 === 0 ? styles.evenRow : {}}>
              <td style={styles.tableData}>{wallet.hospital}</td>
              <td style={styles.tableData}>{wallet.doctor_name}</td>
              <td style={styles.tableData}>{wallet.appointment_fee}</td>
              <td style={styles.tableData}>{new Date(wallet.transaction_date).toLocaleString()}</td>
              <td style={styles.tableData}>{wallet.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientWallet;
