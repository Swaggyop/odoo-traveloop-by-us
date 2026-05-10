import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#F7F5F0]">
      <Sidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;