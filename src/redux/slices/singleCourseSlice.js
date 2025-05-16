// src/redux/slices/singleCourseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 👉 Thunk لجيب كورس معين بالـ ID
export const fetchSingleCourse = createAsyncThunk(
  'singleCourse/fetchSingleCourse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// 👉 Thunk لجلب الليفلات الخاصة بكورس معين
export const fetchLevelsByCourseId = createAsyncThunk(
  'singleCourse/fetchLevelsByCourseId',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/levels?courseId=${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const singleCourseSlice = createSlice({
  name: 'singleCourse',
  initialState: {
    course: null,
    courseLoading: false,
    courseError: null,

    levels: [],
    levelsLoading: false,
    levelsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🟦 الكورس
      .addCase(fetchSingleCourse.pending, (state) => {
        state.courseLoading = true;
        state.courseError = null;
      })
      .addCase(fetchSingleCourse.fulfilled, (state, action) => {
        state.courseLoading = false;
        state.course = action.payload;
      })
      .addCase(fetchSingleCourse.rejected, (state, action) => {
        state.courseLoading = false;
        state.courseError = action.payload;
      })

      // 🟩 الليفلات
      .addCase(fetchLevelsByCourseId.pending, (state) => {
        state.levelsLoading = true;
        state.levelsError = null;
      })
      .addCase(fetchLevelsByCourseId.fulfilled, (state, action) => {
        state.levelsLoading = false;
        state.levels = action.payload;
      })
      .addCase(fetchLevelsByCourseId.rejected, (state, action) => {
        state.levelsLoading = false;
        state.levelsError = action.payload;
      });
  },
});

export default singleCourseSlice.reducer;
