import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// 1. Fetch Cart Thunk
export const getCart = createAsyncThunk('cart/getCart', async (userId, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:8000/api/cart/${userId}`, config);
        return response.data; // Should return { items, billTotal }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// 2. Add/Update Item Thunk
export const addToCart = createAsyncThunk('cart/addItemToCart', async (cartData, thunkAPI) => {
    try {
         
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log("Sending to cart:", { cartData});
        // cartData includes: userId, productId, name, price, image, quantity
        const response = await axios.post(`http://localhost:8000/api/cart/add`, cartData, config)
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const removeFromCart = createAsyncThunk('cart/removeItemToCart', async ({ userId, productId }, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // cartData includes: userId, productId, name, price, image, quantity
        const response = await axios.delete(`http://localhost:8000/api/cart/remove/${userId}/${productId}`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ userId, productId, quantity }, thunkAPI) => {
    try {
        const token = localStorage.getItem('token'); const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.put(`http://localhost:8000/api/cart/update`,
            { userId, productId, quantity }, config);
        return response.data;
    }
    catch (error) { return thunkAPI.rejectWithValue(error.response.data); }
});



const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        billTotal: 0,
        loading: false,
        error: null,
        userData: null
    },
    selectedAddress: null,
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
        },
        clearCartState: (state) => {
      state.items = [];
      state.billTotal = 0;
    },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];

                // Calculate total manually here to prevent it from becoming 0 on refresh
                state.billTotal = state.items.reduce((total, item) =>
                    total + (Number(item.price) * item.quantity), 0
                );

                state.loading = false;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                // Update items from server response
                state.items = action.payload.items;

                // Calculate billTotal manually in Redux
                state.billTotal = state.items.reduce((total, item) =>
                    total + (Number(item.price) * item.quantity), 0
                );

                state.loading = false;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                // Update items from server response after deletion
                state.items = action.payload.items;

                // Recalculate total
                state.billTotal = action.payload.items.reduce((total, item) =>
                    total + (Number(item.price) * item.quantity), 0
                );
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {  
                state.items = action.payload.items; 
                // Recalculate total 
                state.billTotal = state.items.reduce( (total, item) => 
                    total + (Number(item.price) * item.quantity), 0 
            );
         });
           

    },
});

export const { clearCartState,setSelectedAddress ,setUserData} = cartSlice.actions;
export default cartSlice.reducer;