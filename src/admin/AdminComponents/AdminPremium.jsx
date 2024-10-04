import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminPanel from './AdminPanel';

const AdminPremium = () => {
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/premium_hospitals/');
                setHospitals(response.data);
            } catch (error) {
                console.error('Error fetching hospitals:', error);
            }
        };

        fetchHospitals();
    }, []);

    // Inline styles
    const containerStyle = {
        padding: '20px',
        textAlign: 'center',
        marginLeft: '19%'
    };

    const tableStyle = {
        width: '80%',
        margin: '20px auto',
        borderCollapse: 'collapse',
        border: '1px solid #ddd'
    };

    const thStyle = {
        backgroundColor: '#f4f4f4',
        color: '#333',
        padding: '10px',
        border: '1px solid #ddd',
        textAlign: 'left'
    };

    const tdStyle = {
        padding: '10px',
        border: '1px solid #ddd',
        textAlign: 'left'
    };

    const headerStyle = {
        fontSize: '24px',
        marginBottom: '20px'
    };

    return (
        <div>
            <AdminPanel />
        <div style={containerStyle}>
            <h1 style={headerStyle}>Premium Hospitals</h1>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Premium Status</th>
                        <th style={thStyle}>Premium Fee</th>
                        <th style={thStyle}>Paid Date</th>
                    </tr>
                </thead>
                <tbody>
                    {hospitals.map(hospital => (
                        <tr key={hospital.hospital.id}>
                            <td style={tdStyle}>{hospital.hospital.id}</td>
                            <td style={tdStyle}>{hospital.hospital.email}</td>
                            <td style={tdStyle}>{hospital.subscription_status === 'paid' ? 'Yes' : 'No'}</td>
                            <td style={tdStyle}>{hospital.premium_fee}</td>
                            <td style={tdStyle}>{hospital.paid_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default AdminPremium;
