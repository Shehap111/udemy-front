"use client";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import '../profile.css'
const Edit = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

useEffect(() => {

}, [user, loading, router]);


  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/login");
  };

  // لو الـ loading شغال أو مفيش بيانات للـ user، هنظهر حاجة أخرى بدلاً من الصفحة
  if (loading) {
    return <div>Loading...</div>; // ممكن تحط هنا Loading Spinner بدل النص ده
  }

  if (!user) return null; // منع الوميض قبل ما الداتا توصل

return (
  <>
<div className="profile_edit">
<div className="container">

      <div className="">
        <img
          src={user?.profileImage || "/default-avatar.png"}
          alt="Profile"
          className=""
        />
      </div>

      <div className="mb-4">
        <p><span className="font-medium">firstName:</span> {user?.firstName}</p>
        <p><span className="font-medium">lastName:</span> {user?.lastName}</p>
        <p><span className="font-medium">Email:</span> {user?.email}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/edit-profile")}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      
</div>

  </div>
  
  </>
  );
};

export default Edit;
