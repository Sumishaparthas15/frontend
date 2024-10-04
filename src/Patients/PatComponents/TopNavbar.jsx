import React from 'react';

const TopNavbar = () => {
  return (
    <div style={styles.navbar}>
      <h1 style={styles.title}>Hospital Booking System</h1>
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 0,
  },
};

export default TopNavbar;
