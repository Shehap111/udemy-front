"use client";

import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FaHome, FaBox, FaList, FaUser, FaCog, FaChartBar, FaSignOutAlt, FaClipboardList, FaBars } from "react-icons/fa";
import Link from "next/link";

export default function SidebarComp() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <Sidebar className="sidebar" collapsed={collapsed}>
        <Menu>
          <MenuItem className="Welcome" icon={<FaBars />} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "" : "Welcome Admin"}
          </MenuItem>

          {/* Home */}
          <MenuItem icon={<FaHome />} component={<Link href="/dashboard" />}>Home</MenuItem>

          {/* Products */}
          <MenuItem icon={<FaBox />} component={<Link href="/dashboard/quiz" />}>quizzes</MenuItem>

          {/* Categories */}
          <MenuItem icon={<FaList />} component={<Link href="/dashboard/categories" />}>Categories</MenuItem>

          {/* Courses */}
          <MenuItem icon={<FaUser />} component={<Link href="/dashboard/courses" />}>Courses</MenuItem>

          {/* Blogs */}
          <MenuItem icon={<FaUser />} component={<Link href="/dashboard/level" />}>level</MenuItem>
          
          {/* Users */}
          <MenuItem icon={<FaUser />} component={<Link href="/dashboard/users" />}>Users</MenuItem>
          

          {/* Logout */}
          <MenuItem icon={<FaSignOutAlt />}>Logout</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}