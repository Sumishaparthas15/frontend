import React, { useState, useEffect } from 'react';
import HospitalPanel from './HospitalPanel';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);

      const email = localStorage.getItem('hospitalEmail');

      if (!email) {
        setError('Hospital email not found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        // Update the fetch URL to include the hospitalEmail as a path parameter
        const response = await fetch(`http://localhost:8080/api/feedback-detail/${email}/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch feedback.');
        }

        const data = await response.json();
        setFeedbacks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);


  return (
    <div>
      <HospitalPanel />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '800px',
          marginTop: '20px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: '#fff'
        }}>
          <h2 style={{ textAlign: 'center' }}>Feedback List</h2>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && feedbacks.length === 0 && <p>No feedback available.</p>}

          <div>
            {feedbacks.map(feedback => (
              <div key={feedback.id} style={{ marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontSize: '14px', color: '#555' }}>
                  <strong>Date:</strong> {new Date(feedback.created_at).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '5px 0' }}>
                  <strong>Name:</strong> {feedback.patient_name} {/* Use patient_name instead of user */}
                </div>

                <div style={{ fontSize: '14px', color: '#333' }}>
                  <strong>Message:</strong> {feedback.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
