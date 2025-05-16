import { createSlice } from '@reduxjs/toolkit';

const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'en';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    language: storedLang || 'en',
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
