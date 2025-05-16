import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCategorys = createAsyncThunk(
    'categories/fetchCategories',
    async (thunkAPI) => {
        const res = await fetch(`${BASE_URL}/api/categories`)
        const data = await res.json();
        return data;
    }

)
const categorySlice = createSlice({
    name: "categorys",
    initialState: {
        Categorys: [],
        loading: false,
        error: null,
        
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategorys.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCategorys.fulfilled, (state, action) => {
                state.loading = false;
                state.Categorys = action.payload; // هنا بنحفظ الكاتيجوريز اللي رجعت من الـ API
            })
            .addCase(fetchCategorys.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
    }
});

export default categorySlice.reducer;