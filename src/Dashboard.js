import "./Dashboard.css";
import AdminChat from "./AdminChat";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function Dashboard({ products = [], cart = [], onLogout }) {
  const totalRevenue = cart.reduce((sum, item) => sum + item.price, 0);
  const categories = [...new Set(products.map(p => p.category))];

  const handleLogout = async () => {
    await signOut(auth);
    onLogout(); // tell App.js to reset state
  };

  return (
    <div className="dashboard">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>📊 Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-cards">
        <div className="dash-card">
          <h3>{products.length}</h3>
          <p>Total Products</p>
        </div>

        <div className="dash-card">
          <h3>{cart.length}</h3>
          <p>Cart Items</p>
        </div>

        <div className="dash-card">
          <h3>₹{Math.round(totalRevenue * 80)}</h3>
          <p>Total Revenue</p>
        </div>

        <div className="dash-card">
          <h3>{categories.length}</h3>
          <p>Categories</p>
        </div>
      </div>

      <hr style={{ margin: "30px 0" }} />
      <AdminChat />
    </div>
  );
}

export default Dashboard;
