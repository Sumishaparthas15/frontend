import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/HospitalRequests.css'

import AdminPanel from './AdminPanel';

const HospitalDepartments = () => {
    const { id } = useParams(); // Get hospital id from URL
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/hospitaldepartments1/${id}/`);
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, [id]);

    return (
        <div>
            <AdminPanel />
        
        <div >
            <h1>Departments</h1>
            <div className="departments-container">
                {departments.map(department => (
                    <div key={department.id} className="department-card">
                        <img src={`http://localhost:8080${department.image}`} alt={department.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        <h4>{department.name}</h4>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default HospitalDepartments;
