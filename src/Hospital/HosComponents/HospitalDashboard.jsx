import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import HospitalPanel from './HospitalPanel';
import Notification1 from './Notification1';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, LineElement, PointElement);

const HospitalDashboard = () => {
  const [data, setData] = useState({
    bookings_count: 0,
    patients_count: 0,
    growth: 0,
    department_data: {},
  });

  const [hospitalId, setHospitalId] = useState(null); // State to hold hospitalId

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const email = localStorage.getItem('hospitalEmail');
        const id = localStorage.getItem('hospital_id'); // Fetch hospitalId

        if (!email || !id) {
          console.error('No email or hospitalId found in localStorage');
          return;
        }

        // Update state with hospitalId
        setHospitalId(id);

        // Remove any leading or trailing spaces in the email
        const trimmedEmail = email.trim();

        // Fetch data from the backend API
        const response = await axios.get(`http://localhost:8080/api/dashboard/${trimmedEmail}/`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Only construct roomName if hospitalId is available
  const roomName = hospitalId ? hospitalId.toString() : '';



  const pieChartData = {
    labels: Object.keys(data.department_data),
    datasets: [{
      data: Object.values(data.department_data),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED', '#4BC0C0'],
    }],
  };

  const lineChartData = {
    labels: ['Current Month', 'Previous Month'],
    datasets: [{
      label: 'Bookings',
      data: [data.bookings_count, data.bookings_count * (1 - data.growth / 100)],
      fill: false,
      backgroundColor: '#20a8a6',
      borderColor: '#20a8a6',
    }],
  };

  return (
    <div>
      <HospitalPanel />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        maxWidth: '800px',
        margin: 'auto'
      }}>
        <h1 style={{ fontSize: '24px' }}>Dashboard</h1>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px' }}>Bookings This Month: {data.bookings_count}</h2>
          <h2 style={{ fontSize: '18px' }}>New Patients This Month: {data.patients_count}</h2>
          <h2 style={{ fontSize: '18px' }}>Growth: {data.growth.toFixed(2)}%</h2>
        </div>
        <div style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px' }}>Department-wise Booking Distribution</h3>
          <Pie data={pieChartData} />
        </div>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '20px' }}>Bookings Growth</h3>
          <Line data={lineChartData} />

          {hospitalId && <Notification1 roomName={roomName} />}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
