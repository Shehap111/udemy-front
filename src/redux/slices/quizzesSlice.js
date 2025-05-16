import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Action to fetch courses
export const fetchCourses = createAsyncThunk(
  'quizzes/fetchCourses',
  async () => {
    const response = await fetch(`${BASE_URL}/api/courses`);
    const data = await response.json();
    return data.data || [];
  }
);

// Action to fetch levels based on courseId
export const fetchLevels = createAsyncThunk(
  'quizzes/fetchLevels',
  async (courseId) => {
    const response = await fetch(`${BASE_URL}/api/levels?courseId=${courseId}`);
    const data = await response.json();

    // Handle unexpected API responses
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.levels && Array.isArray(data.levels)) return data.levels;

    throw new Error("Unexpected API response structure");
  }
);

// Action to create a new quiz
export const createQuiz = createAsyncThunk(
  'quizzes/createQuiz',
  async (quizData) => {
    const response = await fetch( `${BASE_URL}/api/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create quiz");
    return data;
  }
);

// Action to fetch all quizzes
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async () => {
    const response = await fetch(`${BASE_URL}/api/quizzes`);
    const data = await response.json();
    return data.data || [];
  }
);

// Action to update quiz status (activate/deactivate)
export const updateQuizStatus = createAsyncThunk(
  'quizzes/updateQuizStatus',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/quizzes/${quizId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to update status');
      return quizId; // Return the quizId to update in state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to delete a quiz
export const deleteQuiz = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/quizzes/${quizId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete quiz');
      return quizId; // Return the quizId to remove from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState: {
    courses: [],
    levels: [],
    quizzes: [],
    status: 'idle',
    error: null
  },
  reducers: {
    resetLevels: (state) => {
      state.levels = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Fetch Levels
      .addCase(fetchLevels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.levels = action.payload;
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Create Quiz
      .addCase(createQuiz.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createQuiz.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Update Quiz Status (Activate/Deactivate)
      .addCase(updateQuizStatus.fulfilled, (state, action) => {
        const quizId = action.payload;
        const quiz = state.quizzes.find((quiz) => quiz._id === quizId);
        if (quiz) {
          quiz.isActive = !quiz.isActive;
        }
      })
      .addCase(updateQuizStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Quiz
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        const quizId = action.payload;
        state.quizzes = state.quizzes.filter((quiz) => quiz._id !== quizId);
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { resetLevels } = quizzesSlice.actions;
export default quizzesSlice.reducer;
