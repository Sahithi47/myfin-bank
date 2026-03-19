import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, CircularProgress } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await axiosInstance.get('/customers');
    setCustomers(res.data);
    setLoading(false);
  };

  const handleStatusUpdate = async (customerId, status) => {
    try {
      await axiosInstance.put(`/customers/${customerId}/status`, { status });
      toast.success(
        status === 'ACTIVE' ? 'Customer approved! Email sent to customer.' :
        status === 'REJECTED' ? 'Customer rejected.' :
        'Customer status updated.'
      );
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#1a237e">Manage Customers</Typography>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1a237e' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Customer ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Phone</TableCell>
                <TableCell sx={{ color: 'white' }}>Gov ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.customerId} hover>
                  <TableCell>{c.customerId}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.govIdType}: {c.govIdNumber}</TableCell>
                  <TableCell>
                    <Chip label={c.status}
                      color={c.status === 'ACTIVE' ? 'success' : c.status === 'PENDING_VERIFICATION' ? 'warning' : 'error'}
                      size="small" />
                  </TableCell>
                  <TableCell>
                    {c.status === 'PENDING_VERIFICATION' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="contained" color="success"
                          onClick={() => handleStatusUpdate(c.customerId, 'ACTIVE')}>Approve</Button>
                        <Button size="small" variant="contained" color="error"
                          onClick={() => handleStatusUpdate(c.customerId, 'REJECTED')}>Reject</Button>
                      </Box>
                    )}
                    {c.status === 'ACTIVE' && (
                      <Button size="small" variant="outlined" color="error"
                        onClick={() => handleStatusUpdate(c.customerId, 'REJECTED')}>Deactivate</Button>
                    )}
                    {c.status === 'REJECTED' && (
                      <Button size="small" variant="outlined" color="success"
                        onClick={() => handleStatusUpdate(c.customerId, 'ACTIVE')}>Activate</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageCustomers;