import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Avatar, Grid, Chip,
  CircularProgress, Divider, Card, CardContent
} from '@mui/material';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/customers/profile/me');
        setProfile(res.data);
      } catch (err) {
        console.log('Failed to fetch profile:', err.message);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const details = [
    { label: 'Customer ID', value: profile?.customerId, icon: <FingerprintIcon sx={{ color: '#1a237e' }} /> },
    { label: 'Full Name', value: profile?.name, icon: <PersonIcon sx={{ color: '#1a237e' }} /> },
    { label: 'Email Address', value: profile?.email, icon: <EmailIcon sx={{ color: '#1a237e' }} /> },
    { label: 'Phone Number', value: profile?.phone, icon: <PhoneIcon sx={{ color: '#1a237e' }} /> },
    { label: 'Address', value: profile?.address, icon: <HomeIcon sx={{ color: '#1a237e' }} /> },
    { label: 'Government ID Type', value: profile?.govIdType, icon: <BadgeIcon sx={{ color: '#1a237e' }} /> },
    { label: 'Government ID Number', value: profile?.govIdNumber, icon: <BadgeIcon sx={{ color: '#1a237e' }} /> },
    { label: 'Member Since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '', icon: <CalendarMonthIcon sx={{ color: '#1a237e' }} /> },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" fontWeight="bold" mb={4} color="#1a237e">My Profile</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3, textAlign: 'center', p: 3 }}>
            <Avatar sx={{ width: 100, height: 100, backgroundColor: '#1a237e', margin: '0 auto 16px', fontSize: 40 }}>
              {profile?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="#1a237e">{profile?.name}</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>{profile?.customerId}</Typography>
            <Chip
              label={profile?.status}
              color={profile?.status === 'ACTIVE' ? 'success' : profile?.status === 'PENDING_VERIFICATION' ? 'warning' : 'error'}
              sx={{ fontWeight: 'bold' }}
            />
            <Divider sx={{ my: 3 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" mb={0.5}>KYC Document</Typography>
              <Typography variant="body2" fontWeight="bold" color="#1a237e">{profile?.govIdType} — {profile?.govIdNumber}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={3} color="#1a237e">Personal Information</Typography>
              <Grid container spacing={3}>
                {details.map((detail, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, borderRadius: 2, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                      <Box sx={{ mt: 0.3 }}>{detail.icon}</Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{detail.label}</Typography>
                        <Typography variant="body1" fontWeight="bold" color="#212121">{detail.value || '—'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
