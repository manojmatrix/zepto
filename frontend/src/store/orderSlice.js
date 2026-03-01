import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const verifyOrder = createAsyncThunk('order/verify', async (paymentData, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Hit a NEW verification route
    const response = await axios.post('http://localhost:8000/api/order/verify-payment', paymentData, config);
    
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: { 
    orders: [], 
    loading: false, 
    success: false, 
    error: null 
  },
  reducers: {
    resetOrder: (state) => { 
      state.success = false; 
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Verification States
      .addCase(verifyOrder.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(verifyOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; // This now means PAID and VERIFIED
        // You can update the specific order in your list if needed
      })
      .addCase(verifyOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});


export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;