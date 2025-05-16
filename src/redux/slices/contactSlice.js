import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//  إرسال رسالة Contact
export const sendContactMessage = createAsyncThunk(
  'contact/sendMessage',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/contact`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Something went wrong');
    }
  }
);

//  جلب كل الرسائل (للأدمن)
export const fetchAllMessages = createAsyncThunk(
  'contact/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/contact`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    loading: false,
    success: false,
    error: null,
    messages: [],
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // إرسال رسالة
      .addCase(sendContactMessage.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendContactMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // جلب كل الرسائل
      .addCase(fetchAllMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
