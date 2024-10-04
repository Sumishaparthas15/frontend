import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminPanel from './AdminPanel';
import './css/HospitalRequests.css';

const HospitalRequests = () => {
    const [hospitals, setHospitals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem('token');
        if (!adminToken) {
            navigate('/admin');
            return;
        }
    
        axios.get('http://localhost:8080/api/hospital_requests/', {
            headers: {
                Authorization: `Token ${adminToken}`
            }
        })
        .then(response => {
            setHospitals(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the hospital requests!', error);
        });
    }, [navigate]);
    
    const approveHospital = (id, email) => {
        const adminToken = localStorage.getItem('token');
        axios.post(`http://localhost:8080/api/approve_hospital/${id}/`, { email }, {
            headers: {
                Authorization: `Token ${adminToken}`
            }
        })
        .then(response => {
            setHospitals(hospitals.filter(hospital => hospital.id !== id));
        })
        .catch(error => {
            console.error('There was an error approving the hospital!', error);
        });
    };
    
    const rejectHospital = (id, email) => {
        const adminToken = localStorage.getItem('token');
        axios.post(`http://localhost:8080/api/reject_hospital/${id}/`, { email }, {
            headers: {
                Authorization: `Token ${adminToken}`
            }
        })
        .then(response => {
            setHospitals(hospitals.filter(hospital => hospital.id !== id));
        })
        .catch(error => {
            console.error('There was an error rejecting the hospital!', error);
        });
    };
    

    const viewDetails = (id) => {
        console.log(id)
        navigate(`/hospitaldetails/${id}`);
    };

    return (
        <div>
            <AdminPanel />
            <div>
                <h1>Hospital Requests</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Details</th>
                            <th>Approve</th>
                            <th>Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hospitals.map(hospital => (
                            <tr key={hospital.id}>
                                <td>{hospital.id}</td>
                                <td>{hospital.hospital_name}</td>
                                <td>{hospital.email}</td>
                                <td>
                                    <button onClick={() => viewDetails(hospital.id)}>View</button>
                                </td>
                                <td>
                                <button onClick={() => approveHospital(hospital.id, hospital.email)} style={{ marginRight: '10px' }}>Approve</button>

                                </td>
                                <td>
                                <button onClick={() => rejectHospital(hospital.id, hospital.email)} style={{ backgroundColor: '#cb3e3e', color: '#fff' }}>Reject</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HospitalRequests;
