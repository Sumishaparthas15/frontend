import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HospitalPanel from './HospitalPanel';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const allowedFields = [
    'hospital_name',
    'email',
    'phone_number',
    'address',
    'city',
    'district',
    'pin_code',
    'ownership_details',
    'license_number',
    'license_expiry_date',
    'accreditations',
    'acc_certification',
    'admin_contact_person',
    'admin_contact_phone',
    'appointment_limit'
];

const HospitalProfile = () => {
    const [hospitalData, setHospitalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchHospitalData = async () => {
            const email = localStorage.getItem('hospitalEmail');
            if (!email) {
                setError('No hospital email found in localStorage.');
                setLoading(false);
                return;
            }

            try {
                const encodedEmail = encodeURIComponent(email);
                const response = await axios.get(`http://localhost:8080/api/hospital_profile/${encodedEmail}/`);
                if (response.status === 200) {
                    setHospitalData(response.data);
                } else {
                    setError('Failed to fetch hospital data');
                }
            } catch (error) {
                setError('Error fetching hospital data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHospitalData();
    }, []); // Empty dependency array means this effect runs once on component mount

    const handleEdit = (field) => {
        setEditingField(field);
        setEditValue(hospitalData[field]);
    };

    const handleChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleSave = async () => {
        try {
            const email = localStorage.getItem('hospitalEmail');
            if (!email) return;

            // If editing email, update localStorage with the new email
            if (editingField === 'email') {
                localStorage.setItem('hospitalEmail', editValue);
            }

            const encodedEmail = encodeURIComponent(email);
            const response = await axios.patch(
                `http://localhost:8080/api/hospital_profile_update/${encodedEmail}/`,
                { [editingField]: editValue }
            );

            if (response.status === 200) {
                setHospitalData((prevData) => ({
                    ...prevData,
                    [editingField]: editValue,
                }));
                setEditingField(null);
                setEditValue('');
            } else {
                setError('Failed to update hospital data');
            }
        } catch (error) {
            setError('Error updating hospital data: ' + error.message);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <HospitalPanel />
            <div style={styles.container}>
                {hospitalData ? (
                    <div style={styles.tableContainer}>
                        <h2 style={styles.title}>Hospital Profile</h2>
                        <table style={styles.table}>
                            <tbody>
                                {Object.keys(hospitalData)
                                    .filter(key => allowedFields.includes(key))
                                    .map((key) => (
                                        <tr key={key} style={styles.tableRow}>
                                            <td style={styles.tableHeader}>{key.replace(/_/g, ' ').toUpperCase()}</td>
                                            <td style={styles.tableData}>
                                                {editingField === key ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={editValue}
                                                            onChange={handleChange}
                                                            style={styles.input}
                                                        />
                                                        <FaSave style={styles.editIcon} onClick={handleSave} />
                                                        <FaTimes style={styles.editIcon} onClick={handleCancel} />
                                                    </>
                                                ) : (
                                                    <>
                                                        {key === 'photo' || key === 'owner_photo' ? (
                                                            hospitalData[key] && <img src={`http://localhost:8080${hospitalData[key]}`} alt={key} style={styles.image} />
                                                        ) : key === 'license_expiry_date' ? (
                                                            new Date(hospitalData[key]).toLocaleDateString()
                                                        ) : (
                                                            hospitalData[key]
                                                        )}
                                                        <FaEdit style={styles.editIcon} onClick={() => handleEdit(key)} />
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No hospital data available</p>
                )}
            </div>
        </>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    tableContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    title: {
        marginBottom: '20px',
    },
    table: {
        width: '70%',
        borderCollapse: 'collapse',
    },
    tableRow: {
        borderBottom: '1px solid #ddd',
    },
    tableHeader: {
        backgroundColor: '#f4f4f4',
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    tableData: {
        padding: '12px',
        textAlign: 'left',
        position: 'relative',
    },
    image: {
        maxWidth: '100px',
        height: 'auto',
    },
    input: {
        marginRight: '10px',
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    editIcon: {
        marginLeft: '10px',
        cursor: 'pointer',
        color: '#007bff',
    },
};

export default HospitalProfile;
