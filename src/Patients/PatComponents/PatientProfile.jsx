import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import PatPanel from './PatPanel';

const PatientProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [image, setImage] = useState(null);

  const getAccessToken = () => JSON.parse(localStorage.getItem('access'));

  // Fetch user profile data using access token
  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setError('Access token not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/Patientsprofile/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle field edit
  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(userData[field]);
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle saving changes
  const handleSave = async () => {
    const formData = new FormData();
    if (editingField === 'profile_img' && image) {
      formData.append('profile_img', image);
    } else {
      formData.append(editingField, editValue);
    }

    const accessToken = getAccessToken();

    try {
      const response = await axios.patch(
        'http://localhost:8080/api/Patientsprofile/', // No patient ID required
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update userData state
      setUserData({ ...userData, [editingField]: response.data[editingField] });

      // Update localStorage if editing email
      if (editingField === 'email') {
        localStorage.setItem('patientEmail', response.data.email);
      }

      // Reset the editing state
      setEditingField(null);
      setEditValue('');
      setImage(null);
    } catch (err) {
      setError('Failed to save data.');
    }
  };

  const styles = {
    profileBox: {
      width: '70%',
      maxWidth: '600px',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      marginLeft: '400px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginLeft: '1px',
    },
    tableCell: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    profileImage: {
      borderRadius: '50%',
      width: '100px',
      height: '100px',
      objectFit: 'cover',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '20px',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    buttonDisabled: {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed',
    },
    input: {
      margin: '5px 0',
      padding: '5px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      width: '100%',
    },
    fileInput: {
      margin: '5px 0',
    },
    editButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      cursor: 'pointer',
    },
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.container}>Error: {error}</div>;
  }

  return (
    <div>
      <PatPanel />
      <div>
        <div style={styles.profileBox}>
          <h2 style={styles.header}>User Profile</h2>
          <div style={{ textAlign: 'center' }}>
            <img
              src={userData.profile_img ? `http://localhost:8080${userData.profile_img}` : 'default_profile.png'}
              alt="Profile"
              style={styles.profileImage}
            />
            {editingField === 'profile_img' && (
              <input
                type="file"
                onChange={handleImageChange}
                style={styles.fileInput}
              />
            )}
          </div>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tableCell}>
                  Email:
                  {editingField === 'email' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    userData.email
                  )}
                </td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  Username:
                  {editingField === 'username' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    userData.username
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={styles.buttonContainer}>
            {editingField ? (
              <>
                <button
                  onClick={handleSave}
                  style={styles.button}
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  style={{ ...styles.button, ...styles.buttonDisabled }}
                >
                  <FaTimes /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit('email')}
                  style={styles.editButton}
                >
                  <FaEdit /> Edit Email
                </button>
                <button
                  onClick={() => handleEdit('username')}
                  style={styles.editButton}
                >
                  <FaEdit /> Edit Username
                </button>
                <button
                  onClick={() => handleEdit('profile_img')}
                  style={styles.editButton}
                >
                  <FaEdit /> Change Profile Image
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
