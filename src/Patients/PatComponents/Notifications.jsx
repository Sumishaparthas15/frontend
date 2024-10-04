import React, { useEffect, useState } from 'react';
import PatPanel from './PatPanel';

const Notification = ({ type, message }) => {
  const getNotificationStyle = () => {
    switch (type) {
      case 'Cancelled':
        return { backgroundColor: '#f8d7da', borderLeft: '4px solid #f5c6cb', color: '#721c24' };
      case 'Rejected':
        return { backgroundColor: '#ffeeba', borderLeft: '4px solid #ffeeba', color: '#856404' };
      case 'Refunded':
        return { backgroundColor: '#d4edda', borderLeft: '4px solid #c3e6cb', color: '#155724' };
      case 'Upcoming':  // Reminder for upcoming appointments
        return { backgroundColor: '#d1ecf1', borderLeft: '4px solid #bee5eb', color: '#0c5460' };
      default:
        return {};
    }
  };

  return (
    <div style={{
      padding: '15px',
      borderRadius: '4px',
      fontSize: '16px',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
      marginBottom: '15px',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50px',
      ...getNotificationStyle(),
    }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {message}
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchPatientId = async () => {
      const email = localStorage.getItem('patientEmail');
      if (email) {
        try {
          const response = await fetch(`http://localhost:8080/api/get_patient_id/?email=${email}`);
          const data = await response.json();
          if (data.patient_id) {
            setPatientId(data.patient_id);
          } else {
            console.error('Patient ID not found');
          }
        } catch (error) {
          console.error('Error fetching patient ID:', error);
        }
      }
    };

    fetchPatientId();
  }, []);

  useEffect(() => {
    if (patientId) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/notifications/?patient_id=${patientId}`);
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [patientId]);

  return (
    <div>
      <PatPanel />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.status}
            message={`Your appointment at ${notification.hospital} with Dr. ${notification.doctor} on ${new Date(notification.date).toLocaleDateString()} is ${notification.status.toLowerCase()}.`}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
