import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    discount: 0,
    discountType: '', // إضافة حقل لتخزين نوع الخصم
    errorMessage: '',
    loading: false,
  },
  reducers: {
    applyCouponStart: (state) => {
      state.loading = true;
      state.errorMessage = '';
    },
    applyCouponSuccess: (state, action) => {
      state.loading = false;
      state.discount = action.payload.discountValue;  // حفظ قيمة الخصم
      state.discountType = action.payload.discountType; // حفظ نوع الخصم
    },
    applyCouponFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
  },
});

// ✅ تصدير الأكشنات
export const { applyCouponStart, applyCouponSuccess, applyCouponFailure } = couponSlice.actions;

// ✅ تصدير الريدييوسر
export default couponSlice.reducer;

// ✅ الثانك بتاع تطبيق الكوبون
export const applyCoupon = (code) => async (dispatch) => {
  dispatch(applyCouponStart());
  try {
    const response = await axios.post(`http://localhost:5000/api/coupons/apply`, { code });

    if (response.data && response.data.discountValue !== undefined) {
      dispatch(applyCouponSuccess(response.data)); // إرسال البيانات للـ reducer
      return { success: true, discountValue: response.data.discountValue }; // إرجاع الخصم
    } else {
      throw new Error("استجابة غير صحيحة من السيرفر");
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    dispatch(applyCouponFailure(error.response?.data?.message || 'فشل في تطبيق الكوبون'));
    return { success: false, message: error.response?.data?.message || 'فشل في تطبيق الكوبون' };
  }
};
