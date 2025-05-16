// redux/slices/adminRoutesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // أو fetch حسب راحتك

const API_URL = 'http://localhost:5000/api';

// ✅ Async Actions

// 1. جلب المستويات
export const getLevels = createAsyncThunk(
    'adminRoutes/getLevels',
    async (_, { rejectWithValue }) => { // 👈 لا نحتاج أي باراميتر الآن
      try {
        const res = await axios.get(`${API_URL}/levels/all`, {
          withCredentials: true,
        });
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch levels');
      }
    }
  );
// 2. تحديث حالة المستوى
export const updateLevelStatus = createAsyncThunk(
  'adminRoutes/updateLevelStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/levels/${id}`,
        { isActive: !isActive },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

// 3. حذف مستوى
export const deleteLevel = createAsyncThunk(
  'adminRoutes/deleteLevel',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/levels/${id}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete level');
    }
  }
);

// 🧱 Initial State
const initialState = {
  levels: [],
  courses: {},
  loading: false,
  error: null,
  pagination: {
    pageIndex: 0,
    pageSize: 10,
    rowCount: 0,
  },
};

// 🪠 Slice
const adminRoutesSlice = createSlice({
  name: 'adminRoutes',
  initialState,
  reducers: {
    setCourses(state, action) {
      state.courses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔁 getLevels
      .addCase(getLevels.pending, (state) => {
        state.loading = true; // ✅ ابدأ باللودينج
        state.error = null;
      })
      .addCase(getLevels.fulfilled, (state, action) => {
        state.levels = action.payload || []; // ✅ بدون .data لأنك مش استخدمت pagination
        state.loading = false;
      })
      .addCase(getLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      // 🔁 updateLevelStatus
      .addCase(updateLevelStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLevelStatus.fulfilled, (state, action) => {
        const updatedLevel = action.payload.data;
        const index = state.levels.findIndex(
          (level) => level._id === updatedLevel._id
        );
        if (index !== -1) {
          state.levels[index] = updatedLevel;
        }
        state.loading = false;
      })
      .addCase(updateLevelStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      // 🔁 deleteLevel
      .addCase(deleteLevel.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLevel.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.levels = state.levels.filter(
          (level) => level._id !== deletedId
        );
        state.loading = false;
      })
      .addCase(deleteLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🧩 Export Actions + Reducer
export const { setCourses } = adminRoutesSlice.actions;

export default adminRoutesSlice.reducer;