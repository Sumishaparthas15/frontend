import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/HospitalRequests.css';

import AdminPanel from './AdminPanel';

const AdminHospitalDoctor = () => {
    const { id } = useParams(); // Get department id from URL
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/hospitaldoctors1/${id}/`);
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, [id]);

    // Inline styles for table and table elements
    const tableStyle = {
        width: '80%',
        borderCollapse: 'collapse',
        marginLeft: '19%'
        
       
        
        
        
        
    };

    const thStyle = {
        backgroundColor: '#f4f4f4',
        color: '#333',
        padding: '10px',
        border: '1px solid #ddd'
    };

    const tdStyle = {
        padding: '10px',
        border: '1px solid #ddd'
    };

    const imgStyle = {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '4px'
    };

    return (
        <div>
            <AdminPanel />
            <div>
                <h1>Doctors</h1>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Image</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Age</th>
                            <th style={thStyle}>Sex</th>
                            <th style={thStyle}>Experience</th>
                            {/* <th style={thStyle}>Operational Time</th> */}
                            {/* <th style={thStyle}>Available Days</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(doctor => (
                            <tr key={doctor.id}>
                                <td style={tdStyle}>
                                    <img src={`http://localhost:8080${doctor.image}`} alt={doctor.name} style={imgStyle} />
                                </td>
                                <td style={tdStyle}>{doctor.name}</td>
                                <td style={tdStyle}>{doctor.age}</td>
                                <td style={tdStyle}>{doctor.sex}</td>
                                <td style={tdStyle}>{doctor.experience} years</td>
                                {/* <td style={tdStyle}>{doctor.op_time}</td> */}
                                {/* <td style={tdStyle}>{JSON.stringify(doctor.available_days)}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminHospitalDoctor;
