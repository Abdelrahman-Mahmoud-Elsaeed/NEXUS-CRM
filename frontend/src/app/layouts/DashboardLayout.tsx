import { Navbar } from "@/shared/components/layout/Navbar/Navbar";
import { Sidebar } from "@/shared/components/layout/Sidebar/Sidebar";
import { Outlet, Navigate } from "react-router-dom";

export default function DashboardLayout() {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar></Sidebar>
      <main className="flex-1 flex flex-col min-w-0">
        <Navbar></Navbar>

        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}