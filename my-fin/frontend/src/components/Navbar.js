import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1300,
        backgroundColor: '#1a237e',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        left: isMobile ? 0 : 240,
        width: isMobile ? '100%' : 'calc(100% - 240px)',
      }}
    >
      <Toolbar sx={{ minHeight: '64px', px: isMobile ? 7 : 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <AccountBalanceIcon />
          <Typography variant="h6" fontWeight="bold">MyFin Bank</Typography>
        </Box>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && (
              <Typography variant="body2">
                Welcome, <strong>{user.name}</strong>
              </Typography>
            )}
            <Button
              color="inherit"
              onClick={handleLogout}
              variant="outlined"
              size="small"
              sx={{ borderColor: 'rgba(255,255,255,0.5)', borderRadius: 2 }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;