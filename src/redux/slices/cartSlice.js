// src/redux/slices/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialCart = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cart")) || [] : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: initialCart,
  },
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;
      const exists = state.cartItems.find((item) => item._id === course._id);

      if (exists) {
        throw new Error("Course already in cart"); // هنا بنرمي Error عشان نتحكم فيه في الكمبوننت
      } else {
        state.cartItems.push(course);
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
