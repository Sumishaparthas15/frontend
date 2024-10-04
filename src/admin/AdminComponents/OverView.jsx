import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement
);

const OverView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard-data/');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const pieChartData = {
    labels: data.status_distribution.map(item => item.subscription_status),
    datasets: [{
      data: data.status_distribution.map(item => item.count),
      backgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  const barChartData = {
    labels: ['Hospitals', 'Patients'],
    datasets: [{
      label: 'Count',
      data: [data.total_hospitals, data.total_patients],
      backgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  const lineChartData = {
    labels: data.learning_curve_data.map(item => item.last_login), // Adjusted field name
    datasets: [{
      label: 'Patients Registered',
      data: data.learning_curve_data.map(item => item.count),
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.2)'
    }]
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Dashboard Overview</h1>

      <div style={{  justifyContent: 'space-around', marginBottom: '20px' }}>
        <div style={{ width: '45%', marginLeft: '19%'}}>
          <h2>Hospitals and Patients</h2>
          <Bar data={barChartData} />
        </div>

        <div style={{ width: '35%' , marginLeft: '19%'}}>
          <h2>Subscription Status</h2>
          <Pie data={pieChartData} />
        </div>
      </div>

      <div style={{ width: '50%', marginLeft: '19%' }}>
        <h2>Patients Registered Over Time</h2>
        <Line data={lineChartData} />
      </div>
    </div>
  );
};

export default OverView;
