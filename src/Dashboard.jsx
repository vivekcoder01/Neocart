import AdminChat from "./AdminChat";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Dashboard content */}
      <p>Welcome Admin</p>

      <hr style={{ margin: "30px 0" }} />
      <AdminChat />
    </div>
  );
}

export default Dashboard;
