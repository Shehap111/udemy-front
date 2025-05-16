"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/slices/authSlice";

const FetchUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser()); // تحميل بيانات المستخدم عند تشغيل التطبيق
  }, [dispatch]);

  return null; // لا يحتاج إلى أي UI
};

export default FetchUser;
