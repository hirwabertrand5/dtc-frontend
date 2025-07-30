import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'Admin' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || '🚫 Login failed. Check credentials.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f5f6fa' 
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '350px'
      }}>
        <h2 style={{ textAlign: 'center' }}>🚍 DTC Login</h2>

        <label>Email</label>
        <input type="email" name="email" onChange={handleChange} required
          style={inputStyle} placeholder="Enter your email" />

        <label>Password</label>
        <input type="password" name="password" onChange={handleChange} required
          style={inputStyle} placeholder="Enter your password" />

        <label>Role</label>
        <select name="role" onChange={handleChange} style={inputStyle}>
          <option value="Admin">Admin</option>
          <option value="Scheduler">Scheduler</option>
          <option value="Planner">Planner</option>
        </select>

        <button type="submit" style={btnStyle}>Login</button>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
    </div>
  );
};

// Inline styles
const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const btnStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Login;
