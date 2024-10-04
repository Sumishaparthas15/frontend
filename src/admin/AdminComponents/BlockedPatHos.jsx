import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminPanel from './AdminPanel';

const BlockedPatHos = () => {
    const [blockedPatients, setBlockedPatients] = useState([]);
    const [blockedHospitals, setBlockedHospitals] = useState([]);

    useEffect(() => {
        fetchBlockedPatients();
        fetchBlockedHospitals();
    }, []);

    const fetchBlockedPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/get_blocked_patients/');
            console.log("Blocked Patients Data:", response.data);
            setBlockedPatients(response.data);
        } catch (error) {
            console.log("Error fetching blocked patients", error);
        }
    };

    const fetchBlockedHospitals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/get_blocked_hospitals/');
            console.log("Blocked Hospitals Data:", response.data);
            setBlockedHospitals(response.data);
        } catch (error) {
            console.log("Error fetching blocked hospitals", error);
        }
    };

    const handleUnblock = async (userId) => {
        try {
            await axios.post(`http://localhost:8080/api/toggle_user_status/${userId}/`);
            fetchBlockedPatients(); // Refresh the list
        } catch (error) {
            console.log("Error unblocking patient", error);
        }
    };

    const containerStyle = {
        marginTop: '100px',
        width: '50%'
    };

    const tableContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '300px',
        gap: '20px',
    };

    const tableSectionStyle = {
        flex: 1,
        minWidth: '300px',
        maxWidth: '1000px',
    };

    const blockedTableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
        marginLeft: '10px',
    };

    const tableCellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    };

    const tableHeaderStyle = {
        backgroundColor: '#f2f2f2',
        color: 'black',
    };

    const imageStyle = {
        borderRadius: '5px',
    };

    return (
        <div>
            <AdminPanel />
            <div style={tableContainerStyle}>
                <div style={tableSectionStyle}>
                    <h2>Blocked Patients</h2>
                    <table style={blockedTableStyle}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Id</th>
                                <th style={tableHeaderStyle}>Name</th>
                                <th style={tableHeaderStyle}>Email</th>
                                <th style={tableHeaderStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockedPatients.length > 0 ? blockedPatients.map(patient => (
                                <tr key={patient.id}>
                                    <td style={tableCellStyle}>{patient.id}</td>
                                    <td style={tableCellStyle}>{patient.username}</td>
                                    <td style={tableCellStyle}>{patient.email}</td>
                                    <td style={tableCellStyle}>
                                        <button onClick={() => handleUnblock(patient.id)}>Unblock</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={tableCellStyle}>No blocked patients found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* <div style={tableSectionStyle}>
                    <h2>Blocked Hospitals</h2>
                    <table style={blockedTableStyle}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Id</th>
                                <th style={tableHeaderStyle}>Name</th>
                                <th style={tableHeaderStyle}>Email</th>
                                <th style={tableHeaderStyle}>Phone Number</th>
                                <th style={tableHeaderStyle}>Location</th>
                                <th style={tableHeaderStyle}>District</th>
                                <th style={tableHeaderStyle}>Image</th>
                                <th style={tableHeaderStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockedHospitals.length > 0 ? blockedHospitals.map(hospital => (
                                <tr key={hospital.id}>
                                    <td style={tableCellStyle}>{hospital.id}</td>
                                    <td style={tableCellStyle}>{hospital.hospital_name}</td>
                                    <td style={tableCellStyle}>{hospital.email}</td>
                                    <td style={tableCellStyle}>{hospital.phone_number}</td>
                                    <td style={tableCellStyle}>{hospital.address}</td>
                                    <td style={tableCellStyle}>{hospital.district}</td>
                                    <td style={tableCellStyle}>
                                        <img src={hospital.photo} alt={hospital.hospital_name} style={{ ...imageStyle, width: '100px', height: 'auto' }} />
                                    </td>
                                    <td style={tableCellStyle}>Blocked</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" style={tableCellStyle}>No blocked hospitals found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div> */}
            </div>
        </div>
    );
};

export default BlockedPatHos;
