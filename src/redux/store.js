import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import coursesReducer from "./slices/coursesSlice";
import levelsReducer from "./slices/levelsSlice";
import quizzesReducer from "./slices/quizzesSlice";
import categoryReducer from "./slices/categorySlice";
import articleReducer from "./slices/articlesSlice";
import singleCourseReducer from './slices/singleCourseSlice';
import cartReducer from './slices/cartSlice';
import couponReducer from './slices/couponSlice';
import languageReducer from './slices/languageSlice';
import contactReducer from './slices/contactSlice';
import adminRoutesReducer from './slices/adminRoutesSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    levels: levelsReducer,
    quizzes: quizzesReducer,
    categorys: categoryReducer,
    singleCourse: singleCourseReducer,
    cart: cartReducer,
    coupon: couponReducer,    
    articles:articleReducer,
    language: languageReducer,
    contact: contactReducer,
    adminRoutes: adminRoutesReducer,
  },
});
