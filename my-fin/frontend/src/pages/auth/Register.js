import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerCustomer, clearMessages } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    address: '', govIdType: 'AADHAAR', govIdNumber: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (success) {
      toast.success('Registration submitted! Awaiting admin approval.');
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [success, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (file) formData.append('govIdDocument', file);
    dispatch(registerCustomer(formData));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e3f2fd', py: 4 }}>
      <Paper elevation={6} sx={{ p: 4, width: 500, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#1a237e" textAlign="center" mb={3}>
          Create Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Full Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Password" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Address" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} sx={{ mb: 2 }} required />
          <TextField fullWidth select label="ID Type" value={form.govIdType}
            onChange={(e) => setForm({ ...form, govIdType: e.target.value })} sx={{ mb: 2 }}>
            <MenuItem value="AADHAAR">Aadhaar</MenuItem>
            <MenuItem value="PAN">PAN</MenuItem>
          </TextField>
          <TextField fullWidth label="ID Number" value={form.govIdNumber}
            onChange={(e) => setForm({ ...form, govIdNumber: e.target.value })} sx={{ mb: 2 }} required />
          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            Upload ID Document
            <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
          </Button>
          {file && <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>✅ {file.name}</Typography>}
          <Button fullWidth variant="contained" type="submit" disabled={loading}
            sx={{ backgroundColor: '#1a237e', py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button onClick={() => navigate('/login')} color="primary">Already have an account? Login</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;