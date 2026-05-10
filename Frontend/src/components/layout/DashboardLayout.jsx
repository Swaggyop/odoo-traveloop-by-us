import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-8 py-6">

        <Navbar />

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;