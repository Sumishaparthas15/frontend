import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/HospitalRequests.css'; // Ensure this file exists and includes necessary styles
import AdminPanel from './AdminPanel';

const HospitalDetails = () => {
    const { id } = useParams();
    const [hospital, setHospital] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem('token');
        if (!adminToken) {
            navigate('/admin'); 
        }
    
        axios.get(`http://localhost:8080/api/hospital/${id}/`, {
            headers: {
                Authorization: `Token ${adminToken}`
            }
        })
        .then(response => {
            setHospital(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the hospital details!', error);
        });
    }, [id, navigate]);
    

    if (!hospital) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AdminPanel />
       
            <div className="hospital-details-container">
                <h1>Hospital Details</h1>
                <table className="hospital-details-table">
                    <tbody>
                        <tr>
                            <td><strong>Id:</strong></td>
                            <td>{hospital.id}</td>
                        </tr>
                        <tr>
                            <td><strong>Name:</strong></td>
                            <td>{hospital.hospital_name}</td>
                        </tr>
                        <tr>
                            <td><strong>Email:</strong></td>
                            <td>{hospital.email}</td>
                        </tr>
                        <tr>
                            <td><strong>Phone Number:</strong></td>
                            <td>{hospital.phone_number}</td>
                        </tr>
                        <tr>
                            <td><strong>Address:</strong></td>
                            <td>{hospital.address}</td>
                        </tr>
                        {/* <tr>
                            <td><strong>City:</strong></td>
                            <td>{hospital.city}</td>
                        </tr> */}
                        <tr>
                            <td><strong>District:</strong></td>
                            <td>{hospital.district}</td>
                        </tr>
                        {/* <tr>
                            <td><strong>Pin Code:</strong></td>
                            <td>{hospital.pin_code}</td>
                        </tr> */}
                        <tr>
                            <td><strong>Ownership Details:</strong></td>
                            <td>{hospital.ownership_details}</td>
                        </tr>
                        <tr>
                            <td><strong>License Number:</strong></td>
                            <td>{hospital.license_number}</td>
                        </tr>
                        <tr>
                            <td><strong>License Expiry Date:</strong></td>
                            <td>{hospital.license_expiry_date}</td>
                        </tr>
                        <tr>
                            <td><strong>Accreditations:</strong></td>
                            <td>{hospital.accreditations}</td>
                        </tr>
                        <tr>
                            <td><strong>Admin Contact Person:</strong></td>
                            <td>{hospital.admin_contact_person}</td>
                        </tr>
                        <tr>
                            <td><strong>Admin Contact Phone:</strong></td>
                            <td>{hospital.admin_contact_phone}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="pdf-container">
                                    <iframe 
                                        src={`http://localhost:8080${hospital.photo}`} 
                                        title="Hospital Document"
                                        className="pdf-viewer"
                                        frameBorder="0"
                                    >
                                        This browser does not support PDFs. Please download the PDF to view it: <a href={`http://localhost:8080${hospital.photo}`}>Download PDF</a>.
                                    </iframe>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HospitalDetails;
