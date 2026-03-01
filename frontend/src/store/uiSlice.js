import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showCart: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCart: (state) => { state.showCart = true; },
    closeCart: (state) => { state.showCart = false; },
  },
});

export const { openCart, closeCart } = uiSlice.actions;
export default uiSlice.reducer;