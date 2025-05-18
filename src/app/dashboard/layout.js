import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* الشريط الجانبي ثابت */}
      <Sidebar />

      {/* المحتوى المتغيّر (يختلف حسب الصفحة) */}
      <main className="flex-grow-1 p-4 bg-light">{children}</main>
    </div>
  );
}
