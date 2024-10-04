import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminPanel from './AdminPanel';

const Hospital = () => {
    const [approvedHospitals, setApprovedHospitals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the admin token is in local storage
        const adminToken = localStorage.getItem('token');
        if (!adminToken) {
            navigate('/admin'); // Redirect to login if no token is found
        } else {
            fetchApprovedHospitals();
        }
    }, [navigate]);

    const fetchApprovedHospitals = async () => {
        try {
            const token = localStorage.getItem('token'); // Ensure this token exists
            if (!token) {
                navigate('/admin'); // Redirect if token is not found
                return;
            }
    
            const response = await axios.get('http://localhost:8080/api/HospitalListView/', {
                headers: {
                    Authorization: `Token ${token}` // Ensure the correct token format
                }
            });
            setApprovedHospitals(response.data);
        } catch (error) {
            console.error('Error fetching approved hospitals:', error);
        }
    };
    

    const handleBlockUnblock = async (hospitalId, isApproved) => {
        try {
            const action = isApproved ? 'block' : 'unblock';
            await axios.post(`http://localhost:8080/api/block_unblock_hospital/${hospitalId}/`, { action });
            fetchApprovedHospitals(); // Refresh the hospital list
        } catch (error) {
            console.error(`Error ${isApproved ? 'blocking' : 'unblocking'} hospital:`, error);
        }
    };
    const viewDetails = (id) => {
        console.log(id)
        navigate(`/hospitaldetails/${id}`);
    };
    const viewDepartments =(id) =>{
        console.log(id)
        navigate(`/hospitaldepartments/${id}`);
    };
    const viewDoctors =(id) =>{
        console.log(id)
        navigate(`/hospitaldoctors/${id}`);
    };


    const buttonStyle = {
        backgroundColor: '#f0f0f0',
        color: '#000',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px'
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
        backgroundColor: '#4CAF50', // Green color for unblock
        color: '#fff',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px'
    };
    const tableStyle = {
        width: '65%',
        margin: '20px auto',
        borderCollapse: 'collapse',
        border: '1px solid #ddd',
        marginLeft: '25%'
    };

    return (
        <div>
            <AdminPanel />
            <div>
                <h1>Hospitals</h1>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Details</th>
                            <th>Departments</th>
                            <th>Doctors</th>
                            {/* <th>Bookings</th> */}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvedHospitals.map(hospital => (
                            <tr key={hospital.id}>
                                <td>{hospital.id}</td>
                                <td>{hospital.hospital_name}</td>
                                <td>
                                    <button onClick={() => viewDetails(hospital.id)}>View</button>
                                </td>
                                <td>
                                    <button onClick={() => viewDepartments(hospital.id)}>View</button>
                                </td>
                                <td><button onClick={() => viewDoctors(hospital.id)}>View</button></td>
                                {/* <td><button style={buttonStyle}>View</button></td> */}
                                <td>
                                    <button
                                        style={hospital.is_approved ? buttonStyleBlock : buttonStyleUnblock}
                                        onClick={() => handleBlockUnblock(hospital.id, hospital.is_approved)}
                                    >
                                        {hospital.is_approved ? 'Block' : 'Unblock'}
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

export default Hospital;
