"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "../redux/slices/authSlice";
import { Dropdown, Image } from "react-bootstrap";
import LoadingComponent from "../components/LoadingComponent"; 

const UserDropdown = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // لو مفيش كوكيز أساسًا معناها مفيش مستخدم مسجل دخول، يبقى منعرضش حاجة
  const cookies = typeof document !== "undefined" ? document.cookie : "";
  const hasToken = cookies.includes("token="); // عدل اسم الكوكي لو مختلف في الباك

  if (!cookies) return null;

  if (loading) return <LoadingComponent />;
  if (user === null) return null;

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" id="dropdown-user">
        <Image
          src={user?.profileImage || "/default-avatar.png"}
          alt="User Avatar"
          roundedCircle
          width="30"
          height="30"
          className="me-2"
        />
        {user?.firstName || "User"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/profile/edit">Profile</Dropdown.Item>
        <Dropdown.Item href="/profile/edit">My Courses</Dropdown.Item>
        <Dropdown.Item href="/settings">Settings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout} className="text-danger">
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserDropdown;
