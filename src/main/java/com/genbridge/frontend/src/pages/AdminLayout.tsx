import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  const linkStyle = (path: string) =>
    location.pathname === path ? "font-bold text-blue-600" : "text-gray-700";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div style={{ width: 220, padding: 20, borderRight: "1px solid #eee" }}>
        <h2>Admin Panel</h2>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Link to="/admin" className={linkStyle("/admin")}>
            Dashboard
          </Link>
          <Link to="/admin/pending" className={linkStyle("/admin/pending")}>
            Pending
          </Link>
          <Link to="/admin/approved" className={linkStyle("/admin/approved")}>
            Approved
          </Link>
          <Link to="/admin/rejected" className={linkStyle("/admin/rejected")}>
            Rejected
          </Link>
          <Link to="/learn">View Learn Page</Link>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 30 }}>
        <Outlet />
      </div>
    </div>
  );
}
