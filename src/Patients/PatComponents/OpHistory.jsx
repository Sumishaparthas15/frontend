import React, { useState, useEffect } from 'react';
import PatPanel from './PatPanel';
import { useNavigate } from 'react-router-dom';

const OpHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  
  const getAccessToken = () => JSON.parse(localStorage.getItem('access'));
  const getRefreshToken = () => JSON.parse(localStorage.getItem('refresh'));

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
      console.error('Refresh token not available');
      return null;
  }

  try {
      const response = await fetch('http://localhost:8080/api/token/refresh/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }), 
      });

      if (!response.ok) {
          throw new Error('Failed to refresh token');
      }

      const data = await response.json();

      // Check if the response contains the new access token
      if (data.access) {
          localStorage.setItem('access', JSON.stringify(data.access)); // Update access token in localStorage
          return data.access;
      } else {
          throw new Error('No access token received');
      }
  } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;  // Return null if refresh fails
  }
};


  // Fetch bookings for the authenticated patient
  const fetchBookings = async () => {
    let token = getAccessToken();

    try {
      let response = await fetch(`http://localhost:8080/api/bookings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // If token expired, try refreshing it
      if (response.status === 401) {
        navigate('/LOGIN',)
        token = await refreshAccessToken();
        if (!token) return; // If token refresh fails, stop here
        response = await fetch(`http://localhost:8080/api/bookings/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle booking cancellation
  const handleCancelBooking = async (id) => {
    let token = getAccessToken();

    try {
      let response = await fetch(`http://localhost:8080/api/update_booking_status/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      // If token expired, try refreshing it
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (!token) return; // If token refresh fails, stop here
        response = await fetch(`http://localhost:8080/api/update_booking_status/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'Cancelled' }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      const data = await response.json();
      alert(data.message);

      // Update the booking status in the UI
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === id ? { ...booking, status: 'Cancelled' } : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking.');
    }
  };

  // Handle feedback button click
  const handleFeedback = async (bookingId) => {
    let token = getAccessToken();

    try {
      let response = await fetch(`http://localhost:8080/api/get_booking_details/${bookingId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // If token expired, try refreshing it
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (!token) return; // If token refresh fails, stop here
        response = await fetch(`http://localhost:8080/api/get_booking_details/${bookingId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const booking = await response.json();
      if (!booking.hospital_id) {
        console.error('Hospital ID not found in booking details:', booking);
        return;
      }

      setSelectedBooking(booking);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      alert('Failed to fetch booking details.');
    }
  };

  // Submit feedback to the server
  const submitFeedback = async () => {
    let token = getAccessToken();
    if (!selectedBooking || !selectedBooking.hospital_id || !selectedBooking.id) {
      alert('Invalid booking details. Cannot submit feedback.');
      return;
    }

    const payload = {
      hospital_id: selectedBooking.hospital_id,
      booking_id: selectedBooking.id,
      message: feedbackMessage,
    };

    try {
      let response = await fetch('http://localhost:8080/api/submit_feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // If token expired, try refreshing it
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (!token) return; // If token refresh fails, stop here
        response = await fetch('http://localhost:8080/api/submit_feedback/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      const data = await response.json();
      alert(data.message);
      setIsModalOpen(false);
      setFeedbackMessage('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Failed to submit feedback: ${error.message}`);
    }
  };

  // UI styles
  const tableStyle = {
    width: '70%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: 'rgb(40, 155, 145)',
    color: 'white'
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  };

  const buttonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    margin: '4px 2px',
    cursor: 'pointer'
  };

  const feedbackButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    margin: '4px 2px',
    cursor: 'pointer'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalContentStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const textareaStyle = {
    width: '100%',
    height: '100px',
    marginBottom: '10px',
  };

  const buttonModalStyle = {
    marginRight: '10px',
  };

  return (
    <div>
      <PatPanel />
      <div>
        {/* Existing table rendering logic */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Token Number</th>
              <th style={thStyle}>Hospital</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td style={tdStyle}>{booking.date}</td>
                <td style={tdStyle}>{booking.token_number}</td>
                <td style={tdStyle}>{booking.hospital}</td>
                <td style={tdStyle}>{booking.department}</td>
                <td style={tdStyle}>{booking.doctor}</td>
                <td style={tdStyle}>{booking.status}</td>
                <td style={tdStyle}>
                  {booking.status === 'Upcoming' && (
                    <button 
                      style={buttonStyle} 
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  )}
                  {booking.status === 'Completed' && (
                    <button 
                      style={feedbackButtonStyle} 
                      onClick={() => handleFeedback(booking.id)}
                    >
                      Feedback
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Submit Feedback</h2>
            <textarea
              style={textareaStyle}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Type your feedback here..."
            />
            <button 
              style={buttonModalStyle} 
              onClick={submitFeedback}
            >
              Submit
            </button>
            <button 
              style={buttonModalStyle} 
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpHistory;
