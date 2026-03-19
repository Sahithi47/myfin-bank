import React, { useState } from 'react';
import {
  Box, List, ListItem, ListItemIcon, ListItemText,
  Typography, Drawer, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsIcon from '@mui/icons-material/Savings';
import RepeatIcon from '@mui/icons-material/Repeat';
import PeopleIcon from '@mui/icons-material/People';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const drawerWidth = 240;

const customerMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Withdraw', icon: <ArrowDownwardIcon />, path: '/withdraw' },
  { text: 'Transfer', icon: <SwapHorizIcon />, path: '/transfer' },
  { text: 'Passbook', icon: <ReceiptIcon />, path: '/passbook' },
  { text: 'Loans', icon: <CreditCardIcon />, path: '/loans' },
  { text: 'Fixed Deposit', icon: <SavingsIcon />, path: '/fixed-deposit' },
  { text: 'Recurring Deposit', icon: <RepeatIcon />, path: '/recurring-deposit' },
  { text: 'Beneficiaries', icon: <PeopleIcon />, path: '/beneficiaries' },
  { text: 'Support', icon: <SupportAgentIcon />, path: '/support' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/admin/customers' },
  { text: 'Accounts', icon: <ManageAccountsIcon />, path: '/admin/accounts' },
  { text: 'Loans', icon: <CreditCardIcon />, path: '/admin/loans' },
  { text: 'Beneficiaries', icon: <PeopleIcon />, path: '/admin/beneficiaries' },
  { text: 'Support', icon: <SupportAgentIcon />, path: '/admin/support' },
];

const SidebarContent = ({ menuItems, user, role, navigate, location, onClose }) => (
  <Box sx={{
    width: drawerWidth,
    height: '100vh',
    backgroundColor: '#1a237e',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
  }}>
    {/* Logo */}
    <Box sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      minHeight: '64px',
    }}>
      <AccountBalanceIcon sx={{ fontSize: 28 }} />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1}>MyFin Bank</Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {role === 'ADMIN' ? 'Admin Portal' : 'Customer Portal'}
        </Typography>
      </Box>
    </Box>

    {/* User Info */}
    <Box sx={{ px: 2, py: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2, p: 1.5
      }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: 16, flexShrink: 0,
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Box>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight="bold" lineHeight={1.2} noWrap>{user?.name}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }} noWrap>
            {user?.customerId || user?.adminId}
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* Menu Items */}
    <List sx={{ px: 1, py: 1, flexGrow: 1, overflowY: 'auto' }}>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem
            button
            key={item.text}
            onClick={() => { navigate(item.path); if (onClose) onClose(); }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              borderLeft: isActive ? '3px solid white' : '3px solid transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              transition: 'all 0.2s ease',
              py: 1,
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontSize: 13, fontWeight: isActive ? 'bold' : 'normal' }}
            />
          </ListItem>
        );
      })}
    </List>

    {/* Footer */}
    <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', textAlign: 'center' }}>
        MyFin Bank © 2026
      </Typography>
    </Box>
  </Box>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user } = useSelector((state) => state.auth);
  const menuItems = role === 'ADMIN' ? adminMenuItems : customerMenuItems;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 1400,
            color: 'white',
            backgroundColor: '#1a237e',
            '&:hover': { backgroundColor: '#283593' },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
            },
          }}
        >
          <SidebarContent
            menuItems={menuItems}
            user={user}
            role={role}
            navigate={navigate}
            location={location}
            onClose={() => setMobileOpen(false)}
          />
        </Drawer>
      ) : (
        /* Desktop Permanent Sidebar */
        <Box sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1200,
          boxShadow: '2px 0 10px rgba(0,0,0,0.15)',
        }}>
          <SidebarContent
            menuItems={menuItems}
            user={user}
            role={role}
            navigate={navigate}
            location={location}
          />
        </Box>
      )}
    </>
  );
};

export default Sidebar;