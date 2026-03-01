import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice'; // This is the slice logic we discussed in Step 1
import uiReducer from './uiSlice';
import orderReducer from './orderSlice'
const store = configureStore({
  reducer: {
    cart: cartReducer, // Now 'state.cart' will be accessible everywhere
    ui: uiReducer,
    order:orderReducer
  },
});

export default store;