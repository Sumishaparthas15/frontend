import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminPanel from './AdminPanel';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the admin token is in local storage
        const adminToken = localStorage.getItem('token');
        if (!adminToken) {
            navigate('/admin'); // Redirect to login if no token is found
        } else {
            fetchPatients();
        }
    }, [navigate]);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/admin');
                return;
            }
    
            const response = await axios.get('http://localhost:8080/api/get_patients/', {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setPatients(response.data);
        } catch (error) {
            console.log("Error fetching the patients", error);
        }
    };
    

    const toggleUserStatus = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8080/api/toggle_user_status/${id}/`, {}, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            const updatedPatients = patients.map(patient =>
                patient.id === id ? { ...patient, is_active: response.data.is_active } : patient
            );
            setPatients(updatedPatients);
        } catch (error) {
            console.error("Error toggling user status", error);
        }
    };
    
    const buttonStyleBlock = {
        backgroundColor: '#cb3e3e', 
        color: '#fff',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    const buttonStyleUnblock = {
        backgroundColor: '#4CAF50', 
        color: '#fff',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    return (
        <div>
            <AdminPanel />
            <div>
                <h1>Patients</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            {/* <th>Phone Number</th>
                            <th>Image</th> */}
                            {/* <th>Bookings</th> */}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient.id}>
                                <td>{patient.id}</td>
                                <td>{patient.username}</td>
                                <td>{patient.email}</td>
                                {/* <td>{patient.phone_number}</td>
                                <td><img src={patient.profile_img} alt={patient.username} style={{ width: '50px', height: 'auto' }} /></td> */}
                                {/* <td><button style={buttonStyleBlock}>View</button></td> */}
                                <td>
                                    <button 
                                        style={patient.is_active ? buttonStyleBlock : buttonStyleUnblock} 
                                        onClick={() => toggleUserStatus(patient.id)}
                                    >
                                        {patient.is_active ? 'Block' : 'Unblock'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Patients;
