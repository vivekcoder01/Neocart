import "./Dashboard.css";

function Dashboard({ products, cart }) {
  // Calculate revenue
  const totalRevenue = cart.reduce((sum, item) => sum + item.price, 0);

  // Unique categories
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="dashboard">
      <h2>📊 Admin Dashboard</h2>

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
    </div>
  );
}

export default Dashboard;
