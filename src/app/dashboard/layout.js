import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar ثابت */}
      <Sidebar />

      {/* المحتوى المتغير (حسب الصفحة) */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
