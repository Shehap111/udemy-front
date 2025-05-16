import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// دالة تسجيل الدخول (Async Thunk)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true } // السماح للكوكيز بالتخزين تلقائيًا
      );
      return response.data.user; // بيرجع بيانات المستخدم فقط بدون التوكن
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Login failed" });
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        // المستخدم مش مسجل دخول، فمش لازم تظهر error مزعج
        return rejectWithValue(null); // أو رسالة بسيطة لو حبيت
      }
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Failed to fetch user"
      );
    }
  }
);

// دالة تسجيل الخروج
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      return null;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Logout failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // تسجيل الدخول
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // جلب بيانات المستخدم
.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
.addCase(fetchUser.rejected, (state, action) => {
  state.loading = false;
  state.user = null;
  // هنا تقدر تسكت تمامًا لو مفيش رسالة، أو تتعامل على حسب الحالة
  state.error = action.payload || null;
})

      // تسجيل الخروج
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Logout failed";
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
