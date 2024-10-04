import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import HospitalPanel from './HospitalPanel';

const HospitalBookings = () => {
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState(''); // State for selected status filter
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const email = localStorage.getItem('hospitalEmail');
    if (email) {
      setHospitalEmail(email);
      fetchBookings(email, currentPage, selectedStatus);
    }
  }, [currentPage, selectedStatus]);

  const fetchBookings = async (email, page, status) => {
    try {
      const url = `http://localhost:8080/api/hospital_bookings/${encodeURIComponent(email)}/?page=${page}&limit=${itemsPerPage}&status=${status || ''}`;
      const response = await axios.get(url);
      setBookings(response.data.results || []);
      setTotalPages(response.data.count ? Math.ceil(response.data.count / itemsPerPage) : 1);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      setBookings([]);
      toast.error('Failed to fetch bookings');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
        const booking = bookings.find(booking => booking.id === id);

        if (
          (booking.status === 'Rejected' || booking.status === 'Completed') &&
          (newStatus === 'Upcoming' || newStatus === 'Cancelled')
        ) {
          toast.error('Cannot revert status back to Upcoming or Cancelled once it is Rejected or Completed.');
          return;
        }

        // Ensure doctor's name is passed for "Refunded" or "Cancelled" status
        const requestData = { status: newStatus };
        if (newStatus === 'Refunded' || newStatus === 'Cancelled') {
          requestData.doctor_name = booking.doctor;  // Pass the doctor’s name
        }

        const url = `http://localhost:8080/api/update_booking_status_hospital/${id}/`;
        await axios.put(url, requestData);

        setBookings(bookings.map(booking =>
          booking.id === id ? { ...booking, status: newStatus } : booking
        ));
        toast.success('Status updated successfully');
    } catch (error) {
        console.error('Failed to update booking status', error);
        toast.error('Failed to update booking status');
    }
};

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
    setShowDropdown(false); // Hide dropdown after selection
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const styles = {
    container: {
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
      marginBottom: '20px',
    },
    tableHeader: {
      backgroundColor: '#20a8a6',
      fontWeight: 'bold',
      padding: '12px',
      border: '1px solid #ddd',
      textAlign: 'left',
      color: '#fff',
    },
    tableData: {
      padding: '12px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    evenRow: {
      backgroundColor: '#f9f9f9',
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      width: '100%',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20px',
    },
    pageButton: {
      padding: '8px 16px',
      margin: '0 5px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#20a8a6',
      color: '#fff',
      cursor: 'pointer',
    },
    disabledButton: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
    pageInfo: {
      margin: '0 10px',
    },
    filterContainer: {
      marginBottom: '10px',
      position: 'relative',
    },
    filterButton: {
      padding: '5px 10px', // Adjust padding
      margin: '0 5px',
      border: 'none',
      borderRadius: '30px',
      backgroundColor: '#20a8a6',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '14px', // Adjust text size
    },
    dropdownMenu: {
      display: showDropdown ? 'block' : 'none',
      position: 'absolute',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginTop: '10px',
      zIndex: 1000,
      width: '120px', // Adjust width to fit options
    },
    dropdownItem: {
      padding: '8px 12px', // Adjust padding
      borderBottom: '1px solid #ddd',
      cursor: 'pointer',
      textAlign: 'left',
    },
    dropdownItemLast: {
      borderBottom: 'none',
    },
    activeFilterButton: {
      backgroundColor: '#fff',
      color: '#20a8a6',
    },
  };

  const filterOptions = [
    'Upcoming',
    'Cancelled',
    'Refunded',
    'Rejected',
    'Completed',
    'All',
  ];

  return (
    <div style={styles.container}>
      <HospitalPanel />
      <div style={styles.tableContainer}>
        <h1 style={styles.title}>
          Hospital Bookings
          <button
            style={styles.filterButton}
            onClick={toggleDropdown}
          >
            FILTER
          </button>
        </h1>
        <Toaster />
        <div style={styles.filterContainer}>
          <div style={styles.dropdownMenu}>
            {filterOptions.map(option => (
              <div
                key={option}
                style={{
                  ...styles.dropdownItem,
                  ...(selectedStatus === option ? styles.activeFilterButton : {}),
                  ...(option === 'All' ? styles.dropdownItemLast : {}),
                }}
                onClick={() => handleFilterChange(option === 'All' ? '' : option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Id</th>
              <th style={styles.tableHeader}>Patient Name</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Department</th>
              <th style={styles.tableHeader}>Doctor</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Token Number</th>
              <th style={styles.tableHeader}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={booking.id} style={index % 2 === 0 ? styles.evenRow : {}}>
                  <td style={styles.tableData}>{booking.id}</td>
                  <td style={styles.tableData}>{booking.patient_name}</td>
                  <td style={styles.tableData}>{booking.patient_email}</td>
                  <td style={styles.tableData}>{booking.department}</td>
                  <td style={styles.tableData}>{booking.doctor}</td>
                  <td style={styles.tableData}>{booking.date}</td>
                  <td style={styles.tableData}>{booking.token_number}</td>
                  <td style={styles.tableData}>
                    <select
                      style={styles.select}
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    >
                      <option value="Upcoming" disabled={booking.status === 'Cancelled' || booking.status === 'Rejected'}>
                        Upcoming
                      </option>
                      <option value="Cancelled" disabled={booking.status !== 'Upcoming' && booking.status !== 'Rejected'}>
                        Cancelled
                      </option>
                      <option value="Refunded" disabled={booking.status !== 'Cancelled' && booking.status !== 'Rejected'}>
                        Refunded
                      </option>
                      <option value="Rejected" disabled={booking.status === 'Cancelled' || booking.status === 'Refunded'}>
                        Rejected
                      </option>
                      <option value="Completed" disabled={booking.status === 'Cancelled' || booking.status === 'Rejected'}>
                        Completed
                      </option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={styles.tableData}>No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={styles.pagination}>
          <button
            style={{ ...styles.pageButton, ...(currentPage === 1 ? styles.disabledButton : {}) }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            style={{ ...styles.pageButton, ...(currentPage === totalPages ? styles.disabledButton : {}) }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalBookings;
