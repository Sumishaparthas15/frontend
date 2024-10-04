import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const styles = {
    logindiv: {
      marginLeft: '450px',
      marginTop: '50px',
      height: '400px',
      width: '500px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'grey',
      borderRadius: '10px',
    },
    loginbtn: {
        marginLeft: '170px',
      }
   
  };
  const handlelogin =async(e) =>{
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:8080/api/admin/',{
        username:email,
        password:password,
      });
      console.log(response.data)
      localStorage.setItem('token',response.data.token);
      alert('Login successful!');
      navigate('/overview');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials or not an admin');
    }
  };

  return (
    <div>
      <div className="logindiv bg-white" style={styles.logindiv}>
        <div className="container p-5">
          <h1 className="text-dark">Admin Login</h1>
          <br />

          <form onSubmit={handlelogin}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" name="email" className="inputsize form-control" id="exampleInputEmail1" aria-describedby="emailHelp" style={styles.inputsize} value={email} onChange={(e) =>{setEmail(e.target.value)}} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" name="password" className="form-control" id="exampleInputPassword1" style={styles.inputsize} value={password} onChange={(e) =>{setPassword(e.target.value)}}/>
            </div>

            <button type="submit" className="loginbtn" style={styles.loginbtn}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
