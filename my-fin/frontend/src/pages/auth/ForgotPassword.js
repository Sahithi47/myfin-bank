import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress, Stepper, Step, StepLabel } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const steps = ['Enter Email', 'Enter OTP', 'Reset Password'];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Step 1 — Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/password-reset/request', { email });
      setSuccess('OTP sent to your email!');
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  // Step 2 — Verify OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp) { setError('Please enter OTP'); return; }
    setError(null);
    setSuccess('OTP verified! Set your new password.');
    setActiveStep(2);
  };

  // Step 3 — Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/password-reset/reset', { email, otp, newPassword });
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e3f2fd' }}>
      <Paper elevation={6} sx={{ p: 4, width: 450, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <AccountBalanceIcon sx={{ fontSize: 50, color: '#1a237e', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold" color="#1a237e">Forgot Password</Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Alerts */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Step 1 — Enter Email */}
        {activeStep === 0 && (
          <form onSubmit={handleRequestOTP}>
            <TextField
              fullWidth
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <Button fullWidth variant="contained" type="submit" disabled={loading}
              sx={{ backgroundColor: '#1a237e', py: 1.5 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
            </Button>
          </form>
        )}

        {/* Step 2 — Enter OTP */}
        {activeStep === 1 && (
          <form onSubmit={handleVerifyOTP}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 3 }}
              required
              inputProps={{ maxLength: 6 }}
            />
            <Button fullWidth variant="contained" type="submit"
              sx={{ backgroundColor: '#1a237e', py: 1.5 }}>
              Verify OTP
            </Button>
            <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => { setActiveStep(0); setError(null); setSuccess(null); }}>
              Back
            </Button>
          </form>
        )}

        {/* Step 3 — Reset Password */}
        {activeStep === 2 && (
          <form onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <Button fullWidth variant="contained" type="submit" disabled={loading}
              sx={{ backgroundColor: '#1a237e', py: 1.5 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </form>
        )}

        {/* Back to Login */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button onClick={() => navigate('/login')} color="primary">
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;