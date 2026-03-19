import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Tab, Tabs, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginCustomer, loginAdmin, clearMessages } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, role } = useSelector((state) => state.auth);
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token && role === 'CUSTOMER') navigate('/dashboard');
    if (token && role === 'ADMIN') navigate('/admin/dashboard');
  }, [token, role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 0) dispatch(loginCustomer(form));
    else dispatch(loginAdmin(form));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e3f2fd' }}>
      <Paper elevation={6} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <AccountBalanceIcon sx={{ fontSize: 50, color: '#1a237e', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold" color="#1a237e">MyFin Bank</Typography>
        </Box>
        <Tabs value={tab} onChange={(e, v) => { setTab(v); dispatch(clearMessages()); }} centered sx={{ mb: 3 }}>
          <Tab label="Customer Login" />
          <Tab label="Admin Login" />
        </Tabs>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
          fullWidth
          label="Email or Customer ID"
          type="text"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ mb: 2 }}
          required
          placeholder="Enter email or MYFIN-CUST-0001"
          />
          <TextField fullWidth label="Password" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            sx={{ mb: 3 }} required />
          <Button fullWidth variant="contained" type="submit" disabled={loading}
            sx={{ backgroundColor: '#1a237e', py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
        {tab === 0 && (
  <Box sx={{ mt: 2, textAlign: 'center' }}>
    <Button onClick={() => navigate('/register')} color="primary">Don't have an account? Register</Button>
    <Button onClick={() => navigate('/forgot-password')} color="secondary">Forgot Password?</Button>
  </Box>
)}
      </Paper>
    </Box>
  );
};

export default Login;