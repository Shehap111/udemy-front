import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// إضافة مستوى جديد
export const addLevel = createAsyncThunk(
  'levels/addLevel',
  async (levelData) => {
    const response = await fetch(`${BASE_URL}/api/levels/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(levelData),
    });
    return await response.json();
  }
);

// جلب جميع المستويات
export const fetchLevels = createAsyncThunk(
  'levels/fetchLevels', // تم تعديل الاسم هنا
  async () => {
    const res = await fetch(`${BASE_URL}/api/levels/all`);
    const data = await res.json();
    return data
  }
);

const levelsSlice = createSlice({
  name: 'levels',
  initialState: {
    levels: [], // إضافة مستويات الدورات هنا
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLevels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.levels = action.payload; // تخزين البيانات المسترجعة
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addLevel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addLevel.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default levelsSlice.reducer;
