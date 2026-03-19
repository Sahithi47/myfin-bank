import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const applyLoan = createAsyncThunk('loans/apply', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/loans/apply', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchMyLoans = createAsyncThunk('loans/fetchMy', async (accountNumber, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/loans/my/${accountNumber}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchPendingLoans = createAsyncThunk('loans/fetchPending', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/loans/pending');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateLoanStatus = createAsyncThunk('loans/updateStatus', async ({ loanId, status, interestRate }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/loans/${loanId}/status`, { status, interestRate });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchLoanPayments = createAsyncThunk('loans/fetchPayments', async (loanId, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/loans/${loanId}/payments`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const calculateEMI = createAsyncThunk('loans/calculateEMI', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/loans/calculate-emi', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const loanSlice = createSlice({
  name: 'loans',
  initialState: {
    myLoans: [],
    pendingLoans: [],
    loanPayments: [],
    emi: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages: (state) => { state.error = null; state.success = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyLoans.fulfilled, (state, action) => { state.myLoans = action.payload; });
    builder.addCase(fetchPendingLoans.fulfilled, (state, action) => { state.pendingLoans = action.payload; });
    builder.addCase(fetchLoanPayments.fulfilled, (state, action) => { state.loanPayments = action.payload; });
    builder.addCase(calculateEMI.fulfilled, (state, action) => { state.emi = action.payload.emi; });
    builder.addCase(applyLoan.fulfilled, (state) => { state.success = 'Loan application submitted!'; });
    builder.addCase(applyLoan.rejected, (state, action) => { state.error = action.payload; });
    builder.addCase(updateLoanStatus.fulfilled, (state) => { state.success = 'Loan status updated!'; });
  }
});

export const { clearMessages } = loanSlice.actions;
export default loanSlice.reducer;