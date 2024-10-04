import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PatPanel from './PatPanel';

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tokenNumber } = location.state || { tokenNumber: null };

  const handleCancel = () => {
    navigate('/');
  };

  const handleOk = () => {
    navigate('/bookop');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '50px',
      padding: '80px',
    },
    tableContainer: {
      width: '50%',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      animation: 'fadeIn 1s',
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    message: {
      fontSize: '18px',
      marginBottom: '20px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    button: {
      padding: '10px 20px',
      margin: '20px',
      borderRadius: '5px',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    cancelButton: {
      backgroundColor: '#ff4d4d',
      color: 'white',
    },
    okButton: {
      backgroundColor: '#4caf50',
      color: 'white',
    },
  };

  return (
    <div>
      <PatPanel />
      <div style={styles.container}>
        <div style={styles.tableContainer}>
          <h2 style={styles.header}>Booking Successfully Completed</h2>
          {/* <p style={styles.message}>Your token number: {tokenNumber !== null ? tokenNumber : 'Not Available'}</p>
 */}
          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              style={{ ...styles.button, ...styles.okButton }}
              onClick={handleOk}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
