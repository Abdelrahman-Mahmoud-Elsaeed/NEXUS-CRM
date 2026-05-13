import { Outlet, Navigate, Link } from "react-router-dom";

export default function DashboardLayout() {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r hidden md:block p-4">
        <h2 className="font-bold text-xl mb-6 text-primary">Nexus CRM</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/leads" className="hover:underline">Leads</Link>
          <Link to="/pipeline" className="hover:underline">Pipeline</Link>
          <Link to="/tasks" className="hover:underline">Tasks</Link>
          <Link to="/team" className="hover:underline">Team Members</Link>
          <Link to="/settings" className="hover:underline">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center px-6">
          <span className="font-semibold">Top Navigation</span>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}