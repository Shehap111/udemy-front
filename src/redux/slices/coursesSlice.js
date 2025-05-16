import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const res = await fetch(`${BASE_URL}/api/courses`);
    return await res.json();
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default coursesSlice.reducer;