import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchArticles = createAsyncThunk(
    'Articles/fetchArticles',
    async (thunkAPI) => {
        const res = await fetch(`${BASE_URL}/api/articles`);
        const data = await res.json();
        return data
    }
)
const articlesSlice = createSlice({
    name: "articles",
    initialState: {
        articles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers:(builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
            state.loading = true
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false
                state.articles=action.payload
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false
                state.error= action.error.message
        })
    }
})

export default articlesSlice.reducer