import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAccounts, updateAccountStatus } from '../../store/slices/accountSlice';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const ManageAccounts = () => {
  const dispatch = useDispatch();
  const { allAccounts } = useSelector((state) => state.accounts);
  const [depositDialog, setDepositDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDesc, setDepositDesc] = useState('Cash Deposit by Admin');
  const [loading, setLoading] = useState(false);

  useEffect(() => { dispatch(fetchAllAccounts()); }, [dispatch]);

  const handleStatus = (accountNumber, status, deactivationType = null) => {
    dispatch(updateAccountStatus({ accountNumber, status, deactivationType }))
      .then(() => {
        toast.success(
          status === 'ACTIVE' ? 'Account approved! Email sent to customer.' :
          status === 'REJECTED' ? 'Account rejected.' :
          status === 'DEACTIVATED' ? 'Account deactivated.' :
          'Account status updated.'
        );
        dispatch(fetchAllAccounts());
      });
  };

  const openDepositDialog = (account) => {
    setSelectedAccount(account);
    setDepositAmount('');
    setDepositDesc('Cash Deposit by Admin');
    setDepositDialog(true);
  };

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/transactions/deposit', {
        accountNumber: selectedAccount.accountNumber,
        amount: Number(depositAmount),
        description: depositDesc
      });
      toast.success(`₹${Number(depositAmount).toLocaleString()} deposited successfully into ${selectedAccount.accountNumber}`);
      setDepositDialog(false);
      dispatch(fetchAllAccounts());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deposit failed');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#1a237e">
        Manage Accounts
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Account Number</TableCell>
              <TableCell sx={{ color: 'white' }}>Customer ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Type</TableCell>
              <TableCell sx={{ color: 'white' }}>Balance</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allAccounts.map(a => (
              <TableRow key={a.accountNumber} hover>
                <TableCell>{a.accountNumber}</TableCell>
                <TableCell>{a.customerId}</TableCell>
                <TableCell>{a.accountType}</TableCell>
                <TableCell>₹{a.balance?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={a.status}
                    color={
                      a.status === 'ACTIVE' ? 'success' :
                      a.status === 'REQUESTED' ? 'warning' :
                      a.status === 'AT_RISK' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {a.status === 'REQUESTED' && (
                      <>
                        <Button size="small" variant="contained" color="success"
                          onClick={() => handleStatus(a.accountNumber, 'ACTIVE')}>
                          Approve
                        </Button>
                        <Button size="small" variant="contained" color="error"
                          onClick={() => handleStatus(a.accountNumber, 'REJECTED')}>
                          Reject
                        </Button>
                      </>
                    )}
                    {a.status === 'ACTIVE' && (
                      <>
                        <Button size="small" variant="contained" color="primary"
                          onClick={() => openDepositDialog(a)}>
                          Deposit
                        </Button>
                        <Button size="small" variant="outlined" color="error"
                          onClick={() => handleStatus(a.accountNumber, 'DEACTIVATED', 'MANUAL')}>
                          Deactivate
                        </Button>
                      </>
                    )}
                    {a.status === 'DEACTIVATED' && a.deactivationType === 'MANUAL' && (
                      <Button size="small" variant="outlined" color="success"
                        onClick={() => handleStatus(a.accountNumber, 'ACTIVE')}>
                        Activate
                      </Button>
                    )}
                    {a.status === 'AT_RISK' && (
                      <>
                        <Button size="small" variant="contained" color="primary"
                          onClick={() => openDepositDialog(a)}>
                          Deposit
                        </Button>
                        <Button size="small" variant="outlined" color="error"
                          onClick={() => handleStatus(a.accountNumber, 'DEACTIVATED', 'MANUAL')}>
                          Deactivate
                        </Button>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Deposit Dialog */}
      <Dialog open={depositDialog} onClose={() => setDepositDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1a237e', color: 'white', fontWeight: 'bold' }}>
          Deposit Money
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedAccount && (
            <Box sx={{ backgroundColor: '#e8eaf6', p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="body2" color="text.secondary">Account Number</Typography>
              <Typography fontWeight="bold" color="#1a237e">{selectedAccount.accountNumber}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>Current Balance</Typography>
              <Typography fontWeight="bold" color="#1a237e">
                ₹{selectedAccount.balance?.toLocaleString()}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            sx={{ mb: 2 }}
            required
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={depositDesc}
            onChange={(e) => setDepositDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDepositDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeposit}
            disabled={loading}
            sx={{ backgroundColor: '#1a237e' }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Deposit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAccounts;